-- Run this in your Supabase SQL editor for Grâce & Armel RSVP storage.

create table if not exists public.rsvp_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null default '',
  email text not null default '',
  guest_count integer not null default 1 check (guest_count >= 1 and guest_count <= 10),
  attending boolean not null default true,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists rsvp_submissions_created_at_idx
  on public.rsvp_submissions (created_at desc);

alter table public.rsvp_submissions enable row level security;
