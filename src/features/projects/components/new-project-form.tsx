"use client";

import { useState, useTransition } from "react";
import { createProject } from "../actions";

export function NewProjectForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        + Nuevo proyecto
      </button>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await createProject(formData);
          if (result?.error) {
            setError(result.error);
          } else {
            setError(null);
            setOpen(false);
          }
        });
      }}
      className="flex items-start gap-2"
    >
      <div>
        <input
          name="name"
          placeholder="Nombre del proyecto"
          required
          autoFocus
          className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground"
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        Crear
      </button>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(false);
        }}
        className="rounded-full px-4 py-2 text-sm text-foreground/70 hover:text-foreground"
      >
        Cancelar
      </button>
    </form>
  );
}
