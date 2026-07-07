import "server-only";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getWeekRange, toISODate } from "./date";
import type { TaskTimeEntry } from "./types";

export async function getMyEntriesForWeek(reference: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("No hay usuario autenticado");

  const { start, end } = getWeekRange(reference);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("time_entries")
    .select("id, task_id, hours, entry_date, notes, task:tasks(title)")
    .eq("user_clerk_id", userId)
    .is("deleted_at", null)
    .gte("entry_date", toISODate(start))
    .lte("entry_date", toISODate(end))
    .order("entry_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getMyAssignableTasks() {
  const { userId } = await auth();
  if (!userId) throw new Error("No hay usuario autenticado");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, project:projects(name)")
    .eq("assignee_clerk_id", userId)
    .neq("status", "done")
    .is("deleted_at", null)
    .order("title", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getActiveTimer() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("active_timers")
    .select("id, task_id, started_at, task:tasks(title)")
    .eq("user_clerk_id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getEntriesGroupedByTask(
  taskIds: string[]
): Promise<Record<string, TaskTimeEntry[]>> {
  if (taskIds.length === 0) return {};

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("time_entries")
    .select("id, task_id, user_clerk_id, hours, entry_date, notes")
    .in("task_id", taskIds)
    .is("deleted_at", null)
    .order("entry_date", { ascending: false });

  if (error) throw error;

  const grouped: Record<string, TaskTimeEntry[]> = {};
  for (const entry of data ?? []) {
    (grouped[entry.task_id] ??= []).push(entry);
  }
  return grouped;
}
