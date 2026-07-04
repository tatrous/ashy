-- ============================================================
-- Lapochka — Supabase schema (§10 product_book.md)
-- Run this in Supabase SQL Editor → "Run all"
-- ============================================================

-- ────────────────────────────────────────────────
-- EXTENSIONS
-- ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────
-- TABLES
-- ────────────────────────────────────────────────

-- 1. users (Telegram-based, no email/password)
create table if not exists public.users (
  id            uuid        primary key default uuid_generate_v4(),
  telegram_id   bigint      not null unique,
  username      text,
  first_name    text,
  photo_url     text,
  city          text,
  lapochki      integer     not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.users is 'Telegram-authenticated users of the Lapochka Mini App';

-- 2. flavors (brand-managed catalog)
create table if not exists public.flavors (
  id          uuid    primary key default uuid_generate_v4(),
  name        text    not null,
  description text,
  color_hex   text,
  image_url   text,
  is_rare     boolean not null default false,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

comment on table public.flavors is 'Lapochka lemonade flavor catalog';

-- 3. user_flavor_checkins (core engagement — a user finds a flavor)
create table if not exists public.user_flavor_checkins (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  flavor_id   uuid        not null references public.flavors(id) on delete cascade,
  location_id uuid,                              -- FK added after locations table
  lat         numeric(9,6),
  lng         numeric(9,6),
  note        text,
  photo_url   text,
  created_at  timestamptz not null default now(),
  unique (user_id, flavor_id)                    -- one check-in per flavor per user
);

comment on table public.user_flavor_checkins is 'Records when a user tries a flavor for the first time (check-in)';

-- 4. locations (points of sale / vending machines)
create table if not exists public.locations (
  id          uuid    primary key default uuid_generate_v4(),
  name        text    not null,
  address     text,
  city        text,
  lat         numeric(9,6) not null,
  lng         numeric(9,6) not null,
  type        text    check (type in ('store', 'vending', 'cafe', 'other')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

comment on table public.locations is 'Lapochka points of sale and vending machine locations';

-- back-fill FK from checkins → locations
alter table public.user_flavor_checkins
  add constraint fk_checkin_location
  foreign key (location_id) references public.locations(id) on delete set null;

-- 5. votes (active topics opened by brand)
create table if not exists public.votes (
  id          uuid    primary key default uuid_generate_v4(),
  title       text    not null,
  description text,
  options     jsonb   not null default '[]',
  starts_at   timestamptz,
  ends_at     timestamptz,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

comment on table public.votes is 'Brand-created voting topics (e.g. new flavor ideas)';

-- 6. user_votes (which option a user picked)
create table if not exists public.user_votes (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        not null references public.users(id) on delete cascade,
  vote_id    uuid        not null references public.votes(id) on delete cascade,
  option_id  text        not null,
  created_at timestamptz not null default now(),
  unique (user_id, vote_id)
);

comment on table public.user_votes is 'Records a user''s choice in a brand vote';

-- 7. tasks (gamification tasks / challenges)
create table if not exists public.tasks (
  id           uuid    primary key default uuid_generate_v4(),
  title        text    not null,
  description  text,
  reward_pts   integer not null default 0,
  task_type    text    check (task_type in ('checkin', 'collect', 'vote', 'share', 'other')),
  target_count integer not null default 1,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

comment on table public.tasks is 'Gamification tasks / challenges users can complete for Lapochki points';

-- 8. user_task_progress
create table if not exists public.user_task_progress (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references public.users(id) on delete cascade,
  task_id     uuid        not null references public.tasks(id) on delete cascade,
  progress    integer     not null default 0,
  completed   boolean     not null default false,
  completed_at timestamptz,
  created_at  timestamptz not null default now(),
  unique (user_id, task_id)
);

comment on table public.user_task_progress is 'Tracks a user''s progress toward each task';

-- ────────────────────────────────────────────────
-- INDEXES
-- ────────────────────────────────────────────────
create index if not exists idx_users_telegram_id        on public.users(telegram_id);
create index if not exists idx_checkins_user_id         on public.user_flavor_checkins(user_id);
create index if not exists idx_checkins_flavor_id       on public.user_flavor_checkins(flavor_id);
create index if not exists idx_checkins_location_id     on public.user_flavor_checkins(location_id);
create index if not exists idx_locations_city           on public.locations(city);
create index if not exists idx_user_votes_user_id       on public.user_votes(user_id);
create index if not exists idx_user_votes_vote_id       on public.user_votes(vote_id);
create index if not exists idx_task_progress_user_id    on public.user_task_progress(user_id);

-- ────────────────────────────────────────────────
-- UPDATED_AT TRIGGER (users table)
-- ────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- ────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────
-- Enable RLS on all user-data tables
alter table public.users                  enable row level security;
alter table public.user_flavor_checkins   enable row level security;
alter table public.user_votes             enable row level security;
alter table public.user_task_progress     enable row level security;

-- Read-only tables (brand-managed) — everyone can read
alter table public.flavors                enable row level security;
alter table public.locations              enable row level security;
alter table public.votes                  enable row level security;
alter table public.tasks                  enable row level security;

-- ── users ──────────────────────────────────────
-- Auth note: Telegram initData is validated in Edge Function → sets auth.uid() = users.id
create policy "users: read own row"
  on public.users for select
  using (auth.uid() = id);

create policy "users: update own row"
  on public.users for update
  using (auth.uid() = id);

-- ── user_flavor_checkins ───────────────────────
create policy "checkins: read own"
  on public.user_flavor_checkins for select
  using (auth.uid() = user_id);

create policy "checkins: insert own"
  on public.user_flavor_checkins for insert
  with check (auth.uid() = user_id);

-- ── user_votes ─────────────────────────────────
create policy "votes: read own"
  on public.user_votes for select
  using (auth.uid() = user_id);

create policy "votes: cast own"
  on public.user_votes for insert
  with check (auth.uid() = user_id);

-- ── user_task_progress ─────────────────────────
create policy "tasks: read own progress"
  on public.user_task_progress for select
  using (auth.uid() = user_id);

create policy "tasks: update own progress"
  on public.user_task_progress for update
  using (auth.uid() = user_id);

-- ── brand-managed read-only tables ─────────────
create policy "flavors: public read"   on public.flavors   for select using (true);
create policy "locations: public read" on public.locations for select using (true);
create policy "votes: public read"     on public.votes     for select using (true);
create policy "tasks: public read"     on public.tasks     for select using (true);

-- ────────────────────────────────────────────────
-- SEED: FLAVORS (8 core Lapochka SKUs)
-- ────────────────────────────────────────────────
insert into public.flavors (name, description, color_hex, is_rare, is_active) values
  ('Клубника',          'Классическая клубника — яркая и сочная',           '#FF4D6D', false, true),
  ('Арбуз',             'Летний арбуз с лёгкой кислинкой',                  '#2ECC71', false, true),
  ('Лимон',             'Освежающий лимон без лишней сладости',             '#F5C842', false, true),
  ('Персик-манго',      'Тропический дуэт с нежным ароматом',               '#FF8C42', false, true),
  ('Мята',              'Холодная мята — берёт с первого глотка',           '#27AE60', false, true),
  ('Лесная ягода',      'Чёрная смородина + черника + малина',              '#9B59B6', false, true),
  ('Голубика-лаванда',  'Редкий вкус — только ограниченная серия',          '#6C5CE7', true,  true),
  ('Имбирь-лимон',      'Остро-кислый — не для всех, но для своих',         '#E17055', true,  true)
on conflict do nothing;

-- ────────────────────────────────────────────────
-- SEED: TASKS
-- ────────────────────────────────────────────────
insert into public.tasks (title, description, reward_pts, task_type, target_count, is_active) values
  ('Первое открытие',       'Попробуй свой первый вкус Лапочки',              50,  'checkin', 1, true),
  ('Коллекционер x5',       'Попробуй 5 разных вкусов',                       100, 'collect', 5, true),
  ('Коллекционер x8',       'Собери все 8 вкусов',                            300, 'collect', 8, true),
  ('Охотник за редкостью',  'Найди оба редких вкуса',                         200, 'checkin', 2, true),
  ('Твой голос',            'Проголосуй в первом опросе бренда',               30,  'vote',    1, true),
  ('Активный голосователь', 'Прими участие в 3 опросах',                       80,  'vote',    3, true)
on conflict do nothing;

-- ────────────────────────────────────────────────
-- DONE
-- All tables, indexes, RLS policies and seed data
-- are ready. Next: connect your app via VITE_SUPABASE_URL
-- and VITE_SUPABASE_ANON_KEY from Supabase → Settings → API.
-- ────────────────────────────────────────────────
