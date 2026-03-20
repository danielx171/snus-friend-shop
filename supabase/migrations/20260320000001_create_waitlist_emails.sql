-- Membership waitlist: store emails from /membership page CTA
create table if not exists public.waitlist_emails (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  source      text not null default 'membership',
  created_at  timestamptz not null default now(),
  constraint waitlist_emails_email_source_unique unique (email, source)
);

-- Public can insert (unauthenticated visitors signing up)
alter table public.waitlist_emails enable row level security;

create policy "Anyone can join the waitlist"
  on public.waitlist_emails
  for insert
  to anon, authenticated
  with check (true);

-- Only service role / admins can read the list
create policy "Service role reads waitlist"
  on public.waitlist_emails
  for select
  using (false); -- clients never read; use service role in edge functions
