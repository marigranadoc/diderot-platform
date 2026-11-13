begin;
select set_config('test.account_a',gen_random_uuid()::text,true),set_config('test.account_b',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,created_at,updated_at) select current_setting(key)::uuid,'authenticated','authenticated',current_setting(key)||'@example.invalid',now(),now() from unnest(array['test.account_a','test.account_b']) key;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.account_a'),true);
select public.complete_account_onboarding('shopper','Shopper fixture','São Paulo',array['Moda','Casa']);
do $$ begin
 if not exists(select 1 from public.account_profiles where user_id=auth.uid() and account_type='shopper' and onboarding_completed and interests=array['Moda','Casa']) then raise exception 'Shopper profile not persisted'; end if;
 begin perform public.complete_account_onboarding('admin','Privilege attempt');raise exception 'Admin preference accepted';exception when invalid_parameter_value then null;end;
 begin perform public.complete_account_onboarding('creator','Invalid creator','','{}','',array[]::text[]);raise exception 'Empty creator modes accepted';exception when check_violation then null;end;
 if (select account_type from public.account_profiles where user_id=auth.uid())<>'shopper' or exists(select 1 from public.creator_profiles) then raise exception 'Failed setup left partial changes'; end if;
end $$;
select public.complete_account_onboarding('creator','Creator fixture','São Paulo','{}','UGC without followers',array['ugc'],'SP');
do $$ begin
 if not exists(select 1 from public.creator_profiles where user_id=auth.uid() and modalities=array['ugc']) then raise exception 'Creator context missing';end if;
 begin perform public.complete_account_onboarding('brand','Invalid brand','','{}','',array['ugc'],'','Invalid fixture','http://example.com');raise exception 'Invalid brand site accepted';exception when check_violation then null;end;
 if (select account_type from public.account_profiles where user_id=auth.uid())<>'creator' or exists(select 1 from public.organizations) then raise exception 'Failed brand setup left partial changes';end if;
end $$;
select public.complete_account_onboarding('brand','Brand fixture','','{}','',array['ugc'],'','Fixture organization');
select public.complete_account_onboarding('brand','Edited brand fixture','','{}','',array['ugc'],'','Edited fixture organization');
do $$ begin
 if (select count(*) from public.organizations where owner_user_id=auth.uid())<>1 or not exists(select 1 from public.organizations where owner_user_id=auth.uid() and name='Edited fixture organization') then raise exception 'Brand setup not idempotent';end if;
 if not exists(select 1 from public.organization_members where user_id=auth.uid() and role='owner') then raise exception 'Owner membership missing';end if;
 if has_column_privilege('authenticated','public.account_profiles','user_id','UPDATE') then raise exception 'Profile reassignment privilege granted';end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.account_b'),true);
do $$ declare amount int; begin
 if exists(select 1 from public.account_profiles) then raise exception 'Cross-user profile read';end if;
 update public.account_profiles set display_name='Cross-user write' where user_id=current_setting('test.account_a')::uuid;get diagnostics amount=row_count;if amount<>0 then raise exception 'Cross-user edit';end if;
 begin insert into public.account_profiles(user_id,account_type,display_name) values(current_setting('test.account_a')::uuid,'brand','Cross-user insert');raise exception 'Cross-user insertion';exception when insufficient_privilege then null;end;
end $$;
select public.complete_account_onboarding('brand','Unrelated brand','','{}','',array['ugc'],'','Unrelated fixture');
do $$ begin
 if (select count(*) from public.organizations)<>1 then raise exception 'Brand preference granted another organization';end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform * from public.account_profiles;raise exception 'Anonymous profile read';exception when insufficient_privilege then null;end;
 begin perform public.complete_account_onboarding('shopper','Anonymous fixture');raise exception 'Anonymous setup';exception when insufficient_privilege then null;end;
end $$;
reset role;
select 'PASS: shopper/creator/brand setup, atomic context/profile, repeated setup without duplicate organization, no admin or ownership escalation, cross-user RLS, anonymous denied' as result;
rollback;
