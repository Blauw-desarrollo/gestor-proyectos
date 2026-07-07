"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toISODate } from "./date";

type ActionResult = { error?: string };

const entrySchema = z.object({
  task_id: z.string().trim().min(1, "Selecciona una tarea"),
  hours: z
    .number({ error: "Introduce las horas" })
    .gt(0, "Las horas deben ser mayores que 0")
    .max(24, "Como máximo 24 horas"),
  entry_date: z
    .string()
    .min(1, "Selecciona una fecha")
    .refine((value) => value <= toISODate(new Date()), {
      message: "La fecha no puede ser futura",
    }),
  notes: z.string().trim().max(2000).optional(),
});

function parseEntryForm(formData: FormData) {
  const hoursRaw = formData.get("hours");
  const notesRaw = formData.get("notes");

  return entrySchema.safeParse({
    task_id: formData.get("task_id"),
    hours: hoursRaw ? Number(hoursRaw) : undefined,
    entry_date: formData.get("entry_date"),
    notes:
      notesRaw && String(notesRaw).trim() !== "" ? String(notesRaw) : undefined,
  });
}

export async function createTimeEntry(formData: FormData): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "No hay usuario autenticado" };

  const parsed = parseEntryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("time_entries").insert({
    task_id: parsed.data.task_id,
    user_clerk_id: userId,
    hours: parsed.data.hours,
    entry_date: parsed.data.entry_date,
    notes: parsed.data.notes ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath("/horas");
  return {};
}

export async function updateTimeEntry(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "No hay usuario autenticado" };

  const parsed = parseEntryForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("time_entries")
    .update({
      task_id: parsed.data.task_id,
      hours: parsed.data.hours,
      entry_date: parsed.data.entry_date,
      notes: parsed.data.notes ?? null,
    })
    .eq("id", id)
    .eq("user_clerk_id", userId)
    .select();

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "No tienes permiso para editar esta entrada" };
  }

  revalidatePath("/horas");
  return {};
}

export async function deleteTimeEntry(id: string): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { error: "No hay usuario autenticado" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("time_entries")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_clerk_id", userId)
    .select();

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "No tienes permiso para eliminar esta entrada" };
  }

  revalidatePath("/horas");
  return {};
}
