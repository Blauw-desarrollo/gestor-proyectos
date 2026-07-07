"use client";

import { useRef, useState, useTransition } from "react";
import { createProject } from "../actions";

export function NewProjectForm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        + Nuevo proyecto
      </button>
      <dialog
        ref={dialogRef}
        onClose={() => setError(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-full max-w-sm rounded-lg border border-border bg-surface p-6 shadow-lg backdrop:bg-foreground/30"
      >
        <h2 className="text-base font-semibold text-foreground">
          Nuevo proyecto
        </h2>
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await createProject(formData);
              if (result?.error) {
                setError(result.error);
              } else {
                setError(null);
                dialogRef.current?.close();
              }
            });
          }}
          className="mt-4 flex flex-col gap-3"
        >
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-foreground/60">
              Nombre
            </span>
            <input
              name="name"
              placeholder="Nombre del proyecto"
              required
              autoFocus
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-md px-4 py-2 text-sm text-foreground/70 hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              Crear
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
