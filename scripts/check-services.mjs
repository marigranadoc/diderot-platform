import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const {error}=await db.from('creator_services').select('id');
assert.equal(error?.code,'42501','A API não deve permitir leitura anônima dos serviços privados');
console.log('PASS: leitura anônima dos serviços negada pela API remota (42501).');
