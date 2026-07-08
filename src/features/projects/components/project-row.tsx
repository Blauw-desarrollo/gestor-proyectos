"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  archiveProject,
  deleteProject,
  unarchiveProject,
  updateProject,
} from "../actions";
import type { Project } from "../types";

export function ProjectRow({
  project,
  isAdmin,
}: {
  project: Project;
  isAdmin: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (isEditing) {
    return (
      <tr className="border-b border-border">
        <td colSpan={isAdmin ? 3 : 2} className="px-4 py-2">
          <form
            action={(formData) => {
              startTransition(async () => {
                const result = await updateProject(project.id, formData);
                if (result?.error) {
                  setError(result.error);
                } else {
                  setError(null);
                  setIsEditing(false);
                }
              });
            }}
            className="flex items-center gap-2"
          >
            <input
              name="name"
              defaultValue={project.name}
              required
              autoFocus
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setIsEditing(false);
              }}
              className="text-sm text-foreground/70 hover:text-foreground"
            >
              Cancelar
            </button>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border hover:bg-white/5">
      <td className="px-4 py-2 text-sm">
        <Link
          href={`/proyectos/${project.id}`}
          className="font-medium text-foreground hover:text-brand"
        >
          {project.name}
        </Link>
      </td>
      <td className="px-4 py-2 text-sm text-foreground/70">
        {new Date(project.created_at).toLocaleDateString("es-ES")}
      </td>
      {isAdmin && (
        <td className="px-4 py-2 text-right text-sm">
          <button
            onClick={() => setIsEditing(true)}
            className="mr-3 text-foreground/70 hover:text-brand"
          >
            Editar
          </button>
          {project.status === "active" ? (
            <button
              onClick={() => {
                if (confirm(`¿Archivar "${project.name}"?`)) {
                  startTransition(async () => {
                    await archiveProject(project.id);
                  });
                }
              }}
              disabled={isPending}
              className="mr-3 text-foreground/70 hover:text-brand"
            >
              Archivar
            </button>
          ) : (
            <button
              onClick={() => {
                startTransition(async () => {
                  await unarchiveProject(project.id);
                });
              }}
              disabled={isPending}
              className="mr-3 text-foreground/70 hover:text-brand"
            >
              Reactivar
            </button>
          )}
          <button
            onClick={() => {
              if (
                confirm(
                  `¿Eliminar "${project.name}"? Sus tareas y horas dejarán de verse en la app.`
                )
              ) {
                startTransition(async () => {
                  await deleteProject(project.id);
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
  );
}
