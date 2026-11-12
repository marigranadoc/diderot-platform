create table public.creator_portfolio_items (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.creator_profiles(user_id) on delete cascade,
 title text not null check (char_length(trim(title)) between 2 and 100),
 description text not null default '' check (char_length(description)<=2000),
 item_type text not null check (item_type in ('ugc_video','photo','case','demo','project','external')),
 category text not null default '' check (char_length(category)<=100),
 participation text not null default '' check (char_length(participation)<=200),
 media_url text not null check (char_length(media_url)<=2048 and media_url ~ '^https://[^/?#[:space:]@]+([/?#][^[:space:]]*)?$'),
 created_at timestamptz not null default now()
);
create index portfolio_owner_idx on public.creator_portfolio_items(user_id,created_at desc);
alter table public.creator_portfolio_items enable row level security;
revoke all on public.creator_portfolio_items from anon,authenticated;
grant select,insert,delete on public.creator_portfolio_items to authenticated;
grant update(title,description,item_type,category,participation,media_url) on public.creator_portfolio_items to authenticated;
create policy portfolio_read_own on public.creator_portfolio_items for select to authenticated using ((select auth.uid())=user_id);
create policy portfolio_insert_own on public.creator_portfolio_items for insert to authenticated with check ((select auth.uid())=user_id);
create policy portfolio_update_own on public.creator_portfolio_items for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy portfolio_delete_own on public.creator_portfolio_items for delete to authenticated using ((select auth.uid())=user_id);
