import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const accounts=JSON.parse(process.env.DIDEROT_DEMO_ACCOUNTS??'{}');
const make=()=>createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const clients=[],checks=[];
try{
 for(const type of ['shopper','creator','brand']){
  const fixture=accounts[type];assert.equal(fixture?.email,`demo.${type}.diderot@example.invalid`);const db=make();clients.push(db);
  const auth=await db.auth.signInWithPassword({email:fixture.email,password:fixture.password});assert.equal(auth.error,null);assert.equal(auth.data.user.id,fixture.id);
  const own=await db.from('account_profiles').select('user_id,account_type,display_name,interests').single();assert.equal(own.error,null);assert.equal(own.data.user_id,fixture.id);assert.equal(own.data.account_type,type);
  const other=accounts[type==='shopper'?'creator':'shopper'];
  const read=await db.from('account_profiles').select('user_id').eq('user_id',other.id);assert.equal(read.error,null);assert.deepEqual(read.data,[]);
  const edit=await db.from('account_profiles').update({display_name:'Forbidden cross-fixture edit'}).eq('user_id',other.id).select('user_id');assert.equal(edit.error,null);assert.deepEqual(edit.data,[]);
  const reassign=await db.from('account_profiles').update({user_id:other.id}).eq('user_id',fixture.id);assert.equal(reassign.error?.code,'42501');
  const admin=await db.rpc('complete_account_onboarding',{p_type:'admin',p_name:'Forbidden admin preference'});assert.equal(admin.error?.code,'22023');
  if(type==='creator'){
   const before=await db.from('creator_profiles').select('professional_name,modalities').single();assert.equal(before.error,null);
   const invalid=await db.rpc('complete_account_onboarding',{p_type:'creator',p_name:'Invalid fixture change',p_modalities:[]});assert.equal(invalid.error?.code,'23514');
   const after=await db.from('creator_profiles').select('professional_name,modalities').single();assert.equal(after.error,null);assert.deepEqual(after.data,before.data);
  }
  if(type==='brand'){
   const before=await db.from('organizations').select('name,website').eq('owner_user_id',fixture.id).single();assert.equal(before.error,null);
   const invalid=await db.rpc('complete_account_onboarding',{p_type:'brand',p_name:'Invalid fixture change',p_organization_name:'Invalid fixture organization',p_website:'http://example.com'});assert.equal(invalid.error?.code,'23514');
   const after=await db.from('organizations').select('name,website').eq('owner_user_id',fixture.id).single();assert.equal(after.error,null);assert.deepEqual(after.data,before.data);
   const org=await db.from('organizations').select('id').eq('owner_user_id',fixture.id).single();const rows=await db.from('campaign_drafts').select('id').eq('organization_id',org.data.id);assert.equal(rows.error,null);assert.equal(rows.data.length,3);
  }
  const after=await db.from('account_profiles').select('user_id,account_type,display_name,interests').single();assert.equal(after.error,null);assert.deepEqual(after.data,own.data);checks.push(`${type}: real Auth, own read, cross-user read/write denied, reassignment/admin denied, invalid setup leaves data unchanged`);
 }
 const sibling=make();clients.push(sibling);const siblingLogin=await sibling.auth.signInWithPassword({email:accounts.shopper.email,password:accounts.shopper.password});assert.equal(siblingLogin.error,null);
 const firstLogout=await clients[0].auth.signOut({scope:'local'});assert.equal(firstLogout.error,null);const siblingIdentity=await sibling.auth.getUser();assert.equal(siblingIdentity.error,null);assert.equal(siblingIdentity.data.user.id,accounts.shopper.id);checks.push('local signout preserves another real session of the shared demo account');
 const anon=make();for(const table of ['account_profiles','campaign_drafts']){const result=await anon.from(table).select('*').limit(1);assert.equal(result.error?.code,'42501');}
 const denied=await anon.rpc('complete_account_onboarding',{p_type:'shopper',p_name:'Anonymous fixture'});assert.equal(denied.error?.code,'42501');checks.push('anonymous profile/draft read and onboarding RPC denied');
 console.log(JSON.stringify({status:'passed',checks,scope:'Three explicitly authorized persistent demo identities. No successful user-data mutation in this probe; only logins, reads and rejected writes. Local signout in finally.'}));
}finally{for(const db of clients){const result=await db.auth.signOut({scope:'local'});assert.equal(result.error,null);}}
