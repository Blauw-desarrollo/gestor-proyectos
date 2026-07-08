"use client";

import { useRef, useState, useTransition } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        + Nueva tarea
      </button>
      <dialog
        ref={dialogRef}
        onClose={() => setError(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-full max-w-md rounded-lg border border-border bg-surface/80 p-6 shadow-2xl backdrop-blur-xl backdrop:bg-black/60"
      >
        <div className="flex items-start justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Nueva tarea
          </h2>
          <button
            onClick={() => dialogRef.current?.close()}
            aria-label="Cerrar"
            className="text-foreground/50 hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await createTask(projectId, formData);
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
          <TaskFormFields members={members} />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="mt-1 flex justify-end gap-2">
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
