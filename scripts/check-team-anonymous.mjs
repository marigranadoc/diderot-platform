import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const result=await db.rpc('organization_team',{p_action:'inbox'});
assert.equal(result.error?.code,'42501');
console.log(JSON.stringify({status:'passed',check:'anonymous_team_rpc_denied',code:result.error.code}));
