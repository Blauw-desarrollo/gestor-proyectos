"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/roles";

type ActionResult = { error?: string };

const taskSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio"),
  status: z.enum(["todo", "in_progress", "done"]),
  assignee_clerk_id: z.string().trim().min(1).nullable(),
  estimated_hours: z.number().min(0).nullable(),
  due_date: z.string().min(1).nullable(),
});

function parseTaskForm(formData: FormData) {
  const assignee = formData.get("assignee_clerk_id");
  const hoursRaw = formData.get("estimated_hours");
  const dueDateRaw = formData.get("due_date");

  return taskSchema.safeParse({
    title: formData.get("title"),
    status: formData.get("status"),
    assignee_clerk_id:
      assignee && String(assignee).trim() !== "" ? String(assignee) : null,
    estimated_hours:
      hoursRaw && String(hoursRaw).trim() !== "" ? Number(hoursRaw) : null,
    due_date:
      dueDateRaw && String(dueDateRaw).trim() !== "" ? String(dueDateRaw) : null,
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

const commentSchema = z.object({
  body: z.string().trim().min(1, "Escribe algo antes de comentar").max(4000),
});

// Lectura bajo demanda (el modal de tarea la llama al abrirse). Va aquí
// porque solo un "use server" puede invocarse desde un componente cliente;
// evita precargar comentarios de tareas que nadie va a abrir.
export async function getTaskComments(taskId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("task_comments")
    .select("id, task_id, author_clerk_id, body, created_at")
    .eq("task_id", taskId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function addComment(
  projectId: string,
  taskId: string,
  formData: FormData
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "No hay usuario autenticado" };

  const parsed = commentSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("task_comments").insert({
    task_id: taskId,
    author_clerk_id: userId,
    body: parsed.data.body,
  });

  if (error) return { error: error.message };

  revalidatePath(`/proyectos/${projectId}`);
  return {};
}

export async function deleteComment(
  projectId: string,
  commentId: string
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "No hay usuario autenticado" };

  const admin = await isAdmin();
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("task_comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", commentId);

  if (!admin) query = query.eq("author_clerk_id", userId);

  const { data, error } = await query.select();

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "No tienes permiso para borrar este comentario" };
  }

  revalidatePath(`/proyectos/${projectId}`);
  return {};
}
