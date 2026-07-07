import type { Database } from "@/types/database";
import type { getMyEntriesForWeek, getMyAssignableTasks } from "./queries";

export type MyTimeEntry = Awaited<ReturnType<typeof getMyEntriesForWeek>>[number];
export type AssignableTask = Awaited<ReturnType<typeof getMyAssignableTasks>>[number];

export type TaskTimeEntry = Pick<
  Database["public"]["Tables"]["time_entries"]["Row"],
  "id" | "task_id" | "user_clerk_id" | "hours" | "entry_date" | "notes"
>;
