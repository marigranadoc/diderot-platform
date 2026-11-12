import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const email=process.env.DIDEROT_TEST_EMAIL,password=process.env.DIDEROT_TEST_PASSWORD;
assert.ok(email&&password,'Informe credenciais de uma conta demonstrativa nas variáveis DIDEROT_TEST_EMAIL/PASSWORD.');
const client=()=>createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const first=client(),second=client(),serviceId=randomUUID(),portfolioId=randomUUID();
let owner,addedFavorite;
const checks=[];
try{
 const login=await first.auth.signInWithPassword({email,password});assert.equal(login.error,null);owner=login.data.user.id;checks.push('login_real');
 const profile=await first.from('creator_profiles').select('user_id').eq('user_id',owner).single();assert.equal(profile.error,null);checks.push('perfil_proprio');
 const service=await first.from('creator_services').insert({id:serviceId,user_id:owner,title:`Teste automatizado ${serviceId}`,service_type:'ugc_video',pricing_mode:'quote'}).select('id').single();assert.equal(service.error,null);
 const portfolio=await first.from('creator_portfolio_items').insert({id:portfolioId,user_id:owner,title:`Teste automatizado ${portfolioId}`,item_type:'demo',media_url:'https://example.com/test-only'}).select('id').single();assert.equal(portfolio.error,null);checks.push('criacao_real_servico_portfolio');
 const relogin=await second.auth.signInWithPassword({email,password});assert.equal(relogin.error,null);
 for(const [table,id] of [['creator_services',serviceId],['creator_portfolio_items',portfolioId]]){
  const reread=await second.from(table).select('id').eq('user_id',owner).eq('id',id).single();assert.equal(reread.error,null);assert.equal(reread.data.id,id);
  const edit=await second.from(table).update({title:`Teste editado ${id}`}).eq('user_id',owner).eq('id',id).select('title').single();assert.equal(edit.error,null);assert.equal(edit.data.title,`Teste editado ${id}`);
 }
 checks.push('releitura_e_edicao_em_segunda_sessao');
 const saved=await first.from('favorites').select('product_slug').eq('user_id',owner);assert.equal(saved.error,null);
 const products=await first.from('products').select('slug');assert.equal(products.error,null);
 const candidate=products.data.find(p=>!saved.data.some(f=>f.product_slug===p.slug));
 if(candidate){
  const add=await first.from('favorites').insert({user_id:owner,product_slug:candidate.slug}).select('product_slug').single();assert.equal(add.error,null);addedFavorite=candidate.slug;
  const read=await second.from('favorites').select('product_slug').eq('user_id',owner).eq('product_slug',addedFavorite).single();assert.equal(read.error,null);checks.push('favorito_persistido_em_segunda_sessao');
 }else checks.push('favoritos_ja_preenchidos_sem_alteracao');
}finally{
 if(owner){
  for(const [table,id] of [['creator_services',serviceId],['creator_portfolio_items',portfolioId]]){
   const cleanup=await first.from(table).delete().eq('user_id',owner).eq('id',id);assert.equal(cleanup.error,null,'Falha ao limpar fixture própria');
   const remaining=await first.from(table).select('id').eq('user_id',owner).eq('id',id);assert.equal(remaining.error,null);assert.equal(remaining.data.length,0);
  }
  if(addedFavorite){const cleanup=await first.from('favorites').delete().eq('user_id',owner).eq('product_slug',addedFavorite);assert.equal(cleanup.error,null);}
  await first.auth.signOut({scope:'local'});await second.auth.signOut({scope:'local'});
 }
}
checks.push('fixtures_proprias_removidas');
console.log(JSON.stringify({date:new Date().toISOString(),status:'passed',checks,limits:'Uma conta demonstrativa em duas sessões. Não comprova isolamento entre duas identidades nem entrega de e-mail.'}));
