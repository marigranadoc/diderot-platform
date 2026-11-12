create table public.campaign_drafts (
 id uuid primary key,
 organization_id uuid not null references public.organizations(id) on delete cascade,
 title text not null check(char_length(trim(title)) between 2 and 120),
 campaign_type text not null check(campaign_type in ('ugc','influencer','hybrid')),
 description text not null default '' check(char_length(description)<=5000),
 objective text not null default '' check(char_length(objective)<=500),
 category text not null default '' check(char_length(category)<=100),
 starts_on date, ends_on date, application_deadline date,
 status text not null default 'draft' check(status='draft'),
 revision integer not null default 1 check(revision>0),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 last_request_id uuid not null, last_payload jsonb not null,
 check(starts_on is null or ends_on is null or starts_on<=ends_on),
 check(application_deadline is null or ends_on is null or application_deadline<=ends_on)
);
create index campaign_drafts_organization_idx on public.campaign_drafts(organization_id,updated_at desc);
create table public.campaign_draft_slots (
 campaign_id uuid not null references public.campaign_drafts(id) on delete cascade,
 modality text not null check(modality in ('ugc','influencer','hybrid')),
 quantity integer not null check(quantity between 1 and 1000),
 budget_per_creator_cents integer check(budget_per_creator_cents between 1 and 100000000),
 primary key(campaign_id,modality)
);
alter table public.campaign_drafts enable row level security;
alter table public.campaign_draft_slots enable row level security;
revoke all on public.campaign_drafts,public.campaign_draft_slots from public,anon,authenticated;
grant select on public.campaign_drafts,public.campaign_draft_slots to authenticated;
create policy campaign_drafts_read_linked on public.campaign_drafts for select to authenticated
using(organization_id in(select id from public.organizations));
create policy campaign_slots_read_linked on public.campaign_draft_slots for select to authenticated
using(campaign_id in(select id from public.campaign_drafts));

create function diderot_private.save_campaign_draft(p_organization uuid,p_id uuid,p_revision integer,p_request uuid,p_document jsonb)
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
 if p_document-array['title','campaign_type','description','objective','category','starts_on','ends_on','application_deadline','slots']<>'{}'::jsonb then raise exception 'Unsupported draft fields' using errcode='22023'; end if;
 foreach key in array array['title','campaign_type','description','objective','category','starts_on','ends_on','application_deadline'] loop
  if p_document?key and jsonb_typeof(p_document->key) not in ('string','null') then raise exception 'Invalid draft field type' using errcode='22023'; end if;
 end loop;
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
  if jsonb_typeof(slot)<>'object' or slot-array['modality','quantity','budget_per_creator_cents']<>'{}'::jsonb then raise exception 'Invalid slot fields' using errcode='22023'; end if;
  slot_mode:=slot->>'modality';
  if slot_mode is null or slot_mode not in ('ugc','influencer','hybrid') or slot_mode=any(seen) or (kind<>'hybrid' and slot_mode<>kind) then raise exception 'Incompatible or duplicate modality' using errcode='22023'; end if;
  seen:=array_append(seen,slot_mode);
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
  update public.campaign_drafts set title=title_value,campaign_type=kind,description=coalesce(p_document->>'description',''),objective=coalesce(p_document->>'objective',''),category=coalesce(p_document->>'category',''),starts_on=begin_date,ends_on=end_date,application_deadline=deadline_date,
   revision=revision+1,updated_at=now(),last_request_id=p_request,last_payload=p_document where id=p_id returning * into existing;
 else
  if p_revision<>0 then raise exception 'Draft version unavailable' using errcode='40001'; end if;
  insert into public.campaign_drafts(id,organization_id,title,campaign_type,description,objective,category,starts_on,ends_on,application_deadline,last_request_id,last_payload)
  values(p_id,org.id,title_value,kind,coalesce(p_document->>'description',''),coalesce(p_document->>'objective',''),coalesce(p_document->>'category',''),begin_date,end_date,deadline_date,p_request,p_document) returning * into existing;
 end if;
 delete from public.campaign_draft_slots where campaign_id=p_id;
 for slot in select * from jsonb_array_elements(p_document->'slots') loop
  insert into public.campaign_draft_slots(campaign_id,modality,quantity,budget_per_creator_cents)
  values(p_id,slot->>'modality',(slot->>'quantity')::integer,(slot->>'budget_per_creator_cents')::integer);
 end loop;
 return jsonb_build_object('id',existing.id,'revision',existing.revision,'status',existing.status);
end;
$$;
revoke all on function diderot_private.save_campaign_draft(uuid,uuid,integer,uuid,jsonb) from public,anon,authenticated;
grant execute on function diderot_private.save_campaign_draft(uuid,uuid,integer,uuid,jsonb) to authenticated;
create function public.save_campaign_draft(p_organization uuid,p_id uuid,p_revision integer,p_request uuid,p_document jsonb)
returns jsonb language sql security invoker set search_path=''
as $$ select diderot_private.save_campaign_draft(p_organization,p_id,p_revision,p_request,p_document); $$;
revoke all on function public.save_campaign_draft(uuid,uuid,integer,uuid,jsonb) from public,anon,authenticated;
grant execute on function public.save_campaign_draft(uuid,uuid,integer,uuid,jsonb) to authenticated;
