create table public.creator_services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.creator_profiles(user_id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 100),
  description text not null default '' check (char_length(description)<=2000),
  service_type text not null check (service_type in ('ugc_video','video_package','product_photo','unboxing','demo','testimonial','scripted_video','ad_content','editing','bilingual')),
  pricing_mode text not null check (pricing_mode in ('quote','starting')),
  starting_price_cents integer,
  created_at timestamptz not null default now(),
  check ((pricing_mode='quote' and starting_price_cents is null) or (pricing_mode='starting' and starting_price_cents between 1 and 100000000))
);
create index creator_services_owner_idx on public.creator_services(user_id,created_at desc);
alter table public.creator_services enable row level security;
revoke all on public.creator_services from anon,authenticated;
grant select,insert,delete on public.creator_services to authenticated;
grant update(title,description,service_type,pricing_mode,starting_price_cents) on public.creator_services to authenticated;
create policy services_read_own on public.creator_services for select to authenticated using ((select auth.uid())=user_id);
create policy services_insert_own on public.creator_services for insert to authenticated with check ((select auth.uid())=user_id);
create policy services_update_own on public.creator_services for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy services_delete_own on public.creator_services for delete to authenticated using ((select auth.uid())=user_id);
