#!/usr/bin/env bash
# Setup inicial del proyecto. Ejecutar UNA vez desde la raíz del repo.
set -euo pipefail

echo "==> Creando app Next.js..."
npx create-next-app@latest . \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack --yes

echo "==> Instalando dependencias..."
npm install @clerk/nextjs @supabase/supabase-js zod
npm install -D supabase

echo "==> Añadiendo scripts a package.json..."
npm pkg set scripts.db:types="supabase gen types typescript --project-id \$SUPABASE_PROJECT_ID --schema public > src/types/database.ts"

echo "==> Creando estructura de carpetas..."
mkdir -p src/features/{projects,tasks,time-tracking}/{components} \
         src/lib/{supabase,auth} \
         src/types

cp .env.example .env.local 2>/dev/null || true

echo ""
echo "Setup completo. Siguientes pasos:"
echo "  1. Rellena .env.local con tus claves de Clerk y Supabase"
echo "  2. Aplica supabase/migrations/0001_initial.sql en el SQL Editor de Supabase"
echo "  3. Configura el JWT template 'supabase' en Clerk (ver docs/ARCHITECTURE.md)"
echo "  4. npm run db:types"
echo "  5. Lanza Claude Code y pásale prompts/01-scaffold-inicial.md"
