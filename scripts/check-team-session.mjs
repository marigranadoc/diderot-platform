import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const email=process.env.DIDEROT_TEST_EMAIL,password=process.env.DIDEROT_TEST_PASSWORD;
assert.ok(email?.endsWith('@example.invalid')&&password,'Use only the existing demo account through environment variables.');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
try{
 const login=await db.auth.signInWithPassword({email,password});assert.equal(login.error,null);
 const result=await db.rpc('organization_team',{p_action:'inbox'});assert.equal(result.error,null);assert.ok(Array.isArray(result.data?.invitations));
 assert.ok(result.data.invitations.every(item=>item.email===login.data.user.email.toLowerCase()));
 console.log(JSON.stringify({status:'passed',checks:['real_demo_auth_login','authenticated_inbox_rpc','recipient_scope'],limits:'Read-only inbox API check; authenticated mutations and two-person workflow tested separately in PostgreSQL with rollback fixtures.'}));
}finally{const logout=await db.auth.signOut({scope:'local'});assert.equal(logout.error,null);}
