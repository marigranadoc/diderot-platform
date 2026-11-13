-- Workspace preference is user editable; it never grants organization/admin access.
create table public.account_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 account_type text not null check(account_type in ('shopper','creator','brand')),
 display_name text not null check(char_length(trim(display_name)) between 2 and 80),
 city text not null default '' check(char_length(city)<=100),
 interests text[] not null default '{}' check(cardinality(interests)<=3 and interests<@array['Moda','Beleza','Casa']::text[] and array_position(interests,null) is null),
 onboarding_completed boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.account_profiles enable row level security;
revoke all on public.account_profiles from public,anon,authenticated;
grant select on public.account_profiles to authenticated;
grant insert(user_id,account_type,display_name,city,interests,onboarding_completed) on public.account_profiles to authenticated;
grant update(account_type,display_name,city,interests,onboarding_completed) on public.account_profiles to authenticated;
create policy account_profiles_read_own on public.account_profiles for select to authenticated using(user_id=(select auth.uid()));
create policy account_profiles_insert_own on public.account_profiles for insert to authenticated with check(user_id=(select auth.uid()));
create policy account_profiles_update_own on public.account_profiles for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));

create function public.complete_account_onboarding(p_type text,p_name text,p_city text default '',p_interests text[] default '{}',p_bio text default '',p_modalities text[] default array['ugc'],p_state text default '',p_organization_name text default '',p_website text default '',p_organization_description text default '')
returns jsonb language plpgsql security invoker set search_path=''
as $$
declare actor uuid:=auth.uid(); organization_id uuid;
begin
 if actor is null then raise exception 'Authentication required' using errcode='42501'; end if;
 if p_type is null or p_type not in ('shopper','creator','brand') or p_name is null or char_length(trim(p_name)) not between 2 and 80 then raise exception 'Invalid account profile' using errcode='22023'; end if;
 if p_type='creator' then
  insert into public.creator_profiles(user_id,professional_name,bio,city,state,modalities)
  values(actor,trim(p_name),coalesce(p_bio,''),coalesce(p_city,''),upper(coalesce(p_state,'')),p_modalities)
  on conflict(user_id) do update set professional_name=excluded.professional_name,bio=excluded.bio,city=excluded.city,state=excluded.state,modalities=excluded.modalities;
 elsif p_type='brand' then
  if p_organization_name is null or char_length(trim(p_organization_name)) not between 2 and 100 then raise exception 'Invalid organization name' using errcode='22023'; end if;
  select id into organization_id from public.organizations where owner_user_id=actor for update;
  if organization_id is null then
   insert into public.organizations(name,website,description) values(trim(p_organization_name),trim(coalesce(p_website,'')),coalesce(p_organization_description,'')) returning id into organization_id;
  else
   update public.organizations set name=trim(p_organization_name),website=trim(coalesce(p_website,'')),description=coalesce(p_organization_description,'') where id=organization_id and owner_user_id=actor;
  end if;
 end if;
 insert into public.account_profiles(user_id,account_type,display_name,city,interests,onboarding_completed)
 values(actor,p_type,trim(p_name),coalesce(p_city,''),coalesce(p_interests,'{}'),true)
 on conflict(user_id) do update set account_type=excluded.account_type,display_name=excluded.display_name,city=excluded.city,interests=excluded.interests,onboarding_completed=true;
 return jsonb_build_object('user_id',actor,'account_type',p_type,'onboarding_completed',true);
end;
$$;
revoke all on function public.complete_account_onboarding(text,text,text,text[],text,text[],text,text,text,text) from public,anon,authenticated;
grant execute on function public.complete_account_onboarding(text,text,text,text[],text,text[],text,text,text,text) to authenticated;
