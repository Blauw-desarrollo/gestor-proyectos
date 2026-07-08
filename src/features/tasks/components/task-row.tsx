"use client";

import { useState } from "react";
import { TaskDetailModal } from "./task-detail-modal";
import {
  TASK_STATUS_LABELS,
  type Member,
  type TaskStatus,
  type TaskWithHours,
} from "../types";
import { TimerControl } from "@/features/time-tracking/components/timer-control";
import type { ActiveTimer } from "@/features/time-tracking/types";

function isOverdue(dueDate: string | null, status: string): boolean {
  if (!dueDate || status === "done") return false;
  return dueDate < new Date().toISOString().slice(0, 10);
}

export function TaskRow({
  task,
  projectId,
  members,
  isAdmin,
  currentUserId,
  activeTimer,
}: {
  task: TaskWithHours;
  projectId: string;
  members: Member[];
  isAdmin: boolean;
  currentUserId: string | null;
  activeTimer: ActiveTimer;
}) {
  const [open, setOpen] = useState(false);

  const assignee = members.find(
    (member) => member.clerk_user_id === task.assignee_clerk_id
  );
  const hasDeviation = task.deviation_hours > 0;
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <>
      <tr
        onClick={() => setOpen(true)}
        className="cursor-pointer border-b border-border hover:bg-white/5"
      >
        <td className="px-4 py-2 text-sm font-medium text-foreground">
          {task.title}
        </td>
        <td className="px-4 py-2 text-sm text-foreground/70">
          {TASK_STATUS_LABELS[task.status as TaskStatus] ?? task.status}
        </td>
        <td className="px-4 py-2 text-sm text-foreground/70">
          {assignee?.display_name ?? assignee?.clerk_user_id ?? "Sin asignar"}
        </td>
        <td
          className={`px-4 py-2 text-sm ${
            overdue ? "font-medium text-red-600" : "text-foreground/70"
          }`}
        >
          {task.due_date ?? "—"}
        </td>
        <td className="px-4 py-2 text-sm text-foreground/70">
          {task.estimated_hours ?? "—"}
        </td>
        <td className="px-4 py-2 text-sm text-foreground/70">
          {task.actual_hours}
        </td>
        <td
          className={`px-4 py-2 text-sm font-medium ${
            hasDeviation ? "text-red-600" : "text-foreground/70"
          }`}
        >
          {task.deviation_hours}
        </td>
        <td
          className="px-4 py-2 text-sm"
          onClick={(event) => event.stopPropagation()}
        >
          {task.assignee_clerk_id === currentUserId ? (
            <TimerControl
              taskId={task.id}
              projectId={projectId}
              activeTimer={activeTimer}
            />
          ) : (
            <span className="text-foreground/40">—</span>
          )}
        </td>
      </tr>
      <TaskDetailModal
        open={open}
        onClose={() => setOpen(false)}
        task={task}
        projectId={projectId}
        members={members}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
      />
    </>
  );
}
