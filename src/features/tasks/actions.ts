"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/roles";

type ActionResult = { error?: string };

const taskSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio"),
  status: z.enum(["todo", "in_progress", "done"]),
  assignee_clerk_id: z.string().trim().min(1).nullable(),
  estimated_hours: z.number().min(0).nullable(),
});

function parseTaskForm(formData: FormData) {
  const assignee = formData.get("assignee_clerk_id");
  const hoursRaw = formData.get("estimated_hours");

  return taskSchema.safeParse({
    title: formData.get("title"),
    status: formData.get("status"),
    assignee_clerk_id:
      assignee && String(assignee).trim() !== "" ? String(assignee) : null,
    estimated_hours:
      hoursRaw && String(hoursRaw).trim() !== "" ? Number(hoursRaw) : null,
  });
}

export async function createTask(
  projectId: string,
  formData: FormData
): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { error: "No tienes permisos para crear tareas" };
  }

  const parsed = parseTaskForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("tasks")
    .insert({ project_id: projectId, ...parsed.data });

  if (error) return { error: error.message };

  revalidatePath(`/proyectos/${projectId}`);
  return {};
}

export async function updateTask(
  projectId: string,
  taskId: string,
  formData: FormData
): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { error: "No tienes permisos para editar tareas" };
  }

  const parsed = parseTaskForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("tasks")
    .update(parsed.data)
    .eq("id", taskId);

  if (error) return { error: error.message };

  revalidatePath(`/proyectos/${projectId}`);
  return {};
}

export async function deleteTask(
  projectId: string,
  taskId: string
): Promise<ActionResult> {
  if (!(await isAdmin())) {
    return { error: "No tienes permisos para eliminar tareas" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", taskId);

  if (error) return { error: error.message };

  revalidatePath(`/proyectos/${projectId}`);
  return {};
}
