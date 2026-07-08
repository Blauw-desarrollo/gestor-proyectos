# Gestor de Proyectos — Reglas del Proyecto

## Contexto
Gestor de proyectos para equipos de desarrollo. Fase actual: imputación de horas
estimadas y reales a tareas. Stack: Next.js 16 (App Router) + React 19 + TypeScript
+ Clerk (auth) + Supabase (BD) + Tailwind v4. Deploy en Vercel.

Identidad de marca: Blauw Labs. Tema claro con glassmorphism (fondo beige
`#EFE9D8` con degradado radial suave, tarjetas `surface` casi blancas
translúcidas con `backdrop-blur`), azul de marca `#003CE5` (fijo), texto
oscuro `#2B2419`. Logo en dos variantes: `blauw-labs-logo.svg` (texto oscuro,
la que se usa en la app sobre el fondo claro) y `blauw-labs-logo-light.svg`
(texto claro, por si se necesita algún fondo oscuro puntual). Assets en
`public/brand/` (uso en la app) y `docs/brand/` (referencia, no servido
públicamente). Tokens de color en `src/app/globals.css` (`@theme inline`):
`background`, `foreground`, `brand`, `surface`, `border`. Los contenedores
"de cristal" (tablas, modales, sidebar) usan `bg-surface/70` o `/80` +
`backdrop-blur-xl`; los inputs y botones sólidos usan `bg-surface` sin
opacidad.

## Reglas NO negociables

### Arquitectura
- Toda lógica de negocio vive en `src/features/<dominio>/`. Las rutas en `src/app/` solo componen.
- `src/lib/` es infraestructura compartida (supabase, auth). NO modificar sin proponerlo antes y esperar aprobación.
- Un feature = carpeta con `components/`, `hooks/`, `queries.ts`, `types.ts`.
- No crear abstracciones "por si acaso". Duplicar 2 veces está bien; abstraer a la 3ª.

### Base de datos
- TODO cambio de esquema es una migración SQL en `supabase/migrations/` con nombre `NNNN_descripcion.sql`.
- NUNCA cambios manuales en el dashboard de Supabase.
- Tras cada migración aplicada: `npm run db:types` para regenerar tipos.
- Los tipos de BD se importan de `src/types/database.ts` (generado). NUNCA escribir tipos de tablas a mano.
- RLS activado en todas las tablas. Toda tabla nueva lleva sus policies en la misma migración.
- Borrado lógico: usar `deleted_at`, nunca `DELETE` en tasks ni time_entries.

### Auth
- Clerk es la única fuente de identidad. En BD los usuarios se referencian por `clerk_user_id` (text).
- El puente Clerk→Supabase va por JWT (`src/lib/auth/`). No tocar sin consultar.
- Roles: `admin` y `dev`, en tabla `members`. Los checks de rol van en RLS Y en la UI.

### Código
- TypeScript estricto. Prohibido `any` (usar `unknown` + narrowing si hace falta).
- Server Components por defecto; `"use client"` solo cuando hay interactividad real.
- Mutaciones vía Server Actions en `features/<dominio>/actions.ts`, con validación Zod.
- Textos de UI en español.

### Flujo de trabajo
- Antes de implementar: leer `docs/ARCHITECTURE.md` y `docs/DATA_MODEL.md`.
- Si una tarea requiere cambiar el modelo de datos: proponer la migración primero, implementar después de aprobación.
- Decisiones de diseño relevantes → añadir entrada en `docs/DECISIONS.md` (fecha, decisión, motivo).
- Al terminar una feature: verificar que `npm run build` y `npm run lint` pasan.

## Comandos
- `npm run dev` — desarrollo local
- `npm run build` — build de producción (verificar antes de dar por terminado)
- `npm run lint` — linting
- `npm run db:types` — regenerar tipos desde Supabase
