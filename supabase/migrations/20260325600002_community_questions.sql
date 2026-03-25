-- Community Q&A System
-- Questions, answers, and answer votes for the Community Hub page

-- 1. community_questions table
create table if not exists public.community_questions (
  id                 uuid        primary key default gen_random_uuid(),
  user_id            uuid        not null references auth.users(id) on delete cascade,
  title              text        not null check (char_length(title) between 5 and 200),
  body               text        check (char_length(body) <= 2000),
  category           text        not null default 'general'
                                  check (category in ('reviews', 'flavor-talk', 'new-releases', 'tips', 'general')),
  votes              integer     not null default 0,
  answers_count      integer     not null default 0,
  accepted_answer_id uuid,
  is_resolved        boolean     not null default false,
  created_at         timestamptz not null default now()
);

alter table public.community_questions enable row level security;

create policy "community_questions_public_read"
  on public.community_questions for select
  using (true);

create policy "community_questions_auth_insert"
  on public.community_questions for insert
  with check (auth.uid() = user_id);

create policy "community_questions_own_update"
  on public.community_questions for update
  using (auth.uid() = user_id);

-- 2. community_answers table
create table if not exists public.community_answers (
  id          uuid        primary key default gen_random_uuid(),
  question_id uuid        not null references public.community_questions(id) on delete cascade,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  body        text        not null check (char_length(body) between 1 and 2000),
  votes       integer     not null default 0,
  is_accepted boolean     not null default false,
  created_at  timestamptz not null default now()
);

alter table public.community_answers enable row level security;

create policy "community_answers_public_read"
  on public.community_answers for select
  using (true);

create policy "community_answers_auth_insert"
  on public.community_answers for insert
  with check (auth.uid() = user_id);

create policy "community_answers_own_update"
  on public.community_answers for update
  using (auth.uid() = user_id);

-- 3. community_answer_votes table
create table if not exists public.community_answer_votes (
  user_id   uuid     not null references auth.users(id) on delete cascade,
  answer_id uuid     not null references public.community_answers(id) on delete cascade,
  vote      smallint not null check (vote in (-1, 1)),
  primary key (user_id, answer_id)
);

alter table public.community_answer_votes enable row level security;

create policy "community_answer_votes_public_read"
  on public.community_answer_votes for select
  using (true);

create policy "community_answer_votes_own_insert"
  on public.community_answer_votes for insert
  with check (auth.uid() = user_id);

create policy "community_answer_votes_own_update"
  on public.community_answer_votes for update
  using (auth.uid() = user_id);

create policy "community_answer_votes_own_delete"
  on public.community_answer_votes for delete
  using (auth.uid() = user_id);

-- 4. Trigger: auto-update answers_count on community_questions
create or replace function public.update_question_answers_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if TG_OP = 'INSERT' then
    update public.community_questions
    set answers_count = answers_count + 1
    where id = NEW.question_id;
  elsif TG_OP = 'DELETE' then
    update public.community_questions
    set answers_count = greatest(answers_count - 1, 0)
    where id = OLD.question_id;
  end if;
  return null;
end;
$$;

create trigger trg_community_answers_count
  after insert or delete on public.community_answers
  for each row execute function public.update_question_answers_count();
