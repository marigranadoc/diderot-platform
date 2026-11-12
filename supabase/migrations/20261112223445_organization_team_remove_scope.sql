-- Only an existing member of this organization may affect its invitation history.
create or replace function diderot_private.organization_team(p_action text,p_organization uuid,p_invitation uuid,p_email text,p_member uuid)
returns jsonb language plpgsql security definer set search_path=''
as $$
declare
 actor uuid:=auth.uid(); actor_email text; target_email text;
 org public.organizations%rowtype; invitation public.organization_invitations%rowtype;
 result jsonb; removed_user uuid;
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
  delete from public.organization_members where organization_id=org.id and user_id=p_member and role='member' returning user_id into removed_user;
  if removed_user is null then return jsonb_build_object('removed',true); end if;
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
