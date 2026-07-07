-- 0001_initial.sql
-- Esquema fase 1: members, projects, tasks, time_entries + RLS + vista de desviación

-- =============== TABLAS ===============

create table members (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  display_name text,
  role text not null check (role in ('admin','dev')) default 'dev',
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null check (status in ('active','archived')) default 'active',
  created_by text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id),
  title text not null,
  description text,
  status text not null check (status in ('todo','in_progress','done')) default 'todo',
  assignee_clerk_id text,
  estimated_hours numeric(6,2) check (estimated_hours >= 0),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table time_entries (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id),
  user_clerk_id text not null,
  hours numeric(5,2) not null check (hours > 0),
  entry_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_tasks_project on tasks(project_id) where deleted_at is null;
create index idx_entries_task on time_entries(task_id) where deleted_at is null;
create index idx_entries_user on time_entries(user_clerk_id) where deleted_at is null;

-- =============== HELPERS ===============

-- clerk_user_id del usuario autenticado (sub del JWT de Clerk)
create or replace function current_clerk_id() returns text
language sql stable as $$
  select coalesce(auth.jwt()->>'sub', '')
$$;

create or replace function is_admin() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from members
    where clerk_user_id = current_clerk_id() and role = 'admin'
  )
$$;

-- =============== RLS ===============

alter table members enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table time_entries enable row level security;

-- members: cada uno se lee a sí mismo; admin lee y gestiona todo
create policy members_select on members for select
  using (clerk_user_id = current_clerk_id() or is_admin());
create policy members_admin_write on members for all
  using (is_admin()) with check (is_admin());

-- projects: lectura para cualquier member; escritura solo admin
create policy projects_select on projects for select
  using (deleted_at is null and current_clerk_id() in (select clerk_user_id from members));
create policy projects_admin_write on projects for all
  using (is_admin()) with check (is_admin());

-- tasks: lectura para cualquier member; escritura solo admin
create policy tasks_select on tasks for select
  using (deleted_at is null and current_clerk_id() in (select clerk_user_id from members));
create policy tasks_admin_write on tasks for all
  using (is_admin()) with check (is_admin());

-- time_entries: dev gestiona SOLO las suyas; admin lee todas
create policy entries_select on time_entries for select
  using (deleted_at is null and (user_clerk_id = current_clerk_id() or is_admin()));
create policy entries_insert on time_entries for insert
  with check (user_clerk_id = current_clerk_id());
create policy entries_update on time_entries for update
  using (user_clerk_id = current_clerk_id())
  with check (user_clerk_id = current_clerk_id());

-- =============== VISTA DE DESVIACIÓN ===============

create or replace view task_hours_summary as
select
  t.id as task_id,
  t.project_id,
  t.title,
  t.estimated_hours,
  coalesce(sum(e.hours) filter (where e.deleted_at is null), 0) as actual_hours,
  coalesce(sum(e.hours) filter (where e.deleted_at is null), 0)
    - coalesce(t.estimated_hours, 0) as deviation_hours
from tasks t
left join time_entries e on e.task_id = t.id
where t.deleted_at is null
group by t.id;
