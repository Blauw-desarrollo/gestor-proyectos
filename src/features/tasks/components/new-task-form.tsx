"use client";

import { useState, useTransition } from "react";
import { createTask } from "../actions";
import { TaskFormFields } from "./task-form-fields";
import type { Member } from "../types";

export function NewTaskForm({
  projectId,
  members,
}: {
  projectId: string;
  members: Member[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        + Nueva tarea
      </button>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await createTask(projectId, formData);
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
      <TaskFormFields members={members} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        Crear
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
