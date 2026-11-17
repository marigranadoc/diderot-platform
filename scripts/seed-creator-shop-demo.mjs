// Mutating seed, intentionally separate from tests/setup. Only the existing fictional creator.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
assert.equal(process.env.NEXT_PUBLIC_SUPABASE_URL,'https://mbxpwrgfujnjonyxzvfw.supabase.co');
let fixture;try{fixture=JSON.parse(process.env.DIDEROT_DEMO_ACCOUNTS??'{}').creator;}catch{throw Error('Configuração demonstrativa inválida.');}
assert.equal(fixture?.email,'demo.creator.diderot@example.invalid');assert.ok(fixture.id&&fixture.password);
const make=()=>createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const db=make(),anon=make();
try{
 const login=await db.auth.signInWithPassword({email:fixture.email,password:fixture.password});assert.equal(login.error,null);assert.equal(login.data.user.id,fixture.id);
 const existing=await db.from('creator_shops').select('id,slug').eq('owner_user_id',fixture.id).maybeSingle();assert.equal(existing.error,null);
 if(existing.data){console.log(JSON.stringify({status:'preserved-existing-demo-shop',slug:existing.data.slug,scope:'No existing shop, image, profile or publication was overwritten.'}));}
 else{
  const id=randomUUID(),imagePath=`${fixture.id}/shop/${randomUUID()}.webp`;
  const uploaded=await db.storage.from('diderot-media').upload(imagePath,await readFile('public/products/vaso-organico.webp'),{contentType:'image/webp',cacheControl:'60',upsert:false});assert.equal(uploaded.error,null);
  const privateImage=await anon.storage.from('diderot-media').createSignedUrl(imagePath,60);assert.ok(privateImage.error);
  const item=(slug,name,brand,price)=>({id:randomUUID(),source_slug:slug,name,brand,description:'Produto, marca e preço demonstrativos. Fotografia real ilustrativa.',category:'',price_cents:price,url:'',image_path:null,visible:true,is_affiliate:false});
  const items=[item('bolsa-oliva','Bolsa Oliva','Estúdio Um',38900),item('vaso-organico','Vaso orgânico','Barro & Forma',17900)];
  const post={id:randomUUID(),title:'Uma casa com intenção · demonstração',caption:'Post fictício para experimentar fotos e produtos associados. Nenhuma compra, comissão ou contratação ativa.',image_path:imagePath,visible:true,item_ids:[items[1].id]};
  const doc={name:'Clara · demonstração',bio:'Loja fictícia para avaliar a configuração da Diderot. Produtos e preços de exemplo; nenhuma compra ou comissão ativa.',social_links:[{label:'Instagram',url:'https://www.instagram.com/'},{label:'TikTok',url:'https://www.tiktok.com/'},{label:'YouTube',url:'https://www.youtube.com/'}],items,posts:[post],collections:[{id:randomUUID(),title:'Minhas escolhas',description:'Curadoria demonstrativa',layout:'shelves',visible:true,item_ids:items.map(x=>x.id),post_ids:[]},{id:randomUUID(),title:'Inspirações de casa',description:'Fotos e escolhas para a casa',layout:'editorial',visible:true,item_ids:[items[1].id],post_ids:[post.id]}]};
  const slug='clara-demonstracao',request=randomUUID();const params={p_id:id,p_slug:slug,p_revision:0,p_request:request,p_action:'save',p_document:doc};
  const saved=await db.rpc('save_creator_shop',params);assert.equal(saved.error,null);assert.equal(saved.data.revision,1);
  const retry=await db.rpc('save_creator_shop',params);assert.equal(retry.error,null);assert.equal(retry.data.revision,1);
  const hidden=await anon.rpc('get_public_creator_shop',{p_slug:slug});assert.equal(hidden.error,null);assert.equal(hidden.data,null);
  const reread=await db.from('creator_shops').select('document,revision').eq('id',id).single();assert.equal(reread.error,null);assert.equal(reread.data.document.posts[0].image_path,imagePath);
  const published=await db.rpc('save_creator_shop',{...params,p_revision:1,p_request:randomUUID(),p_action:'publish',p_document:reread.data.document});assert.equal(published.error,null);assert.equal(published.data.revision,2);
  const publicShop=await anon.rpc('get_public_creator_shop',{p_slug:slug});assert.equal(publicShop.error,null);assert.equal(publicShop.data.document.posts.length,1);assert.equal(publicShop.data.document.items.length,2);assert.equal(publicShop.data.document.social_links.length,3);assert.equal(publicShop.data.owner_user_id,undefined);
  const signed=await anon.storage.from('diderot-media').createSignedUrl(imagePath,60);assert.equal(signed.error,null);
  const image=await fetch(signed.data.signedUrl);assert.equal(image.status,200);assert.ok(image.headers.get('content-type')?.includes('image/webp'));await image.arrayBuffer();
  console.log(JSON.stringify({status:'passed',slug,checks:['real Auth demo creator','actual private WebP upload','anonymous access denied before publish','draft save and reread','same request retry without duplicate or version increase','draft hidden from public RPC','explicit publication','anonymous public snapshot','social links and post-product associations','signed public image returns WebP'],scope:'Only new fictional creator shop and its illustrative post image. Existing user profiles, avatars, organizations, campaigns and other accounts untouched. No email or finance.'}));
 }
}finally{const logout=await db.auth.signOut({scope:'local'});assert.equal(logout.error,null);}
