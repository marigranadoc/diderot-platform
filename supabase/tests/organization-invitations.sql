begin;
select set_config('test.team_a',gen_random_uuid()::text,true),set_config('test.team_b',gen_random_uuid()::text,true),set_config('test.team_c',gen_random_uuid()::text,true),set_config('test.team_d',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
select current_setting(key)::uuid,'authenticated','authenticated',current_setting(key)||'@example.invalid',case when key='test.team_d' then null else now() end,now(),now()
from unnest(array['test.team_a','test.team_b','test.team_c','test.team_d']) key;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.team_a'),true);
insert into public.organizations(name) values('Invitation test organization');
select set_config('test.team_org',(select id::text from public.organizations where owner_user_id=auth.uid()),true);
select set_config('test.team_inv',(public.organization_team('invite',current_setting('test.team_org')::uuid,null,upper(current_setting('test.team_b')||'@example.invalid'))->'invitation'->>'id'),true);
do $$ declare data jsonb; begin
 data:=public.organization_team('invite',current_setting('test.team_org')::uuid,null,current_setting('test.team_b')||'@example.invalid');
 if data->'invitation'->>'id'<>current_setting('test.team_inv') then raise exception 'Duplicate invite not idempotent'; end if;
 begin perform public.organization_team('invite',current_setting('test.team_org')::uuid,null,'invalid'); raise exception 'Invalid email allowed'; exception when invalid_parameter_value then null; end;
 begin perform * from public.organization_invitations; raise exception 'Direct invite read allowed'; exception when insufficient_privilege then null; end;
 -- A guessed user ID outside this team must not affect a pending invitation
 -- or reveal whether its email belongs to that account.
 data:=public.organization_team('invite',current_setting('test.team_org')::uuid,null,current_setting('test.team_c')||'@example.invalid');
 perform public.organization_team('remove',current_setting('test.team_org')::uuid,null,null,current_setting('test.team_c')::uuid);
 if not exists(select 1 from jsonb_array_elements(public.organization_team('overview',current_setting('test.team_org')::uuid)->'invitations') i where i->>'id'=data->'invitation'->>'id' and i->>'status'='pending') then raise exception 'Removal of outsider affected invitation'; end if;
 perform public.organization_team('cancel',null,(data->'invitation'->>'id')::uuid);
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.team_c'),true);
insert into public.organizations(name) values('Unrelated organization');
do $$ begin
 if jsonb_array_length(public.organization_team('inbox')->'invitations')<>0 then raise exception 'Another person sees invite'; end if;
 begin perform public.organization_team('accept',null,current_setting('test.team_inv')::uuid); raise exception 'Wrong recipient accepted'; exception when insufficient_privilege then null; end;
 begin perform public.organization_team('cancel',null,current_setting('test.team_inv')::uuid); raise exception 'Another owner cancelled invite'; exception when insufficient_privilege then null; end;
 begin perform public.organization_team('overview',current_setting('test.team_org')::uuid); raise exception 'Another owner reads team'; exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.team_d'),true);
do $$ begin
 begin perform public.organization_team('inbox'); raise exception 'Unverified email admitted'; exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.team_b'),true);
do $$ declare data jsonb; amount int; begin
 if exists(select 1 from public.organizations where id=current_setting('test.team_org')::uuid) then raise exception 'Invitation already granted access'; end if;
 if jsonb_array_length(public.organization_team('inbox')->'invitations')<>1 then raise exception 'Recipient cannot see inbox'; end if;
 data:=public.organization_team('accept',null,current_setting('test.team_inv')::uuid);
 if data->'invitation'->>'status'<>'accepted' then raise exception 'Acceptance not confirmed'; end if;
 perform public.organization_team('accept',null,current_setting('test.team_inv')::uuid);
 if (select count(*) from public.organization_members where organization_id=current_setting('test.team_org')::uuid and user_id=auth.uid() and role='member')<>1 then raise exception 'Member role or idempotency failed'; end if;
 if not exists(select 1 from public.organizations where id=current_setting('test.team_org')::uuid) then raise exception 'Accepted member cannot read organization'; end if;
 update public.organizations set name='Forbidden member edit' where id=current_setting('test.team_org')::uuid;
 get diagnostics amount=row_count;if amount<>0 then raise exception 'Member can edit'; end if;
 begin perform public.organization_team('invite',current_setting('test.team_org')::uuid,null,current_setting('test.team_c')||'@example.invalid'); raise exception 'Member can invite'; exception when insufficient_privilege then null; end;
 begin update public.organization_members set role='owner' where user_id=auth.uid(); raise exception 'Member promoted itself'; exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.team_a'),true);
do $$ begin
 if jsonb_array_length(public.organization_team('overview',current_setting('test.team_org')::uuid)->'members')<>2 then raise exception 'Owner cannot see team'; end if;
 begin perform public.organization_team('remove',current_setting('test.team_org')::uuid,null,null,auth.uid()); raise exception 'Owner removed itself'; exception when invalid_parameter_value then null; end;
 perform public.organization_team('remove',current_setting('test.team_org')::uuid,null,null,current_setting('test.team_b')::uuid);
 perform public.organization_team('remove',current_setting('test.team_org')::uuid,null,null,current_setting('test.team_b')::uuid);
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.team_b'),true);
do $$ begin
 if exists(select 1 from public.organizations where id=current_setting('test.team_org')::uuid) then raise exception 'Revoked member still reads'; end if;
 begin perform public.organization_team('accept',null,current_setting('test.team_inv')::uuid); raise exception 'Revoked invite reused'; exception when invalid_parameter_value then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.team_a'),true);
select set_config('test.team_inv',(public.organization_team('invite',current_setting('test.team_org')::uuid,null,current_setting('test.team_b')||'@example.invalid')->'invitation'->>'id'),true);
select public.organization_team('cancel',null,current_setting('test.team_inv')::uuid);
select public.organization_team('cancel',null,current_setting('test.team_inv')::uuid);
select set_config('request.jwt.claim.sub',current_setting('test.team_b'),true);
do $$ begin
 begin perform public.organization_team('accept',null,current_setting('test.team_inv')::uuid); raise exception 'Cancelled invite accepted'; exception when invalid_parameter_value then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.team_a'),true);
select set_config('test.team_inv',(public.organization_team('invite',current_setting('test.team_org')::uuid,null,current_setting('test.team_b')||'@example.invalid')->'invitation'->>'id'),true);
select set_config('request.jwt.claim.sub',current_setting('test.team_b'),true);
select public.organization_team('decline',null,current_setting('test.team_inv')::uuid);
select public.organization_team('decline',null,current_setting('test.team_inv')::uuid);
select set_config('request.jwt.claim.sub',current_setting('test.team_a'),true);
select set_config('test.team_inv',(public.organization_team('invite',current_setting('test.team_org')::uuid,null,current_setting('test.team_b')||'@example.invalid')->'invitation'->>'id'),true);
reset role;
update public.organization_invitations set created_at=now()-interval '8 days',expires_at=now()-interval '1 day' where id=current_setting('test.team_inv')::uuid;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.team_b'),true);
do $$ begin
 if jsonb_array_length(public.organization_team('inbox')->'invitations')<>0 then raise exception 'Expired invitation in inbox'; end if;
 begin perform public.organization_team('accept',null,current_setting('test.team_inv')::uuid); raise exception 'Expired invite accepted'; exception when invalid_parameter_value then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.team_a'),true);
do $$ declare next_id text; begin
 next_id:=public.organization_team('invite',current_setting('test.team_org')::uuid,null,current_setting('test.team_b')||'@example.invalid')->'invitation'->>'id';
 if next_id=current_setting('test.team_inv') then raise exception 'Expired invite reused instead of replaced'; end if;
 if has_function_privilege('authenticated',(select p.oid from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='diderot_private' and p.proname='attach_organization_owner'),'execute') then raise exception 'Trigger execution was granted'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform public.organization_team('inbox'); raise exception 'Anonymous RPC admitted'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select 'PASS: verified recipient, owner-only management, accept/decline/cancel, expiry, duplicate retry, readonly membership, revocation and replay denial, cross-organization isolation, no direct writes or owner promotion' as result;
rollback;
