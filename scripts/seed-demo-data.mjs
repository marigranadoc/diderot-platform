import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
import {randomUUID} from 'node:crypto';
process.loadEnvFile('.env.local');
const accounts=JSON.parse(process.env.DIDEROT_DEMO_ACCOUNTS??'{}');
const checks=[];
for(const type of ['shopper','creator','brand']){
 const account=accounts[type];assert.equal(account?.email,`demo.${type}.diderot@example.invalid`);assert.ok(account.id&&account.password);
 const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 try{
  const login=await db.auth.signInWithPassword({email:account.email,password:account.password});assert.equal(login.error,null);assert.equal(login.data.user.id,account.id);
  const existing=await db.from('account_profiles').select('user_id').eq('user_id',account.id).maybeSingle();assert.equal(existing.error,null);
  if(!existing.data){const saved=await db.rpc('complete_account_onboarding',{p_type:type,p_name:type==='shopper'?'Ana · demonstração':type==='creator'?'Clara · demonstração':'Marina · demonstração',p_city:'São Paulo',p_interests:type==='shopper'?['Moda','Beleza','Casa']:[],p_bio:'Creator fictícia para avaliação da Diderot. Produção de conteúdo sobre moda, beleza e casa.',p_modalities:['ugc','influencer','affiliate'],p_state:'SP',p_organization_name:'Ateliê Aurora · demonstração',p_website:'',p_organization_description:'Marca inteiramente fictícia para avaliar equipe e planejamento de campanhas. Não recebe compras ou pagamentos.'});assert.equal(saved.error,null);}
  if(type==='shopper'){
   for(const slug of ['bolsa-oliva','serum-botanico']){const read=await db.from('favorites').select('product_slug').eq('user_id',account.id).eq('product_slug',slug).maybeSingle();assert.equal(read.error,null);if(!read.data){const result=await db.from('favorites').insert({user_id:account.id,product_slug:slug});assert.equal(result.error,null);}}
  }
  if(type==='creator'){
   for(const service of [{title:'Vídeo UGC para rotina de beleza · demo',service_type:'ugc_video',pricing_mode:'starting',starting_price_cents:35000},{title:'Fotografia de produto · demo',service_type:'product_photo',pricing_mode:'quote',starting_price_cents:null}]){
    const read=await db.from('creator_services').select('id').eq('user_id',account.id).eq('title',service.title);assert.equal(read.error,null);if(!read.data.length){const result=await db.from('creator_services').insert({user_id:account.id,...service,description:'Serviço fictício, sem contratação ou pagamento ativo.'});assert.equal(result.error,null);}
   }
   const title='Estudo de conteúdo de beleza · demonstração',read=await db.from('creator_portfolio_items').select('id').eq('user_id',account.id).eq('title',title);assert.equal(read.error,null);
   if(!read.data.length){const result=await db.from('creator_portfolio_items').insert({user_id:account.id,title,item_type:'demo',category:'Beleza',participation:'Criação demonstrativa',description:'Projeto ilustrativo. Não representa trabalho comercial realizado para uma marca real.',media_url:'https://diderot-platform-ten.vercel.app/produto/serum-botanico'});assert.equal(result.error,null);}
  }
  if(type==='brand'){
   const org=await db.from('organizations').select('id').eq('owner_user_id',account.id).single();assert.equal(org.error,null);
   for(const campaign of [
    {title:'Rituais de cuidado · demonstração',campaign_type:'ugc',category:'Beleza',slots:[{modality:'ugc',quantity:3,budget_per_creator_cents:35000}]},
    {title:'Escolhas para o dia a dia · demonstração',campaign_type:'influencer',category:'Moda',slots:[{modality:'influencer',quantity:2,budget_per_creator_cents:80000}]},
    {title:'Uma casa com intenção · demonstração',campaign_type:'hybrid',category:'Casa',slots:[{modality:'ugc',quantity:2,budget_per_creator_cents:35000},{modality:'influencer',quantity:2,budget_per_creator_cents:80000}]},
   ]){
    const read=await db.from('campaign_drafts').select('id').eq('organization_id',org.data.id).eq('title',campaign.title);assert.equal(read.error,null);
    if(!read.data.length){const result=await db.rpc('save_campaign_draft',{p_organization:org.data.id,p_id:randomUUID(),p_revision:0,p_request:randomUUID(),p_document:{...campaign,description:'Campanha inteiramente fictícia para avaliação de cadastro e navegação. Sem inscrições, contratação ou cobrança.',objective:'Avaliar a experiência da Diderot',starts_on:'2027-02-01',ends_on:'2027-03-01',application_deadline:'2027-02-15'}});assert.equal(result.error,null);}
   }
  }
  const reread=await db.from('account_profiles').select('account_type,onboarding_completed').eq('user_id',account.id).single();assert.equal(reread.error,null);assert.equal(reread.data.account_type,type);assert.equal(reread.data.onboarding_completed,true);checks.push(`${type}: real login, setup and reread passed`);
 }finally{const logout=await db.auth.signOut({scope:'local'});assert.equal(logout.error,null);}
}
console.log(JSON.stringify({status:'passed',checks,scope:'Only three explicitly configured example.invalid demo accounts. Existing users untouched. No email, publication, contract or financial operation.'}));
