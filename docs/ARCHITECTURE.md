# Arquitectura

## Visión
Gestor de proyectos que crecerá por fases. Fase 1: proyectos, tareas e imputación
de horas (estimadas vs reales). El diseño debe permitir añadir capacidades sin
reorganizar lo existente.

## Estructura de carpetas

```
src/
├── app/                      # Rutas Next.js (App Router). Solo composición.
│   ├── (auth)/               # sign-in (Clerk). Sin auto-registro: el admin
│   │                          # da de alta a los usuarios desde Clerk.
│   ├── (app)/                # Rutas protegidas por proxy.ts
│   │   ├── proyectos/
│   │   │   └── [projectId]/
│   │   └── horas/            # Vista de imputación del dev
│   └── layout.tsx
├── proxy.ts                  # Protección Clerk (antes "middleware.ts";
│                              # renombrado en Next.js 16, mismo propósito)
├── features/
│   ├── projects/             # CRUD proyectos
│   ├── tasks/                # CRUD tareas + asignación
│   └── time-tracking/        # Imputación horas + resumen desviación
│       ├── components/
│       ├── actions.ts        # Server Actions (mutaciones)
│       ├── queries.ts        # Lecturas
│       └── types.ts
├── lib/
│   ├── supabase/
│   │   ├── server.ts         # Cliente server-side (con JWT de Clerk)
│   │   └── client.ts         # Cliente browser (si se necesita)
│   └── auth/
│       └── roles.ts          # Helpers de rol (isAdmin, etc.)
└── types/
    └── database.ts           # GENERADO — no editar a mano
```

## Flujo de datos
1. Usuario autentica con Clerk.
2. Server Component / Server Action obtiene token Clerk y crea cliente Supabase con ese JWT.
3. Supabase aplica RLS usando `auth.jwt()->>'sub'` (= clerk_user_id).
4. Mutaciones: Server Action → validación Zod → Supabase → revalidatePath.

## Integración Clerk ↔ Supabase
- En Clerk: crear JWT template llamado `supabase` (ver docs Clerk).
- En Supabase: configurar Clerk como third-party auth provider.
- Las policies RLS usan `(auth.jwt()->>'sub')` para comparar con `clerk_user_id`.

## Reglas de crecimiento
- Nueva capacidad = nueva carpeta en `features/`, nunca engordar una existente.
- Compartir código entre features → extraer a `lib/` solo tras aprobación.

## Deploy (Vercel)
- Repo GitHub conectado a Vercel, deploy automático en push a `main`.
- Variables de entorno en Vercel = las de `.env.example`.
- Preview deployments por PR para revisar antes de mergear.
