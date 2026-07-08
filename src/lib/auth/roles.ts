import "server-only";
import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureMemberExists } from "./member-bootstrap";
import type { Database } from "@/types/database";

type Member = Database["public"]["Tables"]["members"]["Row"];

// cache() de React: el layout de (app) y cada isAdmin() de cada página
// llamaban esto por separado en la misma request. Memoizado por request,
// solo se consulta members una vez.
export const getCurrentMember = cache(async (): Promise<Member> => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("No hay usuario autenticado");
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("members")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (data) return data;

  return ensureMemberExists(userId);
});

export async function isAdmin(): Promise<boolean> {
  const member = await getCurrentMember();
  return member.role === "admin";
}
