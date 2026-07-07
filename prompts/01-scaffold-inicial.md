# Prompt 01 — Scaffold inicial

Lee primero `CLAUDE.md`, `docs/ARCHITECTURE.md` y `docs/DATA_MODEL.md`. Cúmplelos estrictamente.

## Objetivo
Montar la base funcional de la app: auth con Clerk, puente a Supabase, layout y navegación.

## Tareas

1. **Auth**
   - Configura `ClerkProvider` en el layout raíz y `middleware.ts` protegiendo el grupo `(app)`.
   - Páginas `/sign-in` y `/sign-up` con los componentes de Clerk, textos en español.

2. **Puente Clerk → Supabase** en `src/lib/supabase/server.ts`
   - Función `createSupabaseServerClient()` que obtiene el token de Clerk
     (`auth().getToken({ template: 'supabase' })`) y crea el cliente con ese JWT
     en el header Authorization.
   - Tipado con `Database` de `src/types/database.ts`.

3. **Helper de roles** en `src/lib/auth/roles.ts`
   - `getCurrentMember()`: busca en `members` por clerk_user_id; si no existe, lo
     crea con role 'dev' (upsert vía service role en Server Action dedicada).
   - `isAdmin()`.

4. **Layout de app** en `(app)`
   - Sidebar simple: Proyectos, Mis horas. UserButton de Clerk arriba a la derecha.
   - Página de inicio que redirige a `/proyectos`.

## Criterios de aceptación
- `npm run build` pasa sin errores ni warnings de tipos.
- Usuario no autenticado → redirigido a /sign-in.
- Usuario autenticado nuevo → aparece en `members` con role 'dev'.
- NO implementes todavía CRUD de proyectos ni imputación de horas.

Al terminar, lista los ficheros creados y cualquier decisión que hayas tomado
que no estuviera especificada.
