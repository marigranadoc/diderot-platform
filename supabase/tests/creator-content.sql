-- Synthetic accounts and content; every write is rolled back.
begin;
select set_config('test.user_a',gen_random_uuid()::text,true);
select set_config('test.user_b',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,created_at,updated_at)
select current_setting('test.user_a')::uuid,'authenticated','authenticated',current_setting('test.user_a')||'@example.invalid',now(),now()
union all select current_setting('test.user_b')::uuid,'authenticated','authenticated',current_setting('test.user_b')||'@example.invalid',now(),now();
insert into public.creator_profiles(user_id,professional_name,modalities)
select current_setting('test.user_a')::uuid,'Test A',array['ugc']
union all select current_setting('test.user_b')::uuid,'Test B',array['ugc'];
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.user_a'),true);
insert into public.creator_services(user_id,title,service_type,pricing_mode) values(auth.uid(),'Test service','ugc_video','quote');
insert into public.creator_portfolio_items(user_id,title,item_type,media_url) values(auth.uid(),'Test portfolio','demo','https://example.com/test');
do $$ declare table_name text; amount integer; begin
 foreach table_name in array array['creator_services','creator_portfolio_items'] loop
  execute format('select count(*) from public.%I',table_name) into amount;
  if amount<>1 then raise exception 'Owner cannot reread %',table_name; end if;
  execute format('update public.%I set title=''Own edit'' where user_id=auth.uid()',table_name);
  get diagnostics amount=row_count;
  if amount<>1 then raise exception 'Owner cannot edit %',table_name; end if;
 end loop;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.user_b'),true);
do $$ declare table_name text; amount integer; begin
 foreach table_name in array array['creator_services','creator_portfolio_items'] loop
  execute format('select count(*) from public.%I',table_name) into amount;
  if amount<>0 then raise exception 'Other owner can read %',table_name; end if;
  execute format('update public.%I set title=''Unauthorized''',table_name);
  get diagnostics amount=row_count;
  if amount<>0 then raise exception 'Other owner can edit %',table_name; end if;
  execute format('delete from public.%I',table_name);
  get diagnostics amount=row_count;
  if amount<>0 then raise exception 'Other owner can delete %',table_name; end if;
  begin
   execute format('update public.%I set user_id=auth.uid()',table_name);
   raise exception 'Owner transfer permitted on %',table_name;
  exception when insufficient_privilege then null; end;
 end loop;
 begin
  insert into public.creator_services(user_id,title,service_type,pricing_mode) values(current_setting('test.user_a')::uuid,'Spoof','ugc_video','quote');
  raise exception 'Spoofed service insert allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.creator_portfolio_items(user_id,title,item_type,media_url) values(current_setting('test.user_a')::uuid,'Spoof','demo','https://example.com/test');
  raise exception 'Spoofed portfolio insert allowed';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.user_a'),true);
do $$ declare table_name text; amount integer; begin
 foreach table_name in array array['creator_services','creator_portfolio_items'] loop
  execute format('delete from public.%I where user_id=auth.uid()',table_name);
  get diagnostics amount=row_count;
  if amount<>1 then raise exception 'Owner cannot delete %',table_name; end if;
 end loop;
end $$;
reset role;
set local role anon;
do $$ declare table_name text; begin
 foreach table_name in array array['creator_services','creator_portfolio_items'] loop
  begin
   execute format('select id from public.%I',table_name);
   raise exception 'Anonymous access permitted on %',table_name;
  exception when insufficient_privilege then null; end;
 end loop;
end $$;
select 'PASS: services/portfolio owner CRUD, cross-user read/edit/delete/spoof/transfer and anonymous restrictions' as result;
rollback;
