"use server";
import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import type { Database } from "@/types/database";

type Member = Database["public"]["Tables"]["members"]["Row"];

// Crea (o recupera) la fila en `members` para el usuario de Clerk autenticado.
// Usa el cliente de service_role porque RLS solo permite escritura a admins,
// y un usuario nuevo aún no es miembro de nada.
export async function ensureMemberExists(clerkUserId: string): Promise<Member> {
  const user = await currentUser();
  const supabase = createSupabaseServiceRoleClient();

  const { data, error } = await supabase
    .from("members")
    .upsert(
      {
        clerk_user_id: clerkUserId,
        display_name: user?.fullName ?? user?.username ?? null,
      },
      { onConflict: "clerk_user_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}
