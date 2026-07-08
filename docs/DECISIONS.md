# Log de decisiones

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-07-02 | Clerk como auth, Supabase solo como BD | Mejor DX de auth; evita acoplar identidad a Supabase Auth |
| 2026-07-02 | `estimated_hours` en tasks, horas reales en `time_entries` | Conservar histórico y permitir múltiples imputaciones |
| 2026-07-02 | Soft delete en tasks y time_entries | Nunca perder horas imputadas |
| 2026-07-02 | Roles admin/dev desde día 1 | Cambiar RLS después es caro |
| 2026-07-02 | Next.js 16 + React 19 + Tailwind v4 (en vez de Next 14 como decía CLAUDE.md) | `create-next-app@latest` instala 16 por defecto; se prefiere ir con la última versión soportada antes de escribir código y evitar deuda técnica desde el día 1 |
| 2026-07-02 | Identidad visual Blauw Labs: fondo beige `#E7E4DD`, azul `#003CE5`, texto `#231F20` | Coherencia con la marca de la empresa (logo y firma aportados por el usuario) |
| 2026-07-02 | `middleware.ts` → `proxy.ts` en la raíz de `src/` (no dentro de `app/`) | Next.js 16 renombra la convención "Middleware" a "Proxy" (mismo comportamiento); además `middleware.ts` nunca fue válido dentro de `app/`, el diagrama original de ARCHITECTURE.md tenía un error de indentación |
| 2026-07-02 | Bootstrap del `member` (upsert con service role) en `src/lib/auth/member-bootstrap.ts`, no en `features/*/actions.ts` | Es infraestructura de identidad compartida por todas las features, no lógica de un dominio concreto; se marcó con `'use server'` igualmente por ser la Server Action que hace la escritura |
| 2026-07-02 | Auto-registro (`/sign-up`) deshabilitado; el admin da de alta a los usuarios directamente en Clerk | Decisión del usuario: no es una app pública, el equipo es cerrado. Se eliminó la ruta `/sign-up` del código y `NEXT_PUBLIC_CLERK_SIGN_UP_URL` del `.env` |
| 2026-07-02 | Cronómetro en tiempo real: un timer activo por usuario (no por tarea), tabla `active_timers` nueva (migración 0002) | El usuario pidió poder "empezar contador de tiempo real" en las tareas; se optó por un único timer por usuario (como Toggl) en vez de varios simultáneos, para no complicar la UI ni el modelo. Al parar, se genera una fila en `time_entries` con las horas transcurridas |
| 2026-07-02 | Eliminar proyecto usa `deleted_at` (ya existía en el esquema), no `DELETE` | Coherente con el borrado lógico del resto de la app; nunca se pierde histórico |
| 2026-07-02 | Detalle/edición de tarea pasa de fila-que-se-convierte-en-formulario a modal único (con comentarios y horas dentro) | El usuario reportó que la tabla de tareas "se veía sucia"; consolidar todo en un modal (como el de nuevo proyecto) es más legible y deja sitio para fecha límite y comentarios |
| 2026-07-02 | `due_date` en `tasks` + tabla `task_comments` nueva (migración 0003) | Extras pedidos explícitamente por el usuario para el gestor de proyectos |
