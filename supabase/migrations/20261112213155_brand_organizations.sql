-- Private organization foundation. One organization may be created per account
-- in this increment; invitations and commercial approval are not implemented.
create schema diderot_private;
revoke all on schema diderot_private from public, anon, authenticated;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 2 and 100),
  website text not null default '' check (website='' or (char_length(website)<=2048 and website ~ '^https://[^/?#[:space:]@]+([/?#][^[:space:]]*)?$')),
  description text not null default '' check (char_length(description)<=2000),
  created_at timestamptz not null default now(),
  constraint organizations_one_owned_per_account unique(owner_user_id)
);
create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','member')),
  created_at timestamptz not null default now(),
  primary key(organization_id,user_id)
);
create index organization_members_user_idx on public.organization_members(user_id,organization_id);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
revoke all on public.organizations,public.organization_members from public,anon,authenticated;
grant select on public.organizations,public.organization_members to authenticated;
grant insert(name,website,description) on public.organizations to authenticated;
grant update(name,website,description) on public.organizations to authenticated;

create policy organizations_read_linked on public.organizations for select to authenticated
using (owner_user_id=(select auth.uid()) or id in (
  select organization_id from public.organization_members where user_id=(select auth.uid())
));
create policy organizations_create_own on public.organizations for insert to authenticated
with check (owner_user_id=(select auth.uid()));
create policy organizations_edit_owned on public.organizations for update to authenticated
using (owner_user_id=(select auth.uid())) with check (owner_user_id=(select auth.uid()));
create policy organization_members_read_self on public.organization_members for select to authenticated
using (user_id=(select auth.uid()));

-- The private trigger is the only application path for bootstrapping an owner
-- membership. It writes only the newly inserted organization's verified owner.
-- Direct member writes and direct execution of this function are never granted.
create function diderot_private.attach_organization_owner() returns trigger
language plpgsql security definer set search_path=''
as $$
begin
  if auth.uid() is null or new.owner_user_id is distinct from auth.uid() then
    raise exception 'Organization owner must match authenticated user' using errcode='42501';
  end if;
  insert into public.organization_members(organization_id,user_id,role)
  values(new.id,new.owner_user_id,'owner');
  return new;
end;
$$;
revoke all on function diderot_private.attach_organization_owner() from public,anon,authenticated;
create trigger organizations_attach_owner after insert on public.organizations
for each row execute function diderot_private.attach_organization_owner();
