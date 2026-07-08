-- 0003_due_dates_and_comments.sql
-- Fecha límite en tareas + comentarios por tarea.

alter table tasks add column due_date date;

create table task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id),
  author_clerk_id text not null,
  body text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_task_comments_task on task_comments(task_id) where deleted_at is null;

alter table task_comments enable row level security;

-- lectura: cualquier member (igual que tasks/projects)
create policy task_comments_select on task_comments for select
  using (deleted_at is null and current_clerk_id() in (select clerk_user_id from members));

-- insert: cualquier member, solo como sí mismo
create policy task_comments_insert on task_comments for insert
  with check (
    author_clerk_id = current_clerk_id()
    and current_clerk_id() in (select clerk_user_id from members)
  );

-- update (soft delete): el autor o un admin
create policy task_comments_update on task_comments for update
  using (author_clerk_id = current_clerk_id() or is_admin())
  with check (author_clerk_id = current_clerk_id() or is_admin());
