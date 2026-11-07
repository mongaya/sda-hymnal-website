-- Run in Supabase SQL Editor. Auth users are maintained by Supabase Auth.
create table if not exists public.favorites (
 user_id uuid not null references auth.users(id) on delete cascade,
 hymn_id text not null,
 created_at timestamptz not null default now(),
 primary key (user_id,hymn_id)
);
create table if not exists public.playlist_items (
 user_id uuid not null references auth.users(id) on delete cascade,
 hymn_id text not null,
 created_at timestamptz not null default now(),
 primary key (user_id,hymn_id)
);
alter table public.favorites enable row level security;
alter table public.playlist_items enable row level security;
create policy "Users read own favorites" on public.favorites for select to authenticated using ((select auth.uid())=user_id);
create policy "Users add own favorites" on public.favorites for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Users delete own favorites" on public.favorites for delete to authenticated using ((select auth.uid())=user_id);
create policy "Users read own playlists" on public.playlist_items for select to authenticated using ((select auth.uid())=user_id);
create policy "Users add own playlists" on public.playlist_items for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Users delete own playlists" on public.playlist_items for delete to authenticated using ((select auth.uid())=user_id);
