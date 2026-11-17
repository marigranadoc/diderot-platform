-- Additive: existing drafts keep their context, revision, slots and permissions.
alter table public.campaign_drafts add column briefing jsonb not null default '{}'::jsonb check(jsonb_typeof(briefing)='object');
alter table public.campaign_draft_slots add column briefing jsonb not null default '{}'::jsonb check(jsonb_typeof(briefing)='object');

create function diderot_private.check_campaign_fields(value jsonb,text_keys text[],bool_keys text[],number_rules jsonb)
returns void language plpgsql immutable security invoker set search_path=''
as $$
declare key text; item jsonb; limits jsonb;
begin
 if jsonb_typeof(value) is distinct from 'object' then raise exception 'Expected briefing object' using errcode='22023'; end if;
 for key,item in select * from jsonb_each(value) loop
  if key=any(text_keys) then
   if jsonb_typeof(item)<>'string' or char_length(item#>>'{}')>2000 then raise exception 'Invalid briefing text' using errcode='22023'; end if;
  elsif key=any(bool_keys) then
   if jsonb_typeof(item)<>'boolean' then raise exception 'Invalid briefing flag' using errcode='22023'; end if;
  elsif number_rules?key then
   if jsonb_typeof(item)<>'null' then
    limits:=number_rules->key;
    if jsonb_typeof(item)<>'number' or (item#>>'{}')!~ '^[0-9]+$' then raise exception 'Invalid briefing integer' using errcode='22023'; end if;
    if (item#>>'{}')::numeric<(limits->>0)::numeric or (item#>>'{}')::numeric>(limits->>1)::numeric then raise exception 'Briefing number out of range' using errcode='22023'; end if;
   end if;
  else raise exception 'Unsupported briefing field' using errcode='22023';
  end if;
 end loop;
end;
$$;
revoke all on function diderot_private.check_campaign_fields(jsonb,text[],text[],jsonb) from public,anon,authenticated;

create function diderot_private.valid_campaign_reference(value text)
returns boolean language sql immutable security invoker set search_path=''
as $$ select coalesce(char_length(value)<=2000 and value ~ '^https://[^[:space:]/?#@:]+(:[0-9]{1,5})?([/?#][^[:space:]]*)?$',false); $$;
revoke all on function diderot_private.valid_campaign_reference(text) from public,anon,authenticated;

create function diderot_private.check_campaign_briefing(value jsonb,modality text default null)
returns void language plpgsql immutable security invoker set search_path=''
as $$
declare item jsonb; key text; part jsonb; date_value text;
begin
 if jsonb_typeof(value) is distinct from 'object' then raise exception 'Invalid briefing' using errcode='22023'; end if;
 if modality is null then
  perform diderot_private.check_campaign_fields(value-array['references','products'],array['tone','messages','restrictions'],array[]::text[],'{}');
  foreach key in array array['references','products'] loop
   if value?key then
    if jsonb_typeof(value->key)<>'array' then raise exception 'Invalid reference list' using errcode='22023'; end if;
    if jsonb_array_length(value->key)>20 then raise exception 'Too many references' using errcode='22023'; end if;
    for item in select * from jsonb_array_elements(value->key) loop
     if key='references' then
      if jsonb_typeof(item)<>'string' or not diderot_private.valid_campaign_reference(item#>>'{}') then raise exception 'Invalid reference URL' using errcode='22023'; end if;
     else
      perform diderot_private.check_campaign_fields(item,array['name','url'],array[]::text[],'{}');
      if char_length(trim(coalesce(item->>'name',''))) not between 1 and 200 or not diderot_private.valid_campaign_reference(item->>'url') then raise exception 'Invalid reference product' using errcode='22023'; end if;
     end if;
    end loop;
   end if;
  end loop;
 else
  if value-array['requirements','deliverables','rights','compensation']<>'{}'::jsonb then raise exception 'Unsupported slot briefing section' using errcode='22023'; end if;
  for key,part in select * from jsonb_each(value) loop
   case key
    when 'requirements' then
     perform diderot_private.check_campaign_fields(part,array['niches','languages','location','experience','portfolio','style','skills','channels','demographics','metrics'],array[]::text[],'{"min_followers":[0,2000000000]}');
     if modality='ugc' and part?'min_followers' and jsonb_typeof(part->'min_followers')<>'null' then raise exception 'UGC cannot require followers' using errcode='22023'; end if;
    when 'deliverables' then
     perform diderot_private.check_campaign_fields(part-'deadline',array['format','resolution','capture','script','posting_proof'],array['raw_files','posting_required'],'{"videos":[0,100],"photos":[0,100],"duration_seconds":[1,86400],"revision_rounds":[0,20]}');
     if part?'deadline' and jsonb_typeof(part->'deadline')<>'null' then
      date_value:=part->>'deadline';
      if jsonb_typeof(part->'deadline')<>'string' or date_value!~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'Invalid delivery date' using errcode='22023'; end if;
      begin perform date_value::date; exception when datetime_field_overflow or invalid_datetime_format then raise exception 'Invalid delivery date' using errcode='22023'; end;
     end if;
    when 'rights' then
     perform diderot_private.check_campaign_fields(part,array['channels','territory','exclusivity','renewal'],array['organic','paid','image_voice'],'{"duration_months":[1,120]}');
    when 'compensation' then
     perform diderot_private.check_campaign_fields(part,array['commission_terms','bonus_terms','product_benefit','payment_terms'],array[]::text[],'{"production_fee_cents":[0,100000000],"publication_fee_cents":[0,100000000],"commission_basis_points":[0,10000]}');
   end case;
  end loop;
 end if;
end;
$$;
revoke all on function diderot_private.check_campaign_briefing(jsonb,text) from public,anon,authenticated;

create or replace function diderot_private.save_campaign_draft(p_organization uuid,p_id uuid,p_revision integer,p_request uuid,p_document jsonb)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare
 actor uuid:=auth.uid(); org public.organizations%rowtype; existing public.campaign_drafts%rowtype;
 key text; slot jsonb; slot_mode text; seen text[]:=array[]::text[];
 kind text; title_value text; begin_date date; end_date date; deadline_date date;
begin
 if actor is null then raise exception 'Authentication required' using errcode='42501'; end if;
 select * into org from public.organizations where id=p_organization and owner_user_id=actor for update;
 if org.id is null then raise exception 'Only the organization owner may save campaign drafts' using errcode='42501'; end if;
 if p_id is null or p_request is null or p_revision is null or p_revision<0 or jsonb_typeof(p_document) is distinct from 'object' then raise exception 'Invalid draft request' using errcode='22023'; end if;
 if p_document-array['title','campaign_type','description','objective','category','starts_on','ends_on','application_deadline','slots','briefing']<>'{}'::jsonb then raise exception 'Unsupported draft fields' using errcode='22023'; end if;
 foreach key in array array['title','campaign_type','description','objective','category','starts_on','ends_on','application_deadline'] loop
  if p_document?key and jsonb_typeof(p_document->key) not in ('string','null') then raise exception 'Invalid draft field type' using errcode='22023'; end if;
 end loop;
 if octet_length(p_document::text)>131072 then raise exception 'Briefing too large' using errcode='22023'; end if;
 if p_document?'briefing' then perform diderot_private.check_campaign_briefing(p_document->'briefing'); end if;
 title_value:=trim(p_document->>'title');kind:=p_document->>'campaign_type';
 if title_value is null or char_length(title_value) not between 2 and 120 or kind is null or kind not in ('ugc','influencer','hybrid')
  or char_length(coalesce(p_document->>'description',''))>5000 or char_length(coalesce(p_document->>'objective',''))>500 or char_length(coalesce(p_document->>'category',''))>100 then raise exception 'Invalid draft content' using errcode='22023'; end if;
 foreach key in array array['starts_on','ends_on','application_deadline'] loop
  if coalesce(p_document->>key,'')<>'' and (p_document->>key)!~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'Invalid date format' using errcode='22023'; end if;
 end loop;
 begin_date:=nullif(p_document->>'starts_on','')::date;end_date:=nullif(p_document->>'ends_on','')::date;deadline_date:=nullif(p_document->>'application_deadline','')::date;
 if (begin_date is not null and end_date is not null and begin_date>end_date) or (deadline_date is not null and end_date is not null and deadline_date>end_date) then raise exception 'Inconsistent campaign dates' using errcode='22023'; end if;
 if jsonb_typeof(p_document->'slots') is distinct from 'array' or jsonb_array_length(p_document->'slots')>3 then raise exception 'Invalid slots' using errcode='22023'; end if;
 for slot in select * from jsonb_array_elements(p_document->'slots') loop
  if jsonb_typeof(slot)<>'object' or slot-array['modality','quantity','budget_per_creator_cents','briefing']<>'{}'::jsonb then raise exception 'Invalid slot fields' using errcode='22023'; end if;
  slot_mode:=slot->>'modality';
  if slot_mode is null or slot_mode not in ('ugc','influencer','hybrid') or slot_mode=any(seen) or (kind<>'hybrid' and slot_mode<>kind) then raise exception 'Incompatible or duplicate modality' using errcode='22023'; end if;
  seen:=array_append(seen,slot_mode);
  if slot?'briefing' then perform diderot_private.check_campaign_briefing(slot->'briefing',slot_mode); end if;
  if jsonb_typeof(slot->'quantity') is distinct from 'number' or (slot->>'quantity')!~ '^[0-9]+$' or (slot->>'quantity')::numeric not between 1 and 1000 then raise exception 'Invalid slot quantity' using errcode='22023'; end if;
  if slot?'budget_per_creator_cents' and jsonb_typeof(slot->'budget_per_creator_cents')<>'null' then
   if jsonb_typeof(slot->'budget_per_creator_cents')<>'number' or (slot->>'budget_per_creator_cents')!~ '^[0-9]+$' or (slot->>'budget_per_creator_cents')::numeric not between 1 and 100000000 then raise exception 'Invalid estimated budget' using errcode='22023'; end if;
  end if;
 end loop;
 select * into existing from public.campaign_drafts where id=p_id for update;
 if existing.id is not null then
  if existing.organization_id<>org.id then raise exception 'Draft access denied' using errcode='42501'; end if;
  if existing.last_request_id=p_request then
   if existing.last_payload<>p_document then raise exception 'Request reused for different content' using errcode='22023'; end if;
   return jsonb_build_object('id',existing.id,'revision',existing.revision,'status',existing.status);
  end if;
  if existing.revision<>p_revision then raise exception 'Draft changed in another session' using errcode='40001'; end if;
  if not(p_document?'briefing') and (existing.briefing<>'{}'::jsonb or exists(select 1 from public.campaign_draft_slots where campaign_id=p_id and briefing<>'{}'::jsonb)) then raise exception 'Reload the updated briefing editor before saving' using errcode='22023'; end if;
  update public.campaign_drafts set briefing=coalesce(p_document->'briefing','{}'::jsonb),title=title_value,campaign_type=kind,description=coalesce(p_document->>'description',''),objective=coalesce(p_document->>'objective',''),category=coalesce(p_document->>'category',''),starts_on=begin_date,ends_on=end_date,application_deadline=deadline_date,
   revision=revision+1,updated_at=now(),last_request_id=p_request,last_payload=p_document where id=p_id returning * into existing;
 else
  if p_revision<>0 then raise exception 'Draft version unavailable' using errcode='40001'; end if;
  insert into public.campaign_drafts(id,organization_id,title,campaign_type,description,objective,category,starts_on,ends_on,application_deadline,last_request_id,last_payload,briefing)
  values(p_id,org.id,title_value,kind,coalesce(p_document->>'description',''),coalesce(p_document->>'objective',''),coalesce(p_document->>'category',''),begin_date,end_date,deadline_date,p_request,p_document,coalesce(p_document->'briefing','{}'::jsonb)) returning * into existing;
 end if;
 delete from public.campaign_draft_slots where campaign_id=p_id;
 for slot in select * from jsonb_array_elements(p_document->'slots') loop
  insert into public.campaign_draft_slots(campaign_id,modality,quantity,budget_per_creator_cents,briefing)
  values(p_id,slot->>'modality',(slot->>'quantity')::integer,(slot->>'budget_per_creator_cents')::integer,coalesce(slot->'briefing','{}'::jsonb));
 end loop;
 return jsonb_build_object('id',existing.id,'revision',existing.revision,'status',existing.status);
end;
$$;
