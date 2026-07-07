# Gestor de Proyectos — Starter Kit

## Orden de arranque

1. **Crear servicios**
   - Supabase: nuevo proyecto → SQL Editor → ejecutar `supabase/migrations/0001_initial.sql`.
   - Clerk: nueva app → crear JWT template llamado `supabase` → en Supabase,
     Settings → Authentication → Third-party Auth → añadir Clerk.
   - Insertar tu usuario admin (tras el primer login, o manualmente):
     `insert into members (clerk_user_id, display_name, role) values ('user_xxx', 'Gerard', 'admin');`

2. **Scaffold local**
   ```bash
   git init && chmod +x scripts/setup.sh && ./scripts/setup.sh
   # rellenar .env.local
   npm run db:types
   ```

3. **Vibe coding con Claude Code** (en orden, uno por sesión)
   ```bash
   claude "Lee y ejecuta prompts/01-scaffold-inicial.md"
   claude "Lee y ejecuta prompts/02-proyectos-tareas.md"
   claude "Lee y ejecuta prompts/03-imputacion-horas.md"
   ```
   Entre prompts: revisar el diff, probar en local, commit.

4. **Deploy en Vercel**
   - Subir repo a GitHub → importar en Vercel.
   - Copiar variables de `.env.local` (excepto `SUPABASE_SERVICE_ROLE_KEY` como
     NEXT_PUBLIC — esa solo como variable server-side si se usa).
   - En Clerk: añadir el dominio de producción de Vercel.

## Control del proyecto
- `CLAUDE.md` = reglas que Claude Code debe cumplir siempre.
- `docs/DATA_MODEL.md` = fuente de verdad del esquema. Cambio de BD ⇒ migración nueva + `npm run db:types`.
- `docs/DECISIONS.md` = registro de decisiones para no repetir debates.
