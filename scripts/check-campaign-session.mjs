import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const email=process.env.DIDEROT_TEST_EMAIL,password=process.env.DIDEROT_TEST_PASSWORD;
assert.ok(email?.endsWith('@example.invalid')&&password,'Use only the existing demo account through environment variables.');
const options={auth:{persistSession:false,autoRefreshToken:false}};
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,options);
const anon=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,options);
try{
 const publicRead=await anon.from('campaign_drafts').select('id').limit(1);assert.equal(publicRead.error?.code,'42501');
 const publicWrite=await anon.rpc('save_campaign_draft',{p_organization:crypto.randomUUID(),p_id:crypto.randomUUID(),p_revision:0,p_request:crypto.randomUUID(),p_document:{}});assert.equal(publicWrite.error?.code,'42501');
 const login=await db.auth.signInWithPassword({email,password});assert.equal(login.error,null);
 const result=await db.from('campaign_drafts').select('id,organization_id,title,revision,status,campaign_draft_slots(modality,quantity,budget_per_creator_cents)');assert.equal(result.error,null);assert.ok(Array.isArray(result.data));
 const orgs=await db.from('organizations').select('id');assert.equal(orgs.error,null);assert.ok(result.data.every(row=>orgs.data.some(org=>org.id===row.organization_id)));
 console.log(JSON.stringify({status:'passed',checks:['anonymous_table_read_denied','anonymous_rpc_denied','real_demo_auth_login','authenticated_nested_draft_read','organization_scope'],limits:'Read-only HTTP probe with an existing demo account. Mutations and cross-user isolation verified in PostgreSQL with rollback fixtures, not two HTTP logins.'}));
}finally{const logout=await db.auth.signOut({scope:'local'});assert.equal(logout.error,null);}
