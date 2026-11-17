-- MyanNet V3 database schema for Supabase.
-- Run once in Supabase: SQL Editor -> New query -> paste this file -> Run.

-- ---------- Profiles (one per signed-in person) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null default '',
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public" on public.profiles for select using (true);
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
-- People may change their name and photo, never their admin flag.
revoke update on public.profiles from anon, authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name',
             new.phone, split_part(coalesce(new.email, ''), '@', 1), 'Member'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Listings (businesses, jobs, rooms, agents, carry offers, items) ----------
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  pillar text not null check (pillar in ('jobs','hundi','rent','cargo','goods','biz')),
  kind text not null default 'offer',
  title text not null check (char_length(title) between 3 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  country text not null default '',
  city text not null default '',
  price text check (char_length(price) <= 60),
  contact jsonb not null default '{}'::jsonb,
  author_name text not null default '',
  status text not null default 'active' check (status in ('active','closed')),
  created_at timestamptz not null default now()
);
create index if not exists listings_pillar_created on public.listings (pillar, created_at desc);
alter table public.listings enable row level security;
drop policy if exists "read listings" on public.listings;
create policy "read listings" on public.listings for select
  using (status = 'active' or user_id = auth.uid() or public.is_admin());
drop policy if exists "post own listings" on public.listings;
create policy "post own listings" on public.listings for insert with check (user_id = auth.uid());
drop policy if exists "edit own listings" on public.listings;
create policy "edit own listings" on public.listings for update using (user_id = auth.uid());
drop policy if exists "delete own or admin" on public.listings;
create policy "delete own or admin" on public.listings for delete
  using (user_id = auth.uid() or public.is_admin());

-- Spam guard: at most 5 new listings per person per day.
create or replace function public.limit_listings() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.listings
      where user_id = new.user_id and created_at > now() - interval '1 day') >= 5 then
    raise exception 'Daily post limit reached (5 per day)';
  end if;
  return new;
end $$;
drop trigger if exists listings_limit on public.listings;
create trigger listings_limit before insert on public.listings
  for each row execute function public.limit_listings();

-- ---------- Reviews: comments with optional 1-5 star rating ----------
-- listing_id is text so the built-in sample listings can be reviewed too.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id text not null,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  author_name text not null default '',
  stars smallint check (stars between 1 and 5),
  body text not null default '' check (char_length(body) <= 1000),
  created_at timestamptz not null default now()
);
create index if not exists reviews_listing on public.reviews (listing_id, created_at desc);
-- One star rating per person per listing (comments without stars are unlimited).
create unique index if not exists one_rating_per_person
  on public.reviews (listing_id, user_id) where stars is not null;
alter table public.reviews enable row level security;
drop policy if exists "read reviews" on public.reviews;
create policy "read reviews" on public.reviews for select using (true);
drop policy if exists "write own reviews" on public.reviews;
create policy "write own reviews" on public.reviews for insert with check (user_id = auth.uid());
drop policy if exists "delete own review or admin" on public.reviews;
create policy "delete own review or admin" on public.reviews for delete
  using (user_id = auth.uid() or public.is_admin());

-- ---------- Reports (the Report button) ----------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id text not null,
  review_id uuid,
  reason text not null default '' check (char_length(reason) <= 500),
  reporter uuid default auth.uid(),
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "anyone signed in can report" on public.reports;
create policy "anyone signed in can report" on public.reports for insert
  with check (auth.uid() is not null);
drop policy if exists "admins read reports" on public.reports;
create policy "admins read reports" on public.reports for select using (public.is_admin());
drop policy if exists "admins clear reports" on public.reports;
create policy "admins clear reports" on public.reports for delete using (public.is_admin());

-- ---------- "Register interest" email list ----------
create table if not exists public.interest_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) <= 200),
  role text,
  country text,
  created_at timestamptz not null default now()
);
alter table public.interest_signups enable row level security;
drop policy if exists "anyone can sign up" on public.interest_signups;
create policy "anyone can sign up" on public.interest_signups for insert with check (true);
drop policy if exists "admins read signups" on public.interest_signups;
create policy "admins read signups" on public.interest_signups for select using (public.is_admin());

-- ---------- After you sign in for the first time, make yourself admin ----------
-- update public.profiles set is_admin = true where id = (
--   select id from auth.users order by created_at limit 1);

-- ---------- v3.1: what each person came for (offer / seek / browse) ----------
alter table public.profiles add column if not exists intent text check (intent in ('offer','seek','browse'));
grant update (intent) on public.profiles to authenticated;

-- ---------- v3.2: MyanNet Zayat (ဇရပ်) community discussion ----------
-- Topics live here; replies reuse the reviews table with listing_id = 'z-<topic id>' (no stars),
-- so reporting and admin removal work the same way as for listings.
create table if not exists public.zayat_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  author_name text not null default '',
  category text not null default 'general' check (category in ('ask','business','city','help','announce','general')),
  title text not null check (char_length(title) between 3 and 140),
  body text not null default '' check (char_length(body) <= 3000),
  city text not null default '' check (char_length(city) <= 80),
  reply_count int not null default 0,
  last_activity timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists zayat_recent on public.zayat_topics (last_activity desc);
alter table public.zayat_topics enable row level security;
drop policy if exists "read zayat" on public.zayat_topics;
create policy "read zayat" on public.zayat_topics for select using (true);
drop policy if exists "start own topic" on public.zayat_topics;
create policy "start own topic" on public.zayat_topics for insert with check (user_id = auth.uid());
drop policy if exists "delete own topic or admin" on public.zayat_topics;
create policy "delete own topic or admin" on public.zayat_topics for delete using (user_id = auth.uid() or public.is_admin());
revoke update on public.zayat_topics from anon, authenticated;

-- Spam guard: at most 5 new topics per person per day.
create or replace function public.limit_topics() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.zayat_topics
      where user_id = new.user_id and created_at > now() - interval '1 day') >= 5 then
    raise exception 'Daily topic limit reached (5 per day)';
  end if;
  return new;
end $$;
drop trigger if exists zayat_limit on public.zayat_topics;
create trigger zayat_limit before insert on public.zayat_topics
  for each row execute function public.limit_topics();

-- Keep reply counts and "last activity" up to date.
create or replace function public.zayat_reply_count() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' and new.listing_id like 'z-%' then
    update public.zayat_topics set reply_count = reply_count + 1, last_activity = now()
      where id::text = substr(new.listing_id, 3);
  elsif tg_op = 'DELETE' and old.listing_id like 'z-%' then
    update public.zayat_topics set reply_count = greatest(reply_count - 1, 0)
      where id::text = substr(old.listing_id, 3);
  end if;
  return null;
end $$;
drop trigger if exists reviews_zayat_count on public.reviews;
create trigger reviews_zayat_count after insert or delete on public.reviews
  for each row execute function public.zayat_reply_count();

-- When a topic is removed, remove its replies too.
create or replace function public.zayat_cleanup() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from public.reviews where listing_id = 'z-' || old.id::text;
  return old;
end $$;
drop trigger if exists zayat_cleanup on public.zayat_topics;
create trigger zayat_cleanup after delete on public.zayat_topics
  for each row execute function public.zayat_cleanup();

-- Spam guard for comments and replies: at most 30 per person per day.
create or replace function public.limit_reviews() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.reviews
      where user_id = new.user_id and created_at > now() - interval '1 day') >= 30 then
    raise exception 'Daily comment limit reached (30 per day)';
  end if;
  return new;
end $$;
drop trigger if exists reviews_limit on public.reviews;
create trigger reviews_limit before insert on public.reviews
  for each row execute function public.limit_reviews();

-- ---------- v3.3: choose your public name (and hide your photo) ----------
-- Names go through this function only, so "Admin"/"MyanNet" names stay reserved for admins,
-- and the new name is applied to everything the person has already posted.
revoke update (display_name, avatar_url) on public.profiles from authenticated;
create or replace function public.set_my_name(new_name text, show_photo boolean) returns void
language plpgsql security definer set search_path = public as $$
declare n text := btrim(coalesce(new_name, ''));
begin
  if auth.uid() is null then raise exception 'Please sign in'; end if;
  if char_length(n) < 2 or char_length(n) > 40 then raise exception 'Name must be 2 to 40 characters'; end if;
  if not public.is_admin() and n ~* '(admin|myannet|moderator|မြန်နက်)' then
    raise exception 'This name is reserved. Please choose another.';
  end if;
  update public.profiles p set display_name = n,
    avatar_url = case when show_photo then coalesce(nullif(p.avatar_url, ''),
        (select coalesce(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture') from auth.users u where u.id = auth.uid()))
      else '' end
    where p.id = auth.uid();
  update public.listings set author_name = n where user_id = auth.uid();
  update public.reviews set author_name = n where user_id = auth.uid();
  update public.zayat_topics set author_name = n where user_id = auth.uid();
end $$;
revoke all on function public.set_my_name(text, boolean) from public, anon;
grant execute on function public.set_my_name(text, boolean) to authenticated;
