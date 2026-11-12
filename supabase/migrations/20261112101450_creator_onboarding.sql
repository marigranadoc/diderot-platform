-- Professional preferences do not grant brand/admin privileges.
create table public.creator_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  professional_name text not null check (char_length(trim(professional_name)) between 2 and 80),
  bio text not null default '' check (char_length(bio) <= 1000),
  city text not null default '' check (char_length(city) <= 100),
  state text not null default '' check (state = '' or state ~ '^[A-Z]{2}$'),
  modalities text[] not null check (
    cardinality(modalities) between 1 and 3
    and modalities <@ array['ugc','influencer','affiliate']::text[]
    and array_position(modalities,null) is null
    and cardinality(array_positions(modalities,'ugc')) <= 1
    and cardinality(array_positions(modalities,'influencer')) <= 1
    and cardinality(array_positions(modalities,'affiliate')) <= 1
  ),
  created_at timestamptz not null default now()
);
alter table public.creator_profiles enable row level security;
revoke all on public.creator_profiles from anon, authenticated;
grant select, insert on public.creator_profiles to authenticated;
grant update (professional_name,bio,city,state,modalities) on public.creator_profiles to authenticated;
create policy creator_profiles_read_own on public.creator_profiles for select to authenticated
  using ((select auth.uid()) = user_id);
create policy creator_profiles_insert_own on public.creator_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy creator_profiles_update_own on public.creator_profiles for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
