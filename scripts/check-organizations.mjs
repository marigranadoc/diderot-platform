import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
process.loadEnvFile('.env.local');
const fixtures=JSON.parse(process.env.DIDEROT_ORG_TEST_ACCOUNTS??'null');
assert.ok(Array.isArray(fixtures)&&fixtures.length===2,'Provide two temporary fixture accounts through the environment.');
for(const fixture of fixtures)assert.ok(fixture.email===`${fixture.id}@example.invalid`&&fixture.password,'Only generated .invalid fixture identities are allowed.');
const make=()=>createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const first=make(),second=make(),other=make(),anonymous=make();
const clients=[first,second,other],checks=[];
try{
 for(const [client,fixture] of [[first,fixtures[0]],[second,fixtures[0]],[other,fixtures[1]]]){
  const login=await client.auth.signInWithPassword({email:fixture.email,password:fixture.password});assert.equal(login.error,null);assert.equal(login.data.user.id,fixture.id);
 }
 checks.push('two_real_auth_identities_and_three_sessions');
 const created=await first.from('organizations').insert({name:`Test organization ${fixtures[0].id}`,website:'https://example.com',description:'Temporary automated fixture'}).select('id,owner_user_id,name').single();
 assert.equal(created.error,null);assert.equal(created.data.owner_user_id,fixtures[0].id);const id=created.data.id;
 const member=await first.from('organization_members').select('role,user_id').eq('organization_id',id).single();assert.equal(member.error,null);assert.equal(member.data.role,'owner');assert.equal(member.data.user_id,fixtures[0].id);checks.push('organization_and_owner_membership_created');
 const read=await second.from('organizations').select('id').eq('id',id).single();assert.equal(read.error,null);assert.equal(read.data.id,id);
 const edited=await second.from('organizations').update({name:`Edited fixture ${fixtures[0].id}`}).eq('id',id).select('name').single();assert.equal(edited.error,null);
 const reread=await first.from('organizations').select('name').eq('id',id).single();assert.equal(reread.error,null);assert.equal(reread.data.name,edited.data.name);checks.push('reread_and_edit_between_real_sessions');
 const hidden=await other.from('organizations').select('id').eq('id',id);assert.equal(hidden.error,null);assert.deepEqual(hidden.data,[]);
 const cross=await other.from('organizations').update({name:'Forbidden'}).eq('id',id).select('id');assert.equal(cross.error,null);assert.deepEqual(cross.data,[]);
 const escalation=await other.from('organization_members').insert({organization_id:id,user_id:fixtures[1].id,role:'owner'});assert.equal(escalation.error?.code,'42501');
 const transfer=await first.from('organizations').update({owner_user_id:fixtures[1].id}).eq('id',id);assert.equal(transfer.error?.code,'42501');
 const duplicate=await first.from('organizations').insert({name:'Duplicate fixture'});assert.equal(duplicate.error?.code,'23505');
 const otherOrg=await other.from('organizations').insert({name:`Test organization ${fixtures[1].id}`}).select('id').single();assert.equal(otherOrg.error,null);assert.notEqual(otherOrg.data.id,id);checks.push('cross_organization_read_write_and_escalation_denied');
 for(const table of ['organizations','organization_members']){const result=await anonymous.from(table).select('*');assert.equal(result.error?.code,'42501');}
 checks.push('anonymous_api_denied');
 console.log(JSON.stringify({date:new Date().toISOString(),status:'passed',checks,limits:'Temporary generated Auth accounts, real API and database. Fixture cleanup must follow through the controlled database harness. No emails or financial services.'}));
}finally{
 const results=await Promise.all(clients.map(client=>client.auth.signOut({scope:'global'})));
 assert.ok(results.every(result=>!result.error),'Failed to revoke a fixture session before cleanup.');
}
