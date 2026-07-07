-- 0002_active_timers.sql
-- Cronómetro en tiempo real: un timer activo por usuario (no por tarea).
-- Al pararlo, la app crea una fila en time_entries con las horas
-- transcurridas y borra el timer. Un usuario solo puede tener un
-- cronómetro corriendo a la vez (constraint unique en user_clerk_id).

create table active_timers (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id),
  user_clerk_id text not null unique,
  started_at timestamptz not null default now()
);

create index idx_active_timers_task on active_timers(task_id);

alter table active_timers enable row level security;

-- select: el propio usuario ve su timer; admin ve todos (para depurar)
create policy active_timers_select on active_timers for select
  using (user_clerk_id = current_clerk_id() or is_admin());

-- insert/delete: solo el propio usuario gestiona su timer
create policy active_timers_insert on active_timers for insert
  with check (user_clerk_id = current_clerk_id());
create policy active_timers_delete on active_timers for delete
  using (user_clerk_id = current_clerk_id());
