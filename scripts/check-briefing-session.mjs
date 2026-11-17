// Explicit integration probe: existing fictitious identities, reads and denied calls only.
import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
import {randomUUID} from 'node:crypto';
process.loadEnvFile('.env.local');
let accounts;
try { accounts=JSON.parse(process.env.DIDEROT_DEMO_ACCOUNTS??'{}'); }
catch { throw Error('Configuração demonstrativa inválida; nenhum valor foi exibido.'); }
const make=()=>createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const columns='id,organization_id,title,revision,status,briefing,campaign_draft_slots(modality,quantity,briefing)';
let brandOrganization;
const checks=[];
for(const type of ['brand','creator','shopper']){
 const fixture=accounts[type];assert.equal(fixture?.email,`demo.${type}.diderot@example.invalid`);assert.ok(fixture.id&&fixture.password);
 const db=make();
 try {
  const login=await db.auth.signInWithPassword({email:fixture.email,password:fixture.password});assert.equal(login.error,null);assert.equal(login.data.user.id,fixture.id);
  if(type==='brand'){
   const org=await db.from('organizations').select('id,name,owner_user_id').eq('owner_user_id',fixture.id).eq('name','Ateliê Aurora · demonstração').single();assert.equal(org.error,null);assert.equal(org.data.owner_user_id,fixture.id);brandOrganization=org.data.id;
   const read=await db.from('campaign_drafts').select(columns).eq('organization_id',brandOrganization);assert.equal(read.error,null);assert.ok(read.data.length>=3);
   assert.ok(read.data.every(row=>row.status==='draft'&&row.organization_id===brandOrganization&&typeof row.briefing==='object'&&Array.isArray(row.campaign_draft_slots)&&row.campaign_draft_slots.every(slot=>typeof slot.briefing==='object')));
   checks.push('brand: real login and nested briefing columns readable for own fictional organization');
  }else{
   const read=await db.from('campaign_drafts').select(columns).eq('organization_id',brandOrganization);assert.equal(read.error,null);assert.equal(read.data.length,0);
   const denied=await db.rpc('save_campaign_draft',{p_organization:brandOrganization,p_id:randomUUID(),p_revision:0,p_request:randomUUID(),p_document:{}});assert.equal(denied.error?.code,'42501');
   checks.push(`${type}: real login, cross-organization read hidden and RPC denied`);
  }
 }finally{const logout=await db.auth.signOut({scope:'local'});assert.equal(logout.error,null);}
}
const anon=make();const read=await anon.from('campaign_drafts').select(columns).limit(1);assert.equal(read.error?.code,'42501');
const denied=await anon.rpc('save_campaign_draft',{p_organization:brandOrganization,p_id:randomUUID(),p_revision:0,p_request:randomUUID(),p_document:{}});assert.equal(denied.error?.code,'42501');
console.log(JSON.stringify({status:'passed',checks:[...checks,'anonymous read and RPC denied'],scope:'Existing configured example.invalid demo identities only; no successful business mutation, email or finance. Positive writes/retry/atomicity tested separately in SQL with rollback; not two Auth sessions editing by HTTP.'}));
