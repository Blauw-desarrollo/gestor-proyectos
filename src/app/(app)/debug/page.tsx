import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/roles";

// Página temporal de diagnóstico para el bug de "row-level security" al
// eliminar. Compara lo que Clerk cree que es tu identidad con lo que
// Postgres ve realmente a través del token. Borrar cuando esté resuelto.

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    const json = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default async function DebugPage() {
  const { userId, getToken } = await auth();
  const token = await getToken({ template: "supabase" });
  const payload = token ? decodeJwtPayload(token) : null;

  const supabase = await createSupabaseServerClient();
  const { data: currentClerkIdDb, error: currentClerkIdError } =
    await supabase.rpc("current_clerk_id");
  const { data: isAdminDb, error: isAdminError } = await supabase.rpc("is_admin");
  const admin = await isAdmin();

  const report = {
    clerk_user_id__desde_auth_sdk: userId,
    isAdmin__desde_la_app: admin,
    jwt_payload__decodificado: payload,
    current_clerk_id__desde_postgres: currentClerkIdDb,
    current_clerk_id__error: currentClerkIdError?.message ?? null,
    is_admin__desde_postgres: isAdminDb,
    is_admin__error: isAdminError?.message ?? null,
  };

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-semibold text-foreground">
        Diagnóstico de sesión (temporal)
      </h1>
      <p className="text-sm text-foreground/70">
        Copia todo este bloque y pégalo en el chat.
      </p>
      <pre className="overflow-auto rounded-md border border-border bg-surface p-4 text-xs text-foreground">
        {JSON.stringify(report, null, 2)}
      </pre>
    </div>
  );
}
