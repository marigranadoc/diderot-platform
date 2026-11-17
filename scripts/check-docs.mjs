import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export async function checkDocuments(root) {
  const errors = [];
  let links = 0;
  const files = ['README.md', 'AGENTS.md'];
  async function collect(directory) {
    for (const entry of await readdir(path.join(root, directory), {withFileTypes: true})) {
      const relative = path.join(directory, entry.name);
      if (entry.isDirectory()) await collect(relative);
      else if (entry.name.endsWith('.md')) files.push(relative);
    }
  }
  await collect('docs');
  for (const file of files) {
    const source = await readFile(path.join(root, file), 'utf8');
    for (const match of source.matchAll(/!?\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
      const destination = match[1].replace(/^<|>$/g, '').split(/\s+"/)[0];
      if (/^(?:[a-z][a-z\d+.-]*:|#|\/)/i.test(destination)) continue;
      let decoded;
      try { decoded = decodeURIComponent(destination.split('#')[0]); }
      catch { errors.push(`${file}: URL local inválida: ${destination}`); continue; }
      if (!decoded) continue;
      const target = path.resolve(root, path.dirname(file), decoded);
      const relative = path.relative(root, target);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        errors.push(`${file}: link fora do projeto: ${destination}`);
        continue;
      }
      links++;
      try { await readFile(target); }
      catch { errors.push(`${file}: destino ausente ou ilegível: ${destination}`); }
    }
  }
  return {files: files.length, links, errors};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await checkDocuments(path.resolve(process.argv[2] ?? '.'));
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exitCode = 1;
}
