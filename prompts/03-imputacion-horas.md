# Prompt 03 — Imputación de horas

Lee `CLAUDE.md` y `docs/DATA_MODEL.md`. No modifiques `src/lib/` ni features existentes salvo lo indicado.

## Objetivo
Que un dev impute horas reales a tareas asignadas y vea su histórico.

## Tareas

1. **Feature `time-tracking`** (`src/features/time-tracking/`)
   - `queries.ts`:
     - Entradas del usuario actual (filtrables por semana).
     - Tareas asignadas al usuario actual (status != 'done') para el selector.
   - `actions.ts`: crear entrada (task_id, hours, entry_date, notes), editar y
     soft-delete SOLO de entradas propias. Zod: hours > 0 y <= 24, entry_date no futura.
   - `components/`:
     - Formulario rápido de imputación (selector de tarea, horas, fecha, notas).
     - Tabla semanal de entradas propias con total y navegación semana anterior/siguiente.

2. **Ruta `/horas`**: formulario + tabla semanal.

3. **Integración en detalle de tarea**: en `/proyectos/[projectId]`, al expandir
   una tarea el admin ve las entradas de todos (usa RLS: la query es la misma,
   el admin simplemente ve más filas).

## Criterios de aceptación
- `npm run build` y `npm run lint` pasan.
- Un dev no puede editar entradas de otro (probado: la action rechaza y RLS bloquea).
- El total semanal cuadra con la suma de la tabla.

Al terminar, lista ficheros creados/modificados y decisiones no especificadas.
