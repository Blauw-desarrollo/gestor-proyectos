"use client";

import { useState, useTransition } from "react";
import { deleteTimeEntry, updateTimeEntry } from "../actions";
import { toISODate } from "../date";
import type { LoggableTask, MyTimeEntry } from "../types";

export function EntryCard({
  entry,
  tasks,
}: {
  entry: MyTimeEntry;
  tasks: LoggableTask[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const today = toISODate(new Date());

  const hasCurrentTask = tasks.some((task) => task.id === entry.task_id);
  const selectableTasks = hasCurrentTask
    ? tasks
    : [
        {
          id: entry.task_id,
          title: entry.task?.title ?? "Tarea",
          project: null,
        },
        ...tasks,
      ];

  if (isEditing) {
    return (
      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await updateTimeEntry(entry.id, formData);
            if (result?.error) {
              setError(result.error);
            } else {
              setError(null);
              setIsEditing(false);
            }
          });
        }}
        className="flex flex-col gap-2 rounded-md border border-border bg-surface p-2"
      >
        <select
          name="task_id"
          defaultValue={entry.task_id}
          required
          className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
        >
          {selectableTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.project?.name ? `${task.project.name} — ${task.title}` : task.title}
            </option>
          ))}
        </select>
        <input
          name="entry_date"
          type="date"
          defaultValue={entry.entry_date}
          max={today}
          required
          className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
        />
        <input
          name="hours"
          type="number"
          min={0.5}
          max={24}
          step="0.5"
          defaultValue={entry.hours}
          required
          className="w-full rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
        />
        <input
          name="notes"
          defaultValue={entry.notes ?? ""}
          placeholder="Notas"
          className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setIsEditing(false);
            }}
            className="text-xs text-foreground/70 hover:text-foreground"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-brand px-2 py-1 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-md border border-border bg-surface p-2 text-xs">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-foreground">
          {entry.task?.title ?? "—"}
        </span>
        <span className="whitespace-nowrap font-semibold text-brand">
          {entry.hours}h
        </span>
      </div>
      {entry.notes && (
        <p className="mt-1 text-foreground/60">{entry.notes}</p>
      )}
      <div className="mt-1 flex justify-end gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-foreground/50 hover:text-brand"
        >
          Editar
        </button>
        <button
          onClick={() => {
            if (confirm("¿Eliminar esta entrada?")) {
              startTransition(async () => {
                await deleteTimeEntry(entry.id);
              });
            }
          }}
          disabled={isPending}
          className="text-foreground/50 hover:text-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
