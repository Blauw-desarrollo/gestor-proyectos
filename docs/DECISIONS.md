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
