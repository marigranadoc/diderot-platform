-- Run with a privileged test connection. All fixture users/rows are rolled back.
begin;
select set_config('test.user_a',gen_random_uuid()::text,true);
select set_config('test.user_b',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,created_at,updated_at)
select current_setting('test.user_a')::uuid,'authenticated','authenticated',current_setting('test.user_a')||'@example.invalid',now(),now()
union all
select current_setting('test.user_b')::uuid,'authenticated','authenticated',current_setting('test.user_b')||'@example.invalid',now(),now();
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.user_a'),true);
insert into public.favorites(user_id,product_slug) values (auth.uid(),'bolsa-oliva');
do $$ begin
  if (select count(*) from public.favorites) <> 1 then raise exception 'Owner cannot reread favorite'; end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.user_b'),true);
do $$ declare affected integer; begin
  if (select count(*) from public.favorites) <> 0 then raise exception 'Other user can read favorite'; end if;
  delete from public.favorites where user_id=current_setting('test.user_a')::uuid;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Other user can delete favorite'; end if;
  begin
    insert into public.favorites(user_id,product_slug) values (current_setting('test.user_a')::uuid,'camisa-linho');
    raise exception 'Spoofed owner insert was allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.favorites set user_id=auth.uid();
    raise exception 'Owner reassignment was allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.user_a'),true);
do $$ declare affected integer; begin
  delete from public.favorites where product_slug='bolsa-oliva';
  get diagnostics affected = row_count;
  if affected <> 1 then raise exception 'Owner cannot delete favorite'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
  begin
    perform * from public.favorites;
    raise exception 'Anonymous can access favorites';
  exception when insufficient_privilege then null;
  end;
end $$;
select 'PASS: owner insert/read/delete; cross-user read/delete/spoof/update denied; anonymous denied' as result;
rollback;
