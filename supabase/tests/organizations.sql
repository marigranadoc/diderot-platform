-- Synthetic identities only. Every write is rolled back.
begin;
select set_config('test.org_user_a',gen_random_uuid()::text,true);
select set_config('test.org_user_b',gen_random_uuid()::text,true);
select set_config('test.org_user_c',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,created_at,updated_at)
select current_setting(key)::uuid,'authenticated','authenticated',current_setting(key)||'@example.invalid',now(),now()
from unnest(array['test.org_user_a','test.org_user_b','test.org_user_c']) as key;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.org_user_a'),true);
insert into public.organizations(name,website,description) values('Test Org A','https://example.com','Fixture');
select set_config('test.org_a',(select id::text from public.organizations where owner_user_id=auth.uid()),true);
do $$ declare amount int; begin
 if (select count(*) from public.organization_members where organization_id=current_setting('test.org_a')::uuid and user_id=auth.uid() and role='owner')<>1 then raise exception 'Owner membership missing'; end if;
 update public.organizations set name='Edited Org A' where id=current_setting('test.org_a')::uuid;
 get diagnostics amount=row_count;
 if amount<>1 then raise exception 'Owner cannot edit'; end if;
 begin
  insert into public.organizations(name) values('Duplicate owned organization');
  raise exception 'Duplicate organization allowed';
 exception when unique_violation then null; end;
 begin
  insert into public.organizations(name,owner_user_id) values('Spoof',current_setting('test.org_user_b')::uuid);
  raise exception 'Spoofed owner insert allowed';
 exception when insufficient_privilege then null; end;
 begin
  update public.organizations set owner_user_id=current_setting('test.org_user_b')::uuid where id=current_setting('test.org_a')::uuid;
  raise exception 'Owner transfer allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.organization_members(organization_id,user_id,role) values(current_setting('test.org_a')::uuid,current_setting('test.org_user_b')::uuid,'owner');
  raise exception 'Self-granted membership allowed';
 exception when insufficient_privilege then null; end;
 begin
  delete from public.organization_members where user_id=auth.uid();
  raise exception 'Owner membership deletion allowed';
 exception when insufficient_privilege then null; end;
 begin
  delete from public.organizations where id=current_setting('test.org_a')::uuid;
  raise exception 'Organization deletion allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.organizations(name,website) values('Invalid','http://example.com');
  raise exception 'Invalid website allowed';
 exception when check_violation then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.org_user_b'),true);
do $$ declare amount int; begin
 if exists(select 1 from public.organizations where id=current_setting('test.org_a')::uuid) then raise exception 'Other user reads organization'; end if;
 if exists(select 1 from public.organization_members where organization_id=current_setting('test.org_a')::uuid) then raise exception 'Other user reads membership'; end if;
 update public.organizations set name='Cross update' where id=current_setting('test.org_a')::uuid;
 get diagnostics amount=row_count;
 if amount<>0 then raise exception 'Cross-user update allowed'; end if;
end $$;
insert into public.organizations(name) values('Test Org B');
do $$ begin
 if (select count(*) from public.organizations)<>1 then raise exception 'Organization isolation failed'; end if;
end $$;
-- Trusted operator adds a read-only member fixture, not a public invitation API.
reset role;
insert into public.organization_members(organization_id,user_id,role)
values(current_setting('test.org_a')::uuid,current_setting('test.org_user_c')::uuid,'member');
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.org_user_c'),true);
do $$ declare amount int; begin
 if (select count(*) from public.organizations where id=current_setting('test.org_a')::uuid)<>1 then raise exception 'Linked member cannot read'; end if;
 if (select count(*) from public.organization_members)<>1 then raise exception 'Member sees other memberships'; end if;
 update public.organizations set name='Member edit' where id=current_setting('test.org_a')::uuid;
 get diagnostics amount=row_count;
 if amount<>0 then raise exception 'Read-only member edited organization'; end if;
 begin
  update public.organization_members set role='owner' where user_id=auth.uid();
  raise exception 'Member escalated role';
 exception when insufficient_privilege then null; end;
 if has_function_privilege('authenticated',(select p.oid from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='diderot_private' and p.proname='attach_organization_owner'),'execute') then raise exception 'Trigger function publicly executable'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform * from public.organizations; raise exception 'Anonymous organization read'; exception when insufficient_privilege then null; end;
 begin perform * from public.organization_members; raise exception 'Anonymous membership read'; exception when insufficient_privilege then null; end;
 begin insert into public.organizations(name) values('Anonymous'); raise exception 'Anonymous organization insert'; exception when insufficient_privilege then null; end;
end $$;
reset role;
do $$ begin
 if exists(select 1 from public.organizations where id=current_setting('test.org_a')::uuid and name<>'Edited Org A') then raise exception 'Unauthorized mutation persisted'; end if;
end $$;
select 'PASS: atomic owner membership, owner create/edit, duplicate and invalid input rejection, cross-organization isolation, read-only membership, no role escalation or anonymous access' as result;
rollback;
