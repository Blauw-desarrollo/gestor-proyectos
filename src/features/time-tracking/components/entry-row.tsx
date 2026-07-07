"use client";

import { useState, useTransition } from "react";
import { deleteTimeEntry, updateTimeEntry } from "../actions";
import { toISODate } from "../date";
import type { AssignableTask, MyTimeEntry } from "../types";

export function EntryRow({
  entry,
  tasks,
}: {
  entry: MyTimeEntry;
  tasks: AssignableTask[];
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
      <tr className="border-b border-border">
        <td colSpan={5} className="px-4 py-2">
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
            className="flex flex-wrap items-start gap-2"
          >
            <select
              name="task_id"
              defaultValue={entry.task_id}
              required
              className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
            >
              {selectableTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.project?.name ? `${task.project.name} — ${task.title}` : task.title}
                </option>
              ))}
            </select>
            <input
              name="hours"
              type="number"
              min={0.5}
              max={24}
              step="0.5"
              defaultValue={entry.hours}
              required
              className="w-24 rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
            />
            <input
              name="entry_date"
              type="date"
              defaultValue={entry.entry_date}
              max={today}
              required
              className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
            />
            <input
              name="notes"
              defaultValue={entry.notes ?? ""}
              placeholder="Notas"
              className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
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

  return (
    <tr className="border-b border-border hover:bg-background">
      <td className="px-4 py-2 text-sm text-foreground/70">
        {new Date(entry.entry_date).toLocaleDateString("es-ES")}
      </td>
      <td className="px-4 py-2 text-sm font-medium text-foreground">
        {entry.task?.title ?? "—"}
      </td>
      <td className="px-4 py-2 text-sm text-foreground/70">{entry.hours}</td>
      <td className="px-4 py-2 text-sm text-foreground/70">
        {entry.notes ?? "—"}
      </td>
      <td className="px-4 py-2 text-right text-sm">
        <button
          onClick={() => setIsEditing(true)}
          className="mr-3 text-foreground/70 hover:text-brand"
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
          className="text-foreground/70 hover:text-red-600"
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
