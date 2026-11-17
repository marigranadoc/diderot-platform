import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {checkDocuments} from './check-docs.mjs';

async function removeFixture(root) {
  const resolved = path.resolve(root);
  assert.equal(path.dirname(resolved), path.resolve(tmpdir()));
  assert.ok(path.basename(resolved).startsWith('diderot-docs-'));
  await rm(resolved, {recursive: true, force: true});
}

test('documentação detecta anexo faltante e aceita sua restauração', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'diderot-docs-'));
  try {
    await mkdir(path.join(root, 'docs'));
    await writeFile(path.join(root, 'AGENTS.md'), 'Instruções preservadas');
    await writeFile(path.join(root, 'README.md'), '[PRD](docs/PRD.md)');
    await writeFile(path.join(root, 'docs/PRD.md'), '[Anexo](telas%20e%20fluxos.md#estados)');
    assert.equal((await checkDocuments(root)).errors.length, 1);
    await writeFile(path.join(root, 'docs/telas e fluxos.md'), '## Estados');
    assert.equal((await checkDocuments(root)).errors.length, 0);
  } finally { await removeFixture(root); }
});

test('não aprova referência para fora do projeto nem URL local malformada', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'diderot-docs-'));
  try {
    await mkdir(path.join(root, 'docs'));
    await writeFile(path.join(root, 'AGENTS.md'), 'Instruções preservadas');
    await writeFile(path.join(root, 'README.md'), '[Externo](https://example.com)\n[Local](../privado.md)\n[Inválido](%FF.md)');
    const result = await checkDocuments(root);
    assert.equal(result.errors.length, 2);
    assert.match(result.errors.join('\n'), /fora do projeto/);
    assert.match(result.errors.join('\n'), /URL local inválida/);
  } finally { await removeFixture(root); }
});
