import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const {error}=await db.from('creator_portfolio_items').select('id');
assert.equal(error?.code,'42501','A API não deve permitir leitura anônima do portfólio privado');
console.log('PASS: leitura anônima de portfólio negada pela API remota (42501).');
