create table public.organization_invitations (
 id uuid primary key default gen_random_uuid(),
 organization_id uuid not null references public.organizations(id) on delete cascade,
 email text not null check (email=lower(trim(email)) and char_length(email)<=254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled','revoked','expired')),
 invited_by uuid references auth.users(id) on delete set null,
 responded_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '7 days',
 responded_at timestamptz,
 check (expires_at>created_at)
);
create unique index organization_invitations_pending_idx on public.organization_invitations(organization_id,email) where status='pending';
create index organization_invitations_recipient_idx on public.organization_invitations(email,expires_at) where status='pending';
create index organization_invitations_inviter_idx on public.organization_invitations(invited_by);
create index organization_invitations_responder_idx on public.organization_invitations(responded_by);
alter table public.organization_invitations enable row level security;
revoke all on public.organization_invitations from public,anon,authenticated;
-- No direct table path: access is confined to the scoped workflow below.

create function diderot_private.organization_team(p_action text,p_organization uuid,p_invitation uuid,p_email text,p_member uuid)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare
 actor uuid:=auth.uid(); actor_email text; target_email text;
 org public.organizations%rowtype; invitation public.organization_invitations%rowtype;
 result jsonb;
begin
 if actor is null then raise exception 'Authentication required' using errcode='42501'; end if;
 select lower(u.email) into actor_email from auth.users u where u.id=actor and u.email_confirmed_at is not null;
 if actor_email is null then raise exception 'Verified email required' using errcode='42501'; end if;
 if p_action not in ('inbox','overview','invite','accept','decline','cancel','remove') or p_action is null then
  raise exception 'Invalid team action' using errcode='22023';
 end if;
 if p_action='inbox' then
  select coalesce(jsonb_agg(jsonb_build_object('id',i.id,'organization_id',i.organization_id,'organization_name',o.name,'email',i.email,'status',i.status,'expires_at',i.expires_at) order by i.created_at desc),'[]'::jsonb)
  into result from public.organization_invitations i join public.organizations o on o.id=i.organization_id
  where i.email=actor_email and i.status='pending' and i.expires_at>now();
  return jsonb_build_object('invitations',result);
 end if;
 if p_action in ('accept','decline','cancel') then
  select i.organization_id into p_organization from public.organization_invitations i where i.id=p_invitation;
 end if;
 -- Every mutation takes the organization lock before any invitation lock.
 -- Acceptance, cancellation and removal therefore share one serialization order.
 if p_action='overview' then
  select * into org from public.organizations where id=p_organization and owner_user_id=actor;
 else
  select * into org from public.organizations where id=p_organization for update;
 end if;
 if org.id is null then raise exception 'Team access denied' using errcode='42501'; end if;
 if p_action not in ('accept','decline') and org.owner_user_id<>actor then
  raise exception 'Only the organization owner may manage the team' using errcode='42501';
 end if;
 if p_action='overview' then
  return jsonb_build_object(
   'members',(select coalesce(jsonb_agg(jsonb_build_object('user_id',m.user_id,'email',u.email,'role',m.role) order by m.created_at),'[]'::jsonb) from public.organization_members m join auth.users u on u.id=m.user_id where m.organization_id=org.id),
   'invitations',(select coalesce(jsonb_agg(jsonb_build_object('id',i.id,'organization_id',i.organization_id,'email',i.email,'status',case when i.status='pending' and i.expires_at<=now() then 'expired' else i.status end,'expires_at',i.expires_at) order by i.created_at desc),'[]'::jsonb) from public.organization_invitations i where i.organization_id=org.id)
  );
 end if;
 if p_action='invite' then
  target_email:=lower(trim(p_email));
  if target_email is null or char_length(target_email)>254 or target_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Invalid invitation email' using errcode='22023'; end if;
  if target_email=actor_email or exists(select 1 from public.organization_members m join auth.users u on u.id=m.user_id where m.organization_id=org.id and lower(u.email)=target_email) then
   raise exception 'Already a member' using errcode='22023';
  end if;
  update public.organization_invitations set status='expired' where organization_id=org.id and email=target_email and status='pending' and expires_at<=now();
  select * into invitation from public.organization_invitations where organization_id=org.id and email=target_email and status='pending';
  if invitation.id is null then
   insert into public.organization_invitations(organization_id,email,invited_by) values(org.id,target_email,actor) returning * into invitation;
  end if;
 elsif p_action='remove' then
  if p_member is null or p_member=org.owner_user_id then raise exception 'Owner removal is not allowed' using errcode='22023'; end if;
  delete from public.organization_members where organization_id=org.id and user_id=p_member and role='member';
  update public.organization_invitations set status='revoked',responded_at=now() where organization_id=org.id and status='accepted' and responded_by=p_member;
  update public.organization_invitations set status='cancelled',responded_at=now() where organization_id=org.id and status='pending' and email in (
   select lower(email) from auth.users where id=p_member
   union select email from public.organization_invitations where organization_id=org.id and responded_by=p_member
  );
  return jsonb_build_object('removed',true);
 else
  select * into invitation from public.organization_invitations where id=p_invitation and organization_id=org.id for update;
  if invitation.id is null then raise exception 'Invitation unavailable' using errcode='42501'; end if;
  if p_action in ('accept','decline') and invitation.email<>actor_email then raise exception 'Invitation unavailable' using errcode='42501'; end if;
  if p_action='cancel' and invitation.status='cancelled' then null;
  elsif p_action='accept' and invitation.status='accepted' and invitation.responded_by=actor and exists(select 1 from public.organization_members where organization_id=org.id and user_id=actor) then null;
  elsif p_action='decline' and invitation.status='declined' and invitation.responded_by=actor then null;
  else
   if invitation.status<>'pending' or invitation.expires_at<=now() then raise exception 'Invitation is no longer pending' using errcode='22023'; end if;
   if p_action='accept' then
    insert into public.organization_members(organization_id,user_id,role) values(org.id,actor,'member') on conflict(organization_id,user_id) do nothing;
   end if;
   update public.organization_invitations set status=case p_action when 'accept' then 'accepted' when 'decline' then 'declined' else 'cancelled' end,
    responded_by=case when p_action='cancel' then null else actor end,responded_at=now() where id=invitation.id returning * into invitation;
  end if;
 end if;
 return jsonb_build_object('invitation',jsonb_build_object('id',invitation.id,'organization_id',invitation.organization_id,'email',invitation.email,'status',invitation.status,'expires_at',invitation.expires_at));
end;
$$;
revoke all on function diderot_private.organization_team(text,uuid,uuid,text,uuid) from public,anon,authenticated;
grant usage on schema diderot_private to authenticated;
grant execute on function diderot_private.organization_team(text,uuid,uuid,text,uuid) to authenticated;
-- Invoker wrapper exposes only the guarded workflow; the trigger remains non-executable.
create function public.organization_team(p_action text,p_organization uuid default null,p_invitation uuid default null,p_email text default null,p_member uuid default null)
returns jsonb language sql security invoker set search_path=''
as $$ select diderot_private.organization_team(p_action,p_organization,p_invitation,p_email,p_member); $$;
revoke all on function public.organization_team(text,uuid,uuid,text,uuid) from public,anon,authenticated;
grant execute on function public.organization_team(text,uuid,uuid,text,uuid) to authenticated;
