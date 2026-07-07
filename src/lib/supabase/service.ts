import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { requireEnv } from "./env";

// Cliente con service_role: salta RLS. Uso restringido a operaciones de
// bootstrap de identidad (crear el `member` la primera vez que un usuario
// de Clerk inicia sesión), nunca para queries de features.
export function createSupabaseServiceRoleClient() {
  return createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY")
  );
}
