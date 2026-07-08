"use client";

import { useState, useTransition } from "react";
import { createTimeEntry } from "../actions";
import { toISODate } from "../date";

export function AddHoursForm({
  taskId,
  projectId,
  onLogged,
}: {
  taskId: string;
  projectId: string;
  onLogged?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const today = toISODate(new Date());
  const formId = `add-hours-${taskId}`;

  return (
    <form
      id={formId}
      action={(formData) => {
        startTransition(async () => {
          const result = await createTimeEntry(formData, projectId);
          if (result?.error) {
            setError(result.error);
          } else {
            setError(null);
            (document.getElementById(formId) as HTMLFormElement | null)?.reset();
            onLogged?.();
          }
        });
      }}
      className="flex flex-wrap items-end gap-2"
    >
      <input type="hidden" name="task_id" value={taskId} />
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-foreground/60">Horas</span>
        <input
          name="hours"
          type="number"
          min={0.5}
          max={24}
          step="0.5"
          required
          className="w-24 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-foreground/60">Fecha</span>
        <input
          name="entry_date"
          type="date"
          defaultValue={today}
          max={today}
          required
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-foreground/60">Notas</span>
        <input
          name="notes"
          placeholder="Opcional"
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        Imputar
      </button>
      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </form>
  );
}
