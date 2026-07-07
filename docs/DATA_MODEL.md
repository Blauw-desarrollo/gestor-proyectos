# Modelo de datos (fuente de verdad)

Toda modificación aquí debe ir acompañada de una migración en `supabase/migrations/`.

## Tablas

### members
Vincula usuarios de Clerk con su rol en la app.
| campo | tipo | notas |
|---|---|---|
| id | uuid pk | default gen_random_uuid() |
| clerk_user_id | text unique not null | sub del JWT de Clerk |
| display_name | text | |
| role | text not null | 'admin' \| 'dev' |
| created_at | timestamptz | default now() |

### projects
| campo | tipo | notas |
|---|---|---|
| id | uuid pk | |
| name | text not null | |
| status | text not null | 'active' \| 'archived', default 'active' |
| created_by | text not null | clerk_user_id |
| created_at | timestamptz | |
| deleted_at | timestamptz null | soft delete |

### tasks
| campo | tipo | notas |
|---|---|---|
| id | uuid pk | |
| project_id | uuid fk → projects | |
| title | text not null | |
| description | text | |
| status | text not null | 'todo' \| 'in_progress' \| 'done', default 'todo' |
| assignee_clerk_id | text null | |
| estimated_hours | numeric(6,2) null | estimación única a nivel de tarea |
| created_at | timestamptz | |
| deleted_at | timestamptz null | soft delete |

### time_entries
Horas reales. Múltiples entradas por tarea y usuario.
| campo | tipo | notas |
|---|---|---|
| id | uuid pk | |
| task_id | uuid fk → tasks | |
| user_clerk_id | text not null | |
| hours | numeric(5,2) not null | > 0 |
| entry_date | date not null | default current_date |
| notes | text | |
| created_at | timestamptz | |
| deleted_at | timestamptz null | soft delete |

## Vistas

### task_hours_summary
Por tarea: `estimated_hours`, `sum(hours)` de entries no borradas, y desviación.
Base para el informe de desviación por proyecto.

## RLS (resumen)
- **members**: cada usuario lee su propia fila; admin lee todas. Escritura solo admin.
- **projects / tasks**: lectura para todo member; escritura solo admin (fase 1).
- **time_entries**: dev crea/edita/borra (soft) SOLO sus entradas; admin lee todas.

## Decisiones
- `estimated_hours` vive en `tasks` (se estima una vez); las horas reales son
  entradas múltiples en `time_entries`. No mezclar para conservar histórico.
- Identidad por `clerk_user_id` (text), sin FK a auth.users de Supabase.
