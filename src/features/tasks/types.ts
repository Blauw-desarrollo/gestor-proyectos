import type { Database } from "@/types/database";

export type TaskStatus = "todo" | "in_progress" | "done";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Por hacer",
  in_progress: "En progreso",
  done: "Hecho",
};

export type Member = Pick<
  Database["public"]["Tables"]["members"]["Row"],
  "clerk_user_id" | "display_name"
>;

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];

export type TaskWithHours = Pick<
  TaskRow,
  | "id"
  | "title"
  | "status"
  | "assignee_clerk_id"
  | "estimated_hours"
  | "due_date"
  | "created_at"
> & {
  actual_hours: number;
  deviation_hours: number;
};

export type TaskComment = Pick<
  Database["public"]["Tables"]["task_comments"]["Row"],
  "id" | "task_id" | "author_clerk_id" | "body" | "created_at"
>;
