# Prompt 02 — Proyectos y tareas

Lee `CLAUDE.md` y `docs/DATA_MODEL.md` antes de empezar. No modifiques `src/lib/`.

## Objetivo
CRUD de proyectos y tareas, solo para admin. Los devs ven en lectura.

## Tareas

1. **Feature `projects`** (`src/features/projects/`)
   - `queries.ts`: listar proyectos activos, obtener proyecto por id.
   - `actions.ts`: crear, editar, archivar (soft delete NO: archivar = status). Validación Zod. Solo admin (verificar con `isAdmin()` además del RLS).
   - `components/`: tabla de proyectos + formulario en modal o página.

2. **Feature `tasks`** (`src/features/tasks/`)
   - `queries.ts`: tareas por proyecto (excluyendo deleted_at), con datos de `task_hours_summary`.
   - `actions.ts`: crear, editar (incl. `estimated_hours` y `assignee_clerk_id`), soft delete. Solo admin.
   - `components/`: lista de tareas dentro de la página del proyecto, con columnas: título, estado, asignado, estimadas, reales, desviación (color rojo si desviación > 0).

3. **Rutas**
   - `/proyectos`: listado.
   - `/proyectos/[projectId]`: detalle con sus tareas.

## Criterios de aceptación
- `npm run build` y `npm run lint` pasan.
- Un dev NO ve botones de crear/editar (y las actions rechazan si lo intenta).
- La columna de desviación usa la vista `task_hours_summary`, no cálculo en JS.

Al terminar, lista ficheros creados/modificados y decisiones no especificadas.
