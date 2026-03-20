create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free',
  free_analyses_used integer not null default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  subscription_status text default 'inactive',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt text not null,
  prompt_tokens integer not null default 0,
  completion_tokens integer not null default 0,
  total_tokens integer not null default 0,
  provider_mode text not null default 'demo',
  created_at timestamptz not null default now()
);

create index if not exists analysis_events_user_id_idx on public.analysis_events(user_id);
create index if not exists analysis_events_created_at_idx on public.analysis_events(created_at desc);

alter table public.profiles enable row level security;
alter table public.analysis_events enable row level security;

drop policy if exists "Users can view their profile" on public.profiles;
create policy "Users can view their profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Users can view their analysis events" on public.analysis_events;
create policy "Users can view their analysis events"
on public.analysis_events
for select
using (auth.uid() = user_id);
