import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Member, TaskStatus, TaskWithHours } from "./types";

export async function getProjectTasks(
  projectId: string,
  filters?: { search?: string; status?: TaskStatus }
): Promise<TaskWithHours[]> {
  const supabase = await createSupabaseServerClient();

  let tasksQuery = supabase
    .from("tasks")
    .select(
      "id, title, status, assignee_clerk_id, estimated_hours, due_date, created_at"
    )
    .eq("project_id", projectId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (filters?.search && filters.search.trim() !== "") {
    tasksQuery = tasksQuery.ilike("title", `%${filters.search.trim()}%`);
  }
  if (filters?.status) {
    tasksQuery = tasksQuery.eq("status", filters.status);
  }

  const [{ data: tasks, error: tasksError }, { data: summaries, error: summaryError }] =
    await Promise.all([
      tasksQuery,
      supabase
        .from("task_hours_summary")
        .select("task_id, actual_hours, deviation_hours")
        .eq("project_id", projectId),
    ]);

  if (tasksError) throw tasksError;
  if (summaryError) throw summaryError;

  const summaryByTaskId = new Map(
    (summaries ?? []).map((summary) => [summary.task_id, summary])
  );

  return (tasks ?? []).map((task) => ({
    ...task,
    actual_hours: summaryByTaskId.get(task.id)?.actual_hours ?? 0,
    deviation_hours: summaryByTaskId.get(task.id)?.deviation_hours ?? 0,
  }));
}

export async function getMembers(): Promise<Member[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("members")
    .select("clerk_user_id, display_name")
    .order("display_name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
