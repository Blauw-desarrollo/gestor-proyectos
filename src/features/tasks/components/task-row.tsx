"use client";

import { useState, useTransition } from "react";
import { deleteTask, updateTask } from "../actions";
import { TaskFormFields } from "./task-form-fields";
import {
  TASK_STATUS_LABELS,
  type Member,
  type TaskStatus,
  type TaskWithHours,
} from "../types";
import { TaskEntriesPanel } from "@/features/time-tracking/components/task-entries-panel";
import type { TaskTimeEntry } from "@/features/time-tracking/types";

export function TaskRow({
  task,
  projectId,
  members,
  isAdmin,
  entries,
}: {
  task: TaskWithHours;
  projectId: string;
  members: Member[];
  isAdmin: boolean;
  entries: TaskTimeEntry[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showEntries, setShowEntries] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const columnCount = isAdmin ? 7 : 6;

  if (isEditing) {
    return (
      <tr className="border-b border-border">
        <td colSpan={columnCount} className="px-4 py-2">
          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await updateTask(projectId, task.id, formData);
                if (result?.error) {
                  setError(result.error);
                } else {
                  setError(null);
                  setIsEditing(false);
                }
              });
            }}
            className="flex flex-wrap items-start gap-2"
          >
            <TaskFormFields
              members={members}
              defaults={{
                title: task.title,
                status: task.status as TaskStatus,
                assignee_clerk_id: task.assignee_clerk_id,
                estimated_hours: task.estimated_hours,
              }}
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsEditing(false);
              }}
              className="px-2 py-1.5 text-sm text-foreground/70 hover:text-foreground"
            >
              Cancelar
            </button>
            {error && <p className="w-full text-xs text-red-600">{error}</p>}
          </form>
        </td>
      </tr>
    );
  }

  const assignee = members.find(
    (member) => member.clerk_user_id === task.assignee_clerk_id
  );
  const hasDeviation = task.deviation_hours > 0;

  return (
    <>
    <tr className="border-b border-border hover:bg-background">
      <td className="px-4 py-2 text-sm font-medium text-foreground">
        {task.title}
      </td>
      <td className="px-4 py-2 text-sm text-foreground/70">
        {TASK_STATUS_LABELS[task.status as keyof typeof TASK_STATUS_LABELS] ??
          task.status}
      </td>
      <td className="px-4 py-2 text-sm text-foreground/70">
        {assignee?.display_name ?? assignee?.clerk_user_id ?? "Sin asignar"}
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
      {isAdmin && (
        <td className="px-4 py-2 text-right text-sm">
          <button
            onClick={() => setShowEntries((value) => !value)}
            className="mr-3 text-foreground/70 hover:text-brand"
          >
            {showEntries ? "Ocultar horas" : "Ver horas"}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="mr-3 text-foreground/70 hover:text-brand"
          >
            Editar
          </button>
          <button
            onClick={() => {
              if (confirm(`¿Eliminar la tarea "${task.title}"?`)) {
                startTransition(async () => {
                  await deleteTask(projectId, task.id);
                });
              }
            }}
            disabled={isPending}
            className="text-foreground/70 hover:text-red-600"
          >
            Eliminar
          </button>
        </td>
      )}
    </tr>
    {isAdmin && showEntries && (
      <tr className="border-b border-border bg-background">
        <td colSpan={columnCount} className="p-0">
          <TaskEntriesPanel entries={entries} members={members} />
        </td>
      </tr>
    )}
    </>
  );
}
