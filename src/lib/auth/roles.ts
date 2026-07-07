import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureMemberExists } from "./member-bootstrap";
import type { Database } from "@/types/database";

type Member = Database["public"]["Tables"]["members"]["Row"];

export async function getCurrentMember(): Promise<Member> {
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
}

export async function isAdmin(): Promise<boolean> {
  const member = await getCurrentMember();
  return member.role === "admin";
}
