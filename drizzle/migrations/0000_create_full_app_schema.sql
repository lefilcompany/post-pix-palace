-- ===================== ENUMS =====================
do $$ begin
  if not exists (select 1 from pg_type where typname='team_role') then
    create type public.team_role as enum ('admin','member');
  end if;
  if not exists (select 1 from pg_type where typname='member_status') then
    create type public.member_status as enum ('pending','active','rejected');
  end if;
  if not exists (select 1 from pg_type where typname='invitation_status') then
    create type public.invitation_status as enum ('pending','approved','rejected');
  end if;
end $$;

-- ===================== PROFILES =====================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  current_team_id integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- ===================== TEAMS =====================
create table if not exists public.teams (
  id integer generated always as identity primary key,
  name text not null,
  team_code text not null unique,
  admin_user_id uuid not null references public.profiles(id) on delete cascade,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;

-- ===================== TEAM MEMBERS =====================
create table if not exists public.team_members (
  id integer generated always as identity primary key,
  team_id integer not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.team_role not null default 'member',
  status public.member_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;

-- ===================== TEAM INVITATIONS =====================
create table if not exists public.team_invitations (
  id integer generated always as identity primary key,
  team_id integer not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.invitation_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_invitations TO authenticated;
GRANT ALL ON public.team_invitations TO service_role;

-- ===================== BRANDS =====================
create table if not exists public.brands (
  id integer generated always as identity primary key,
  user_id uuid not null,
  team_id integer,
  name text not null,
  value_proposition text,
  brand_pillars text,
  brand_mission text,
  brand_inspiration text,
  current_objective text,
  numeric_target text,
  restrictions text,
  brand_hashtags text,
  reference_contents text,
  important_dates text,
  relevant_content text,
  brand_crisis text,
  target_audience text,
  brand_personality text,
  brand_voice text,
  brand_competitors text,
  brand_differentials text,
  brand_promise text,
  influencers_action integer,
  brand_manual integer,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT ALL ON public.brands TO service_role;

-- ===================== THEMES =====================
create table if not exists public.themes (
  id integer generated always as identity primary key,
  user_id uuid not null,
  team_id integer,
  title text not null,
  description text,
  voice_ai text,
  hashtags text[],
  objectives text[],
  brand_id integer references public.brands(id) on delete set null,
  colors text,
  universe_target text,
  add_info text,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.themes TO authenticated;
GRANT ALL ON public.themes TO service_role;

-- ===================== PERSONAS =====================
create table if not exists public.personas (
  id integer generated always as identity primary key,
  user_id uuid not null,
  team_id integer,
  name text not null,
  age integer,
  position_degree text,
  location text,
  main_objective text,
  challenge text,
  interests text[],
  pain_points text[],
  preferred_platforms text[],
  brand_id integer references public.brands(id) on delete set null,
  gender text,
  beliefs text,
  content_habit text,
  favorite_voice text,
  buy_journey text,
  interest_trigger text,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.personas TO authenticated;
GRANT ALL ON public.personas TO service_role;

-- ===================== CONTENTS =====================
create table if not exists public.contents (
  id integer generated always as identity primary key,
  user_id uuid not null,
  team_id integer,
  brand_id integer references public.brands(id) on delete set null,
  theme_id integer references public.themes(id) on delete set null,
  persona_id integer references public.personas(id) on delete set null,
  micro_result text not null default '',
  main_message text,
  feeling text,
  format text,
  image_url text,
  next_step text,
  response_ai text,
  content_type text,
  platform text,
  status text default 'draft',
  is_promote integer,
  visual_reference integer,
  scheduled_for timestamptz,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contents TO authenticated;
GRANT ALL ON public.contents TO service_role;

-- ===================== PLANS =====================
create table if not exists public.plans (
  id integer generated always as identity primary key,
  name text not null,
  plan_type text not null,
  price numeric(10,2) not null default 0,
  members_limit integer not null default 1,
  brands_limit integer not null default 1,
  themes_limit integer not null default 1,
  personas_limit integer not null default 1,
  content_limit integer not null default 1,
  planning_limit integer not null default 1,
  review_limit integer not null default 1,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.plans TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;

-- ===================== SUBSCRIPTIONS =====================
create table if not exists public.subscriptions (
  id integer generated always as identity primary key,
  user_id uuid not null,
  team_id integer,
  plan_id integer references public.plans(id) on delete set null,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

-- ===================== PLANNING =====================
create table if not exists public.planning (
  id integer generated always as identity primary key,
  user_id uuid not null,
  team_id integer,
  brand_id integer not null references public.brands(id) on delete cascade,
  theme_id integer not null references public.themes(id) on delete cascade,
  platform text not null,
  posts_number integer not null default 1,
  add_info text,
  response_ai text,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.planning TO authenticated;
GRANT ALL ON public.planning TO service_role;

-- ===================== REVIEWS =====================
create table if not exists public.reviews (
  id integer generated always as identity primary key,
  user_id uuid not null,
  team_id integer,
  brand_id integer not null references public.brands(id) on delete cascade,
  theme_id integer references public.themes(id) on delete set null,
  ia_text text not null,
  response_ai text,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

-- ===================== SOLICITATIONS =====================
create table if not exists public.solicitations (
  id integer generated always as identity primary key,
  user_id uuid not null,
  team_id integer not null references public.teams(id) on delete cascade,
  status integer not null default 0,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.solicitations TO authenticated;
GRANT ALL ON public.solicitations TO service_role;

-- ===================== CONTENT PLANS (AI function) =====================
create table if not exists public.content_plans (
  id integer generated always as identity primary key,
  user_id uuid not null,
  team_id integer,
  brand_id integer references public.brands(id) on delete cascade,
  theme_id integer references public.themes(id) on delete cascade,
  title text not null,
  description text,
  target_audience text,
  post_count integer,
  platforms text[],
  frequency text,
  duration_days integer,
  content_types text[],
  objectives text[],
  ai_suggestions text,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_plans TO authenticated;
GRANT ALL ON public.content_plans TO service_role;

-- ===================== CONTENT REVIEWS (AI function) =====================
create table if not exists public.content_reviews (
  id integer generated always as identity primary key,
  user_id uuid not null,
  team_id integer,
  brand_id integer references public.brands(id) on delete cascade,
  theme_id integer references public.themes(id) on delete cascade,
  content_text text not null,
  content_image_url text,
  content_video_url text,
  review_type text,
  platform text,
  positive_points text,
  negative_points text,
  improvement_suggestions text,
  engagement_tips text,
  overall_score integer,
  ai_analysis text,
  is_deleted integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_reviews TO authenticated;
GRANT ALL ON public.content_reviews TO service_role;

-- ===================== SECURITY DEFINER HELPERS =====================
create or replace function public.is_team_member(_team_id integer, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.team_members
                 where team_id = _team_id and user_id = _user_id and status = 'active');
$$;

create or replace function public.is_team_admin(_team_id integer, _user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.team_members
                 where team_id = _team_id and user_id = _user_id and role = 'admin' and status = 'active');
$$;

create or replace function public.shares_team_with(_other uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.team_members a
    join public.team_members b on a.team_id = b.team_id
    where a.user_id = _other and b.user_id = auth.uid()
      and a.status = 'active' and b.status = 'active'
  );
$$;

-- ===================== ONE TEAM PER USER =====================
create or replace function public.enforce_single_membership()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.team_members where user_id = new.user_id) then
    raise exception 'Este usuario ja participa de uma equipe. So e possivel fazer parte de 1 equipe.';
  end if;
  return new;
end $$;

drop trigger if exists team_members_single_team on public.team_members;
create trigger team_members_single_team before insert on public.team_members
for each row execute function public.enforce_single_membership();

create or replace function public.enforce_single_team_creation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.team_members where user_id = new.admin_user_id) then
    raise exception 'Voce ja participa de uma equipe e nao pode criar outra.';
  end if;
  return new;
end $$;

drop trigger if exists teams_single_team on public.teams;
create trigger teams_single_team before insert on public.teams
for each row execute function public.enforce_single_team_creation();

-- ===================== PROFILE ON SIGNUP =====================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email,''),'@',1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill profiles for users that already exist
insert into public.profiles (id, full_name, email)
select id,
       coalesce(raw_user_meta_data->>'full_name', split_part(coalesce(email,''),'@',1)),
       email
from auth.users
on conflict (id) do nothing;

-- ===================== UPDATED_AT =====================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

do $$
declare t text;
begin
  for t in select unnest(array[
    'profiles','teams','team_members','team_invitations','brands','themes','personas',
    'contents','plans','subscriptions','planning','reviews','solicitations',
    'content_plans','content_reviews'])
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ===================== RLS =====================
do $$
declare t text;
begin
  for t in select unnest(array[
    'profiles','teams','team_members','team_invitations','brands','themes','personas',
    'contents','plans','subscriptions','planning','reviews','solicitations',
    'content_plans','content_reviews'])
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.shares_team_with(id));
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- teams (code lookup must work for any logged-in user so people can join)
drop policy if exists teams_select on public.teams;
create policy teams_select on public.teams for select to authenticated using (true);
drop policy if exists teams_insert on public.teams;
create policy teams_insert on public.teams for insert to authenticated
  with check (admin_user_id = auth.uid());
drop policy if exists teams_update on public.teams;
create policy teams_update on public.teams for update to authenticated
  using (public.is_team_admin(id, auth.uid()));
drop policy if exists teams_delete on public.teams;
create policy teams_delete on public.teams for delete to authenticated
  using (public.is_team_admin(id, auth.uid()));

-- team_members
drop policy if exists team_members_select on public.team_members;
create policy team_members_select on public.team_members for select to authenticated
  using (user_id = auth.uid() or public.is_team_member(team_id, auth.uid()));
drop policy if exists team_members_insert on public.team_members;
create policy team_members_insert on public.team_members for insert to authenticated
  with check (user_id = auth.uid() or public.is_team_admin(team_id, auth.uid()));
drop policy if exists team_members_update on public.team_members;
create policy team_members_update on public.team_members for update to authenticated
  using (public.is_team_admin(team_id, auth.uid()));
drop policy if exists team_members_delete on public.team_members;
create policy team_members_delete on public.team_members for delete to authenticated
  using (public.is_team_admin(team_id, auth.uid()));

-- team_invitations
drop policy if exists team_invitations_select on public.team_invitations;
create policy team_invitations_select on public.team_invitations for select to authenticated
  using (user_id = auth.uid() or public.is_team_admin(team_id, auth.uid()));
drop policy if exists team_invitations_insert on public.team_invitations;
create policy team_invitations_insert on public.team_invitations for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists team_invitations_update on public.team_invitations;
create policy team_invitations_update on public.team_invitations for update to authenticated
  using (public.is_team_admin(team_id, auth.uid()));
drop policy if exists team_invitations_delete on public.team_invitations;
create policy team_invitations_delete on public.team_invitations for delete to authenticated
  using (public.is_team_admin(team_id, auth.uid()));

-- shared content tables
create or replace function public.can_read_team_row(_user_id uuid, _team_id integer)
returns boolean language sql stable security definer set search_path = public as $$
  select _user_id = auth.uid() or public.is_team_member(_team_id, auth.uid());
$$;

do $$
declare t text;
begin
  for t in select unnest(array['brands','themes','personas','contents','subscriptions','planning','reviews','content_plans','content_reviews'])
  loop
    execute format('drop policy if exists %I_select on public.%I', t, t);
    execute format(
      'create policy %I_select on public.%I for select to authenticated using (public.can_read_team_row(user_id, team_id))', t, t);
    execute format('drop policy if exists %I_insert on public.%I', t, t);
    execute format(
      'create policy %I_insert on public.%I for insert to authenticated with check (user_id = auth.uid())', t, t);
    execute format('drop policy if exists %I_update on public.%I', t, t);
    execute format(
      'create policy %I_update on public.%I for update to authenticated using (user_id = auth.uid() or public.is_team_admin(team_id, auth.uid()))', t, t);
    execute format('drop policy if exists %I_delete on public.%I', t, t);
    execute format(
      'create policy %I_delete on public.%I for delete to authenticated using (user_id = auth.uid() or public.is_team_admin(team_id, auth.uid()))', t, t);
  end loop;
end $$;

-- solicitations
drop policy if exists solicitations_select on public.solicitations;
create policy solicitations_select on public.solicitations for select to authenticated
  using (user_id = auth.uid() or public.is_team_admin(team_id, auth.uid()));
drop policy if exists solicitations_insert on public.solicitations;
create policy solicitations_insert on public.solicitations for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists solicitations_update on public.solicitations;
create policy solicitations_update on public.solicitations for update to authenticated
  using (public.is_team_admin(team_id, auth.uid()));

-- plans (public catalog)
drop policy if exists plans_select on public.plans;
create policy plans_select on public.plans for select using (true);

-- ===================== SCHEMA / SEQUENCE GRANTS =====================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;

-- ===================== SEED PLANS =====================
insert into public.plans (name, plan_type, price, members_limit, brands_limit, themes_limit, personas_limit, content_limit, planning_limit, review_limit)
select * from (values
  ('Free','free',0,1,1,2,2,10,3,5),
  ('Basic','basic',99,3,3,10,10,100,20,30),
  ('Premium','premium',249,10,10,50,50,-1,-1,-1),
  ('Enterprise','enterprise',699,-1,-1,-1,-1,-1,-1,-1)
) as v(name, plan_type, price, members_limit, brands_limit, themes_limit, personas_limit, content_limit, planning_limit, review_limit)
where not exists (select 1 from public.plans);

-- ===================== INDEXES =====================
create index if not exists team_members_user_idx on public.team_members (user_id);
create index if not exists brands_team_idx on public.brands (team_id);
create index if not exists themes_team_idx on public.themes (team_id);
create index if not exists personas_team_idx on public.personas (team_id);
create index if not exists contents_team_idx on public.contents (team_id);
create index if not exists planning_team_idx on public.planning (team_id);
create index if not exists reviews_team_idx on public.reviews (team_id);