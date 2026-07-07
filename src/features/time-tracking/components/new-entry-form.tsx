"use client";

import { useState, useTransition } from "react";
import { createTimeEntry } from "../actions";
import { toISODate } from "../date";
import type { AssignableTask } from "../types";

export function NewEntryForm({ tasks }: { tasks: AssignableTask[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const today = toISODate(new Date());

  if (tasks.length === 0) {
    return (
      <p className="text-sm text-foreground/70">
        No tienes tareas asignadas para imputar horas.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        + Imputar horas
      </button>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await createTimeEntry(formData);
          if (result?.error) {
            setError(result.error);
          } else {
            setError(null);
            setOpen(false);
          }
        });
      }}
      className="flex flex-wrap items-start gap-2"
    >
      <select
        name="task_id"
        required
        className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
      >
        {tasks.map((task) => (
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
        placeholder="Horas"
        required
        className="w-24 rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
      />
      <input
        name="entry_date"
        type="date"
        defaultValue={today}
        max={today}
        required
        className="rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
      />
      <input
        name="notes"
        placeholder="Notas (opcional)"
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
          setOpen(false);
        }}
        className="px-2 py-1.5 text-sm text-foreground/70 hover:text-foreground"
      >
        Cancelar
      </button>
      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </form>
  );
}
