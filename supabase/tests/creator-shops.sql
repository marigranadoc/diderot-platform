begin;
select set_config('test.shop_a',gen_random_uuid()::text,true),set_config('test.shop_b',gen_random_uuid()::text,true),set_config('test.shop_c',gen_random_uuid()::text,true),set_config('test.shop_d',gen_random_uuid()::text,true),set_config('test.shop_id',gen_random_uuid()::text,true),set_config('test.shop_request',gen_random_uuid()::text,true),set_config('test.shop_item',gen_random_uuid()::text,true),set_config('test.shop_catalog',gen_random_uuid()::text,true),set_config('test.shop_hidden',gen_random_uuid()::text,true),set_config('test.shop_post',gen_random_uuid()::text,true),set_config('test.shop_section',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
select current_setting(key)::uuid,'authenticated','authenticated',current_setting(key)||'@example.invalid',case when key<>'test.shop_d' then now() end,now(),now() from unnest(array['test.shop_a','test.shop_b','test.shop_c','test.shop_d']) key;
insert into public.creator_profiles(user_id,professional_name,modalities)
select current_setting(key)::uuid,'Shop fixture',array['affiliate'] from unnest(array['test.shop_a','test.shop_b','test.shop_c','test.shop_d']) key;
select set_config('test.shop_avatar',current_setting('test.shop_a')||'/creator/'||gen_random_uuid()::text||'.webp',true),set_config('test.shop_image',current_setting('test.shop_a')||'/shop/'||gen_random_uuid()::text||'.webp',true),set_config('test.shop_secret',current_setting('test.shop_a')||'/shop/'||gen_random_uuid()::text||'.webp',true),set_config('test.shop_brand',current_setting('test.shop_a')||'/brand/'||gen_random_uuid()::text||'.webp',true);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.shop_a'),true);
insert into public.organizations(name) values('Shop fixture brand');
select set_config('test.shop_org',(select id::text from public.organizations where owner_user_id=auth.uid()),true);
insert into storage.objects(bucket_id,name,owner_id,metadata)
select 'diderot-media',current_setting(key),auth.uid()::text,'{"mimetype":"image/webp","size":128}' from unnest(array['test.shop_avatar','test.shop_image','test.shop_secret','test.shop_brand']) key;
select public.save_profile_photo('creator',auth.uid(),current_setting('test.shop_avatar'));
select public.save_profile_photo('brand',current_setting('test.shop_org')::uuid,current_setting('test.shop_brand'));
select set_config('test.shop_slug','fixture-'||substr(current_setting('test.shop_id'),1,8),true);
select set_config('test.shop_doc',jsonb_build_object(
 'name','Public fixture','bio','Public bio','social_links',jsonb_build_array(jsonb_build_object('label','Instagram','url','https://www.instagram.com/'),jsonb_build_object('label','TikTok','url','https://www.tiktok.com/'),jsonb_build_object('label','YouTube','url','https://www.youtube.com/')),
 'items',jsonb_build_array(
  jsonb_build_object('id',current_setting('test.shop_item'),'source_slug',null,'name','My recommendation','brand','Example','description','Personal recommendation','category','Casa','url','https://example.invalid/product','price_cents',15050,'image_path',current_setting('test.shop_image'),'visible',true,'is_affiliate',true),
  jsonb_build_object('id',current_setting('test.shop_catalog'),'source_slug','bolsa-oliva','name','Tampered canonical name','brand','Fake brand','description','My note','category','','url','https://example.invalid/tampered','price_cents',1,'image_path',null,'visible',true,'is_affiliate',true),
  jsonb_build_object('id',current_setting('test.shop_hidden'),'source_slug',null,'name','Hidden secret product','url','','image_path',current_setting('test.shop_secret'),'visible',false,'is_affiliate',false)
 ),
 'posts',jsonb_build_array(jsonb_build_object('id',current_setting('test.shop_post'),'title','Public post','caption','Photo and products','image_path',current_setting('test.shop_image'),'visible',true,'item_ids',jsonb_build_array(current_setting('test.shop_item'),current_setting('test.shop_hidden')))),
 'collections',jsonb_build_array(jsonb_build_object('id',current_setting('test.shop_section'),'title','Essentials','description','Selected items','layout','editorial','visible',true,'item_ids',jsonb_build_array(current_setting('test.shop_catalog'),current_setting('test.shop_item'),current_setting('test.shop_hidden')),'post_ids',jsonb_build_array(current_setting('test.shop_post'))))
 )::text,true);
do $$ declare saved jsonb; bad jsonb; doc jsonb:=current_setting('test.shop_doc')::jsonb; begin
 saved:=public.save_creator_shop(current_setting('test.shop_id')::uuid,current_setting('test.shop_slug'),0,current_setting('test.shop_request')::uuid,'save',doc);
 if (saved->>'revision')::int<>1 then raise exception 'Shop not created';end if;
 perform public.save_creator_shop(current_setting('test.shop_id')::uuid,current_setting('test.shop_slug'),0,current_setting('test.shop_request')::uuid,'save',doc);
 if (select count(*) from public.creator_shops)<>1 or (select revision from public.creator_shops)<>1 then raise exception 'Retry duplicated shop';end if;
 if public.get_public_creator_shop(current_setting('test.shop_slug')) is not null then raise exception 'Draft exposed publicly';end if;
 if (select document#>>'{items,1,name}' from public.creator_shops)<>(select name from public.products where slug='bolsa-oliva') or (select document#>>'{items,1,url}' from public.creator_shops)<>'' then raise exception 'Creator overwrote canonical catalog';end if;
 for bad in select * from jsonb_array_elements(jsonb_build_array(
  doc||'{"owner_user_id":"11111111-1111-4111-8111-111111111111"}',
  jsonb_set(doc,'{social_links,0,url}','"javascript:alert(1)"'),
  jsonb_set(doc,'{social_links,0,url}','"https://user:password@example.invalid/"'),
  jsonb_set(doc,'{items,0,price_cents}','1.5'),
  jsonb_set(doc,'{items,0,image_path}',to_jsonb(current_setting('test.shop_b')||'/shop/'||gen_random_uuid()::text||'.webp')),
  jsonb_set(doc,'{collections,0,item_ids}','["11111111-1111-4111-8111-111111111111"]'),
  jsonb_set(doc,'{posts,0,item_ids}','["11111111-1111-4111-8111-111111111111"]'),
  jsonb_set(doc,'{collections,0,item_ids}',jsonb_build_array(current_setting('test.shop_item'),current_setting('test.shop_item'))),
  jsonb_set(doc,'{collections,0,layout}','"unknown"'),
  jsonb_set(doc,'{items,1,source_slug}','"missing-product"')
 )) loop
  begin perform public.save_creator_shop(current_setting('test.shop_id')::uuid,current_setting('test.shop_slug'),1,gen_random_uuid(),'save',bad);raise exception 'Invalid document accepted';exception when invalid_parameter_value then null;end;
 end loop;
 begin perform public.save_creator_shop(current_setting('test.shop_id')::uuid,current_setting('test.shop_slug'),0,gen_random_uuid(),'save',doc);raise exception 'Stale writer accepted';exception when serialization_failure then null;end;
 if (select revision from public.creator_shops)<>1 then raise exception 'Rejected mutation changed version';end if;
 saved:=public.save_creator_shop(current_setting('test.shop_id')::uuid,current_setting('test.shop_slug'),1,gen_random_uuid(),'publish',doc);
 if (saved->>'revision')::int<>2 or not(saved->>'is_published')::boolean then raise exception 'Publication failed';end if;
 saved:=public.get_public_creator_shop(current_setting('test.shop_slug'));
 if saved#>>'{document,avatar_path}'<>current_setting('test.shop_avatar') or jsonb_array_length(saved#>'{document,items}')<>2 or jsonb_array_length(saved#>'{document,posts,0,item_ids}')<>1 or jsonb_array_length(saved#>'{document,collections,0,item_ids}')<>2 then raise exception 'Public snapshot incorrect';end if;
 if saved->>'owner_user_id' is not null or saved::text like '%Hidden secret product%' then raise exception 'Private shop fields leaked';end if;
 perform public.save_creator_shop(current_setting('test.shop_id')::uuid,current_setting('test.shop_slug'),2,gen_random_uuid(),'save',doc||'{"name":"Unpublished changes"}');
 if public.get_public_creator_shop(current_setting('test.shop_slug'))#>>'{document,name}'<>'Public fixture' then raise exception 'Private edit changed public shop';end if;
 begin update public.creator_shops set is_published=false;raise exception 'Direct publication write allowed';exception when insufficient_privilege then null;end;
 begin perform public.save_creator_shop(current_setting('test.shop_id')::uuid,'another-address',3,gen_random_uuid(),'save',doc);raise exception 'Published URL changed';exception when invalid_parameter_value then null;end;
end $$;
reset role;
insert into public.organization_members(organization_id,user_id,role) values(current_setting('test.shop_org')::uuid,current_setting('test.shop_c')::uuid,'member');
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.shop_b'),true);
do $$ begin
 if exists(select 1 from public.creator_shops) or exists(select 1 from public.profile_photos) then raise exception 'Other user reads draft or photo metadata';end if;
 if exists(select 1 from storage.objects where bucket_id='diderot-media' and name=current_setting('test.shop_secret')) then raise exception 'Private file readable';end if;
 begin perform public.save_profile_photo('creator',current_setting('test.shop_a')::uuid,null);raise exception 'Other avatar changed';exception when insufficient_privilege then null;end;
 begin perform public.save_profile_photo('brand',current_setting('test.shop_org')::uuid,null);raise exception 'Other brand photo changed';exception when insufficient_privilege then null;end;
 begin perform public.save_creator_shop(current_setting('test.shop_id')::uuid,current_setting('test.shop_slug'),3,gen_random_uuid(),'save',current_setting('test.shop_doc')::jsonb);raise exception 'Other shop overwritten';exception when unique_violation or serialization_failure then null;end;
 begin insert into storage.objects(bucket_id,name,owner_id,metadata) values('diderot-media',current_setting('test.shop_a')||'/shop/'||gen_random_uuid()::text||'.webp',auth.uid()::text,'{"mimetype":"image/webp"}');raise exception 'Uploaded into other folder';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.shop_c'),true);
do $$ begin
 if (select count(*) from public.profile_photos where kind='brand')<>1 or not exists(select 1 from storage.objects where name=current_setting('test.shop_brand')) then raise exception 'Brand member cannot view brand photo';end if;
 if exists(select 1 from public.creator_shops) then raise exception 'Brand membership grants creator draft access';end if;
 begin perform public.save_profile_photo('brand',current_setting('test.shop_org')::uuid,null);raise exception 'Read-only member edited photo';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.shop_d'),true);
do $$ declare doc jsonb:=current_setting('test.shop_doc')::jsonb; id uuid:=gen_random_uuid(); begin
 doc:=jsonb_set(jsonb_set(jsonb_set(doc,'{items}',jsonb_build_array(doc#>'{items,1}')),'{posts}','[]'),'{collections}','[]');
 perform public.save_creator_shop(id,'unconfirmed-'||substr(id::text,1,8),0,gen_random_uuid(),'save',doc);
 begin perform public.save_creator_shop(id,'unconfirmed-'||substr(id::text,1,8),1,gen_random_uuid(),'publish',doc);raise exception 'Unconfirmed account published';exception when insufficient_privilege then null;end;
end $$;
reset role;
set local role anon;
do $$ begin
 if public.get_public_creator_shop(current_setting('test.shop_slug')) is null then raise exception 'Public shop unavailable';end if;
 if exists(select 1 from storage.objects where bucket_id='diderot-media' and name in(current_setting('test.shop_secret'),current_setting('test.shop_brand'))) then raise exception 'Unpublished media exposed';end if;
 if not exists(select 1 from storage.objects where bucket_id='diderot-media' and name=current_setting('test.shop_avatar')) then raise exception 'Published avatar unavailable';end if;
 begin perform * from public.creator_shops;raise exception 'Anonymous draft table read';exception when insufficient_privilege then null;end;
 begin perform public.save_creator_shop(current_setting('test.shop_id')::uuid,current_setting('test.shop_slug'),3,gen_random_uuid(),'save','{}');raise exception 'Anonymous write';exception when insufficient_privilege then null;end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.shop_a'),true);
select public.save_creator_shop(current_setting('test.shop_id')::uuid,current_setting('test.shop_slug'),3,gen_random_uuid(),'unpublish',current_setting('test.shop_doc')::jsonb);
reset role;
set local role anon;
do $$ begin if public.get_public_creator_shop(current_setting('test.shop_slug')) is not null or exists(select 1 from storage.objects where bucket_id='diderot-media' and name=current_setting('test.shop_avatar')) then raise exception 'Unpublish failed to revoke new access';end if;end $$;
reset role;
select 'PASS: shop CRUD document, canonical catalog isolation, media/photo ownership, N:N references and order, private/public snapshot, hidden fields, social URL validation, retry/version, immutable address, brand member read-only, confirmed-email gate, anonymous read/write scope and unpublication' as result;
rollback;
