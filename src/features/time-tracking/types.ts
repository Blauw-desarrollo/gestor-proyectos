import type { Database } from "@/types/database";
import type {
  getMyEntriesForWeek,
  getLoggableTasks,
  getActiveTimer,
} from "./queries";

export type MyTimeEntry = Awaited<ReturnType<typeof getMyEntriesForWeek>>[number];
export type LoggableTask = Awaited<ReturnType<typeof getLoggableTasks>>[number];
export type ActiveTimer = Awaited<ReturnType<typeof getActiveTimer>>;

export type TaskTimeEntry = Pick<
  Database["public"]["Tables"]["time_entries"]["Row"],
  "id" | "task_id" | "user_clerk_id" | "hours" | "entry_date" | "notes"
>;
