import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {setTimeout as delay} from 'node:timers/promises';

// Own the direct Node processes: no shell wrappers left running on Windows.
const children = new Set();
function run(args) {
  const child = spawn(process.execPath, args, {stdio: 'inherit'});
  children.add(child);
  child.done = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code) => { children.delete(child); resolve(code ?? 1); });
  });
  return child;
}
async function stop() {
  for (const child of [...children]) {
    child.kill('SIGTERM');
    await Promise.race([child.done.catch(() => {}), delay(3000)]);
    if (children.has(child)) {
      child.kill('SIGKILL');
      await child.done;
    }
  }
}
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => { await stop(); process.exit(130); });
}
try {
  // Refuse to test an unrelated server already using the audit port.
  await new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(3101, '127.0.0.1', () => probe.close(resolve));
  });
  const server = run(['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3101']);
  const deadline = Date.now() + 30000;
  while (true) {
    if (!children.has(server)) throw new Error('O servidor de testes encerrou antes de iniciar.');
    try {
      const response = await fetch('http://127.0.0.1:3101', {signal: AbortSignal.timeout(1000)});
      await response.body?.cancel();
      if (response.ok) break;
    } catch {}
    if (Date.now() > deadline) throw new Error('O servidor de testes não iniciou em 30 segundos.');
    await delay(250);
  }
  process.exitCode = await run(['node_modules/@playwright/test/cli.js', 'test', ...process.argv.slice(2)]).done;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await stop();
}
