-- Test fixtures only; no external messages. Everything is rolled back.
begin;
select set_config('test.user_a',gen_random_uuid()::text,true);
select set_config('test.user_b',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,created_at,updated_at)
select current_setting('test.user_a')::uuid,'authenticated','authenticated',current_setting('test.user_a')||'@example.invalid',now(),now()
union all
select current_setting('test.user_b')::uuid,'authenticated','authenticated',current_setting('test.user_b')||'@example.invalid',now(),now();
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.user_a'),true);
insert into public.creator_profiles(user_id,professional_name,modalities) values(auth.uid(),'UGC sem seguidores',array['ugc']);
update public.creator_profiles set modalities=array['ugc','influencer','affiliate'] where user_id=auth.uid();
do $$ begin
  if not exists(select 1 from public.creator_profiles where cardinality(modalities)=3) then raise exception 'Modalities not persisted'; end if;
  begin
    update public.creator_profiles set modalities=array['admin'] where user_id=auth.uid();
    raise exception 'Invalid modality accepted';
  exception when check_violation then null; end;
  begin
    update public.creator_profiles set user_id=current_setting('test.user_b')::uuid;
    raise exception 'Owner transfer allowed';
  exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.user_b'),true);
do $$ declare affected integer; begin
  if (select count(*) from public.creator_profiles) <> 0 then raise exception 'Other owner profile exposed'; end if;
  update public.creator_profiles set professional_name='Unauthorized' where user_id=current_setting('test.user_a')::uuid;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Other owner changed profile'; end if;
  begin
    insert into public.creator_profiles(user_id,professional_name,modalities) values(current_setting('test.user_a')::uuid,'Spoofed',array['ugc']);
    raise exception 'Spoofed insert allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role anon;
do $$ begin
  begin
    perform * from public.creator_profiles;
    raise exception 'Anonymous access allowed';
  exception when insufficient_privilege then null; end;
end $$;
select 'PASS: UGC/hybrid persistence, valid modalities, ownership and anonymous restrictions' as result;
rollback;
