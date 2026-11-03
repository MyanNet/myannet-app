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
