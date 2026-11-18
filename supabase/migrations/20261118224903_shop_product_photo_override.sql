-- Compatible shop hierarchy and owned catalog photo overrides. No customer rows are rewritten.
create or replace function diderot_private.check_shop_document(doc jsonb,actor uuid,complete boolean)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare item jsonb; section jsonb; post jsonb; entry jsonb; ids text[]:=array[]::text[]; post_ids text[]:=array[]::text[]; section_ids text[]:=array[]::text[]; navigation_ids text[]:=array[]::text[]; normalized_collections jsonb:='[]'; navigation jsonb;
 normalized_items jsonb:='[]'; clean jsonb; product public.products%rowtype; id_value text; key text; refs jsonb; reference text;
begin
 if jsonb_typeof(doc) is distinct from 'object' or octet_length(doc::text)>1048576 then raise exception 'Invalid shop document' using errcode='22023';end if;
 if not(doc?'sections') then doc:=doc||'{"sections":[{"id":"00000000-0000-4000-8000-000000000001","title":"Minhas escolhas","visible":true}]}'::jsonb;end if;
 perform diderot_private.check_campaign_fields(doc-array['sections','items','collections','posts','social_links'],array['name','bio'],array[]::text[],'{}');
 if char_length(trim(coalesce(doc->>'name',''))) not between 2 and 80 then raise exception 'Shop name required' using errcode='22023';end if;
 foreach key in array array['items','collections','posts','social_links'] loop
  if jsonb_typeof(doc->key) is distinct from 'array' then raise exception 'Invalid shop lists' using errcode='22023';end if;
 end loop;
 if jsonb_array_length(doc->'items')>200 or jsonb_array_length(doc->'collections')>50 or jsonb_array_length(doc->'posts')>100 or jsonb_array_length(doc->'social_links')>10 then raise exception 'Shop list limit exceeded' using errcode='22023';end if;
 if jsonb_typeof(doc->'sections') is distinct from 'array' then raise exception 'Invalid shop sections' using errcode='22023';end if;
 if jsonb_array_length(doc->'sections') not between 1 and 20 then raise exception 'Section limit exceeded' using errcode='22023';end if;
 for navigation in select * from jsonb_array_elements(doc->'sections') loop
  perform diderot_private.check_campaign_fields(navigation,array['id','title'],array['visible'],'{}');
  id_value:=navigation->>'id';
  if id_value is null or id_value !~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' or id_value=any(navigation_ids) or char_length(trim(coalesce(navigation->>'title',''))) not between 2 and 100 then raise exception 'Invalid shop section' using errcode='22023';end if;
  navigation_ids:=array_append(navigation_ids,id_value);
 end loop;
 for entry in select * from jsonb_array_elements(doc->'social_links') loop
  perform diderot_private.check_campaign_fields(entry,array['label','url'],array[]::text[],'{}');
  if char_length(trim(coalesce(entry->>'label',''))) not between 2 and 40 or (coalesce(entry->>'url','')<>'' and not diderot_private.valid_campaign_reference(entry->>'url')) then raise exception 'Invalid social link' using errcode='22023';end if;
 end loop;
 for item in select * from jsonb_array_elements(doc->'items') loop
  perform diderot_private.check_campaign_fields(item-array['source_slug','image_path','price_cents'],array['id','name','brand','description','url','category'],array['visible','is_affiliate'],'{}');
  id_value:=item->>'id';
  if id_value is null or id_value !~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' or id_value=any(ids) then raise exception 'Invalid or duplicate product ID' using errcode='22023';end if;
  ids:=array_append(ids,id_value);
  foreach key in array array['source_slug','image_path'] loop
   if item?key and jsonb_typeof(item->key) not in ('string','null') then raise exception 'Invalid product reference' using errcode='22023';end if;
  end loop;
  if item->>'source_slug' is not null then
   select p.* into product from public.products p join public.collections c on c.slug=p.collection where p.slug=item->>'source_slug' and p.published and c.published;
   if not found then raise exception 'Catalog product unavailable' using errcode='22023';end if;
   perform diderot_private.check_shop_media(item->>'image_path',actor,'shop');
   item:=item||jsonb_build_object('name',product.name,'brand',product.brand,'price_cents',round(product.price*100)::integer,'category',product.category,'url','','image_path',item->>'image_path','is_affiliate',false);
  else
   if char_length(trim(coalesce(item->>'name',''))) not between 2 and 120 then raise exception 'Product name required' using errcode='22023';end if;
   if coalesce(item->>'url','')<>'' and not diderot_private.valid_campaign_reference(item->>'url') then raise exception 'Invalid product URL' using errcode='22023';end if;
   if item?'price_cents' and jsonb_typeof(item->'price_cents')<>'null' and (jsonb_typeof(item->'price_cents')<>'number' or (item->>'price_cents')!~ '^[0-9]+$' or (item->>'price_cents')::numeric>100000000) then raise exception 'Invalid product price' using errcode='22023';end if;
   perform diderot_private.check_shop_media(item->>'image_path',actor,'shop');
   if complete and coalesce((item->>'visible')::boolean,true) and (not diderot_private.valid_campaign_reference(item->>'url') or item->>'image_path' is null) then raise exception 'Visible products need an image and HTTPS destination' using errcode='22023';end if;
  end if;
  normalized_items:=normalized_items||jsonb_build_array(item);
 end loop;
 for post in select * from jsonb_array_elements(doc->'posts') loop
  perform diderot_private.check_campaign_fields(post-array['image_path','item_ids'],array['id','title','caption'],array['visible'],'{}');
  id_value:=post->>'id';
  if id_value is null or id_value !~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' or id_value=any(post_ids) or char_length(trim(coalesce(post->>'title',''))) not between 2 and 120 then raise exception 'Invalid post' using errcode='22023';end if;
  post_ids:=array_append(post_ids,id_value);
  if jsonb_typeof(post->'image_path') not in ('string','null') then raise exception 'Invalid post image' using errcode='22023';end if;
  perform diderot_private.check_shop_media(post->>'image_path',actor,'shop');
  if complete and coalesce((post->>'visible')::boolean,true) and post->>'image_path' is null then raise exception 'Visible posts need an image' using errcode='22023';end if;
  if jsonb_typeof(post->'item_ids') is distinct from 'array' or jsonb_array_length(post->'item_ids')>200 then raise exception 'Invalid post products' using errcode='22023';end if;
  if (select count(distinct x) from jsonb_array_elements(post->'item_ids') x)<>jsonb_array_length(post->'item_ids') then raise exception 'Duplicate post product' using errcode='22023';end if;
  for entry in select * from jsonb_array_elements(post->'item_ids') loop
   if jsonb_typeof(entry)<>'string' or not((entry#>>'{}')=any(ids)) then raise exception 'Post product belongs to another shop or is missing' using errcode='22023';end if;
  end loop;
 end loop;
 for section in select * from jsonb_array_elements(doc->'collections') loop
  section:=jsonb_build_object('section_id',navigation_ids[1],'archived',false)||section;
  perform diderot_private.check_campaign_fields(section-array['item_ids','post_ids'],array['id','title','description','layout','section_id'],array['visible','archived'],'{}');
  if section->>'section_id' is null or not((section->>'section_id')=any(navigation_ids)) then raise exception 'Collection section is missing or belongs to another shop' using errcode='22023';end if;
  id_value:=section->>'id';
  if id_value is null or id_value !~ '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$' or id_value=any(section_ids) or char_length(trim(coalesce(section->>'title',''))) not between 2 and 100 or coalesce(section->>'layout','') not in ('shelves','editorial','square_posts','vertical_posts','horizontal_posts') then raise exception 'Invalid section' using errcode='22023';end if;
  section_ids:=array_append(section_ids,id_value);
  foreach key in array array['item_ids','post_ids'] loop
   refs:=section->key;
   if jsonb_typeof(refs) is distinct from 'array' or jsonb_array_length(refs)>200 then raise exception 'Invalid section contents' using errcode='22023';end if;
   if (select count(distinct x) from jsonb_array_elements(refs) x)<>jsonb_array_length(refs) then raise exception 'Duplicate section content' using errcode='22023';end if;
   for entry in select * from jsonb_array_elements(refs) loop
    reference:=entry#>>'{}';
    if jsonb_typeof(entry)<>'string' or not(reference=any(case when key='item_ids' then ids else post_ids end)) then raise exception 'Section content belongs to another shop or is missing' using errcode='22023';end if;
   end loop;
  end loop;
  normalized_collections:=normalized_collections||jsonb_build_array(section);
 end loop;
 clean:=jsonb_set(jsonb_set(doc,'{items}',normalized_items),'{collections}',normalized_collections);
 if complete and not exists(select 1 from jsonb_array_elements(clean->'items') x where coalesce((x->>'visible')::boolean,true)) and not exists(select 1 from jsonb_array_elements(clean->'posts') x where coalesce((x->>'visible')::boolean,true)) then raise exception 'Add at least one visible product or post' using errcode='22023';end if;
 return clean;
end; $$;

create or replace function diderot_private.save_creator_shop(p_id uuid,p_slug text,p_revision integer,p_request uuid,p_action text,p_document jsonb)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare actor uuid:=auth.uid(); current_shop public.creator_shops%rowtype; payload jsonb; clean jsonb; snapshot jsonb;
 navigation jsonb; candidate_collections jsonb; candidate_posts jsonb; avatar text; visible_items jsonb; visible_posts jsonb; visible_sections jsonb; allowed_items text[]; allowed_posts text[];
begin
 if actor is null then raise exception 'Authentication required' using errcode='42501';end if;
 perform 1 from public.creator_profiles where user_id=actor for update;
 if not found then raise exception 'Configure your creator profile first' using errcode='42501';end if;
 if p_id is null or p_request is null or p_revision is null or p_revision<0 or p_action not in ('save','publish','unpublish') or p_action is null then raise exception 'Invalid shop request' using errcode='22023';end if;
 if p_slug is null or p_slug !~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$' or p_slug in ('admin','api','demo','cadastro','suporte') then raise exception 'Invalid shop address' using errcode='22023';end if;
 if jsonb_typeof(p_document) is distinct from 'object' or octet_length(p_document::text)>1048576 then raise exception 'Invalid shop document' using errcode='22023';end if;
 payload:=jsonb_build_object('slug',p_slug,'action',p_action,'document',p_document);
 select * into current_shop from public.creator_shops where owner_user_id=actor for update;
 if current_shop.id is not null then
  if current_shop.id<>p_id then raise exception 'Shop created in another session' using errcode='40001';end if;
  if current_shop.last_request_id=p_request then
   if current_shop.last_payload<>payload then raise exception 'Request reused with different content' using errcode='22023';end if;
   return jsonb_build_object('id',current_shop.id,'revision',current_shop.revision,'is_published',current_shop.is_published);
  end if;
  if current_shop.revision<>p_revision then raise exception 'Shop changed in another session' using errcode='40001';end if;
  if current_shop.published_document is not null and current_shop.slug<>p_slug then raise exception 'Published shop address is permanent' using errcode='22023';end if;
 elsif p_revision<>0 or p_action='unpublish' then raise exception 'Shop version unavailable' using errcode='40001';end if;
 if p_action='unpublish' then
  update public.creator_shops set is_published=false,revision=revision+1,updated_at=now(),last_request_id=p_request,last_payload=payload where id=p_id returning * into current_shop;
 else
  clean:=diderot_private.check_shop_document(p_document,actor,p_action='publish');
  if p_action='publish' then
   if not exists(select 1 from auth.users where id=actor and email_confirmed_at is not null) then raise exception 'Confirmed email required to publish' using errcode='42501';end if;
   select object_path into avatar from public.profile_photos where kind='creator' and subject_id=actor;
   select coalesce(jsonb_agg(x),'[]'::jsonb) into navigation from jsonb_array_elements(clean->'sections') x where coalesce((x->>'visible')::boolean,true);
   select coalesce(jsonb_agg(x),'[]'::jsonb) into candidate_collections from jsonb_array_elements(clean->'collections') x where coalesce((x->>'visible')::boolean,true) and not coalesce((x->>'archived')::boolean,false) and exists(select 1 from jsonb_array_elements(navigation) s where s->>'id'=x->>'section_id');
   select coalesce(jsonb_agg(x),'[]'::jsonb) into candidate_posts from jsonb_array_elements(clean->'posts') x where coalesce((x->>'visible')::boolean,true) and (not exists(select 1 from jsonb_array_elements(clean->'collections') c where c->'post_ids' ? (x->>'id')) or exists(select 1 from jsonb_array_elements(candidate_collections) c where c->'post_ids' ? (x->>'id')));
   select coalesce(jsonb_agg(x||jsonb_build_object('is_demo',x->>'source_slug' is not null)),'[]'::jsonb) into visible_items from jsonb_array_elements(clean->'items') x where coalesce((x->>'visible')::boolean,true) and (not exists(select 1 from jsonb_array_elements(clean->'collections') c where c->'item_ids' ? (x->>'id')) or exists(select 1 from jsonb_array_elements(candidate_collections) c where c->'item_ids' ? (x->>'id')) or exists(select 1 from jsonb_array_elements(candidate_posts) p where p->'item_ids' ? (x->>'id')));
   select coalesce(array_agg(x->>'id'),array[]::text[]) into allowed_items from jsonb_array_elements(visible_items) x;
   select coalesce(jsonb_agg(jsonb_set(x,'{item_ids}',(select coalesce(jsonb_agg(v),'[]'::jsonb) from jsonb_array_elements(x->'item_ids') v where (v#>>'{}')=any(allowed_items)))),'[]'::jsonb) into visible_posts from jsonb_array_elements(candidate_posts) x;
   select coalesce(array_agg(x->>'id'),array[]::text[]) into allowed_posts from jsonb_array_elements(visible_posts) x;
   select coalesce(jsonb_agg(jsonb_set(jsonb_set(x,'{item_ids}',(select coalesce(jsonb_agg(v),'[]'::jsonb) from jsonb_array_elements(x->'item_ids') v where (v#>>'{}')=any(allowed_items))),'{post_ids}',(select coalesce(jsonb_agg(v),'[]'::jsonb) from jsonb_array_elements(x->'post_ids') v where (v#>>'{}')=any(allowed_posts)))),'[]'::jsonb) into visible_sections from jsonb_array_elements(candidate_collections) x;
   snapshot:=jsonb_build_object('name',trim(clean->>'name'),'bio',coalesce(clean->>'bio',''),'avatar_path',avatar,'items',visible_items,'posts',visible_posts,'sections',navigation,'collections',visible_sections,'social_links',(select coalesce(jsonb_agg(x),'[]'::jsonb) from jsonb_array_elements(clean->'social_links') x where coalesce(x->>'url','')<>''));
  end if;
  if current_shop.id is null then
   insert into public.creator_shops(id,owner_user_id,slug,document,published_document,is_published,published_at,last_request_id,last_payload)
   values(p_id,actor,p_slug,clean,snapshot,p_action='publish',case when p_action='publish' then now() end,p_request,payload) returning * into current_shop;
  else
   update public.creator_shops set slug=p_slug,document=clean,revision=revision+1,updated_at=now(),last_request_id=p_request,last_payload=payload,
    published_document=case when p_action='publish' then snapshot else published_document end,
    is_published=case when p_action='publish' then true else is_published end,
    published_at=case when p_action='publish' then now() else published_at end
   where id=p_id returning * into current_shop;
  end if;
  if p_action='publish' then
   delete from public.creator_shop_public_media where shop_id=p_id;
   insert into public.creator_shop_public_media(shop_id,object_path)
   select p_id,path from (
    select avatar path union select x->>'image_path' from jsonb_array_elements(visible_items) x union select x->>'image_path' from jsonb_array_elements(visible_posts) x
   ) media where path is not null;
  end if;
 end if;
 return jsonb_build_object('id',current_shop.id,'revision',current_shop.revision,'is_published',current_shop.is_published);
end; $$;
