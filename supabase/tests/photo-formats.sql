begin;
select set_config('test.photo_actor',gen_random_uuid()::text,true),set_config('test.photo_other',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
select current_setting(key)::uuid,'authenticated','authenticated',current_setting(key)||'@example.invalid',now(),now(),now() from unnest(array['test.photo_actor','test.photo_other']) key;
insert into public.creator_profiles(user_id,professional_name,modalities) values(current_setting('test.photo_actor')::uuid,'Photo fixture',array['affiliate']);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.photo_actor'),true);
do $$ declare extension text; mime text; object_name text; begin
 foreach extension in array array['webp','png','jpg'] loop
  mime:=case extension when 'webp' then 'image/webp' when 'png' then 'image/png' else 'image/jpeg' end;
  object_name:=auth.uid()::text||'/creator/'||gen_random_uuid()::text||'.'||extension;
  insert into storage.objects(bucket_id,name,owner_id,metadata) values('diderot-media',object_name,auth.uid()::text,jsonb_build_object('mimetype',mime));
  perform public.save_profile_photo('creator',auth.uid(),object_name);
  if not exists(select 1 from public.profile_photos where object_path=object_name and owner_user_id=auth.uid()) then raise exception 'Photo not confirmed';end if;
  begin perform public.save_profile_photo('creator',auth.uid(),replace(object_name,auth.uid()::text,current_setting('test.photo_other')));raise exception 'Foreign media accepted';exception when invalid_parameter_value then null;end;
 end loop;
 object_name:=auth.uid()::text||'/creator/'||gen_random_uuid()::text||'.png';
 insert into storage.objects(bucket_id,name,owner_id,metadata) values('diderot-media',object_name,auth.uid()::text,'{"mimetype":"image/jpeg"}');
 begin perform public.save_profile_photo('creator',auth.uid(),object_name);raise exception 'Mismatched MIME accepted';exception when invalid_parameter_value then null;end;
 begin insert into storage.objects(bucket_id,name,owner_id,metadata) values('diderot-media',auth.uid()::text||'/creator/'||gen_random_uuid()::text||'.svg',auth.uid()::text,'{"mimetype":"image/svg+xml"}');raise exception 'SVG accepted';exception when insufficient_privilege then null;end;
 begin insert into storage.objects(bucket_id,name,owner_id,metadata) values('diderot-media',current_setting('test.photo_other')||'/shop/'||gen_random_uuid()::text||'.png',auth.uid()::text,'{"mimetype":"image/png"}');raise exception 'Foreign folder accepted';exception when insufficient_privilege then null;end;
end; $$;
reset role;
rollback;

select 'photo_formats_rls_passed' as result;
