import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { Database } from "@/types/database";
import { requireEnv } from "./env";

// cache() de React memoiza por request: sin esto, cada query.ts/actions.ts
// que llama a esta función pedía un token nuevo a Clerk y creaba un
// cliente nuevo, aunque fuera la 6ª vez en la misma carga de página.
export const createSupabaseServerClient = cache(async () => {
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });

  // Si no hay token, NUNCA seguir en silencio: eso manda la petición como
  // anónima y Supabase la rechaza con un críptico "row-level security
  // policy" en vez de decir claramente que falló la autenticación.
  if (!token) {
    throw new Error(
      "No se pudo verificar tu sesión con Supabase. Recarga la página e inténtalo de nuevo."
    );
  }

  return createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );
});
