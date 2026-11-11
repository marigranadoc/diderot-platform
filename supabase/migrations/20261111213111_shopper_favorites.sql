create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_slug text not null references public.products(slug) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_slug)
);
create index favorites_product_idx on public.favorites(product_slug);
alter table public.favorites enable row level security;
revoke all on public.favorites from anon, authenticated;
grant select, insert, delete on public.favorites to authenticated;
create policy favorites_read_own on public.favorites for select to authenticated
  using ((select auth.uid()) = user_id);
create policy favorites_insert_own on public.favorites for insert to authenticated
  with check ((select auth.uid()) = user_id and exists (select 1 from public.products p where p.slug = product_slug));
create policy favorites_delete_own on public.favorites for delete to authenticated
  using ((select auth.uid()) = user_id);
