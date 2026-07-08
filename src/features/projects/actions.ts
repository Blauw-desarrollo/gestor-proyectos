"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/roles";

type ActionResult = { error?: string };

const projectSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
});

export async function createProject(formData: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { error: "No tienes permisos para crear proyectos" };
  }

  const parsed = projectSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userId } = await auth();
  if (!userId) {
    return { error: "No hay usuario autenticado" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .insert({ name: parsed.data.name, created_by: userId });

  if (error) return { error: error.message };

  revalidatePath("/proyectos");
  return {};
}

export async function updateProject(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { error: "No tienes permisos para editar proyectos" };
  }

  const parsed = projectSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({ name: parsed.data.name })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/proyectos");
  revalidatePath(`/proyectos/${id}`);
  return {};
}

export async function archiveProject(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { error: "No tienes permisos para archivar proyectos" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/proyectos");
  return {};
}

export async function unarchiveProject(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { error: "No tienes permisos para reactivar proyectos" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({ status: "active" })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/proyectos");
  return {};
}

export async function deleteProject(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { error: "No tienes permisos para eliminar proyectos" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/proyectos");
  return {};
}
