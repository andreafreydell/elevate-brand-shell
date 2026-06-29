-- "The Next Chapter" quiz capture (public page at /next-chapter/index.html).
-- Anonymous visitors submit their Becoming Profile via the Supabase REST API
-- using the anon key, so we allow anon INSERT + UPDATE (upsert) but NO public
-- SELECT (the page writes with Prefer: return=minimal). Service role / staff can
-- still read for admin purposes since service role bypasses RLS.

create table if not exists public.members (
  email text primary key,
  name text,
  becoming_profile jsonb,
  created_at timestamptz default now()
);

create table if not exists public.chapter_responses (
  id bigint generated always as identity primary key,
  email text references public.members(email) on delete cascade,
  chapter int not null,
  goals jsonb,
  saved_styles jsonb,
  vote text,
  note text,
  rsvp boolean,
  updated_at timestamptz default now(),
  unique (email, chapter)
);

alter table public.members enable row level security;
alter table public.chapter_responses enable row level security;

-- Privilege grants for the public (anon) and signed-in (authenticated) roles.
-- Intentionally no SELECT: quiz responses are not publicly readable.
grant insert, update on public.members to anon, authenticated;
grant insert, update on public.chapter_responses to anon, authenticated;

-- Public quiz: anyone may submit (insert) and revise (update via upsert).
create policy "next_chapter_members_insert" on public.members
  for insert to anon, authenticated with check (true);
create policy "next_chapter_members_update" on public.members
  for update to anon, authenticated using (true) with check (true);

create policy "next_chapter_responses_insert" on public.chapter_responses
  for insert to anon, authenticated with check (true);
create policy "next_chapter_responses_update" on public.chapter_responses
  for update to anon, authenticated using (true) with check (true);
