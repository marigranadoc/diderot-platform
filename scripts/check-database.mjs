import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
  auth: {persistSession: false, autoRefreshToken: false},
  global: {fetch: (input, init) => fetch(input, {...init, signal: AbortSignal.timeout(15000)})},
});
for (const [table, count] of [['collections', 3], ['products', 8]]) {
  const {data, error} = await db.from(table).select('slug,is_demo');
  assert.equal(error, null, `${table}: leitura pública`);
  assert.equal(data.length, count);
  assert.ok(data.every(row => row.is_demo));
  console.log(`PASS ${table}: ${count} registros demonstrativos persistidos`);
}
// A nonexistent target tests write permission without touching catalog data.
const update = await db.from('products').update({name: 'Teste de bloqueio'}).eq('slug', 'audit-nonexistent-record');
assert.equal(update.error?.code, '42501', 'Visitante não pode atualizar o catálogo');
console.log('PASS escrita anônima bloqueada pela permissão do banco');
const reread = await db.from('products').select('name,price').eq('slug', 'bolsa-oliva').single();
assert.equal(reread.error, null);
assert.equal(reread.data.name, 'Bolsa Oliva');
assert.equal(reread.data.price, 389);
console.log('PASS releitura confirma dados preservados');
