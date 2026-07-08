"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { deleteTask, getTaskModalData, updateTask } from "../actions";
import { TaskFormFields } from "./task-form-fields";
import { TaskComments } from "./task-comments";
import { TaskEntriesPanel } from "@/features/time-tracking/components/task-entries-panel";
import { AddHoursForm } from "@/features/time-tracking/components/add-hours-form";
import {
  TASK_STATUS_LABELS,
  type Member,
  type TaskComment,
  type TaskStatus,
  type TaskWithHours,
} from "../types";
import type { TaskTimeEntry } from "@/features/time-tracking/types";

export function TaskDetailModal({
  open,
  onClose,
  task,
  projectId,
  members,
  isAdmin,
  currentUserId,
}: {
  open: boolean;
  onClose: () => void;
  task: TaskWithHours;
  projectId: string;
  members: Member[];
  isAdmin: boolean;
  currentUserId: string | null;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [entries, setEntries] = useState<TaskTimeEntry[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  const reload = () => {
    getTaskModalData(task.id, isAdmin).then(({ comments, entries }) => {
      setComments(comments);
      setEntries(entries);
      setLoadingDetails(false);
    });
  };

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      // Resetea el spinner cada vez que se reabre (el modal no se desmonta).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingDetails(true);
      reload();
    } else {
      dialogRef.current?.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const assignee = members.find(
    (member) => member.clerk_user_id === task.assignee_clerk_id
  );

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto w-full max-w-lg rounded-lg border border-border bg-surface/80 p-6 shadow-2xl backdrop-blur-xl backdrop:bg-black/60"
    >
      <div className="flex items-start justify-between">
        <h2 className="text-base font-semibold text-foreground">
          {isAdmin ? "Editar tarea" : task.title}
        </h2>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="text-foreground/50 hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {isAdmin ? (
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = await updateTask(projectId, task.id, formData);
              if (result?.error) {
                setError(result.error);
              } else {
                setError(null);
                onClose();
              }
            });
          }}
          className="mt-4 flex flex-col gap-3"
        >
          <TaskFormFields
            members={members}
            defaults={{
              title: task.title,
              status: task.status as TaskStatus,
              assignee_clerk_id: task.assignee_clerk_id,
              estimated_hours: task.estimated_hours,
              due_date: task.due_date,
            }}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="mt-1 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm(`¿Eliminar la tarea "${task.title}"?`)) {
                  startTransition(async () => {
                    const result = await deleteTask(projectId, task.id);
                    if (result?.error) {
                      setError(result.error);
                    } else {
                      onClose();
                    }
                  });
                }
              }}
              className="text-sm text-foreground/60 hover:text-red-600"
            >
              Eliminar tarea
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md px-4 py-2 text-sm text-foreground/70 hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      ) : (
        <dl className="mt-4 flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-foreground/60">Estado</dt>
            <dd className="text-foreground">
              {TASK_STATUS_LABELS[task.status as TaskStatus] ?? task.status}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-foreground/60">Asignado</dt>
            <dd className="text-foreground">
              {assignee?.display_name ?? assignee?.clerk_user_id ?? "Sin asignar"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-foreground/60">Vencimiento</dt>
            <dd className="text-foreground">{task.due_date ?? "—"}</dd>
          </div>
        </dl>
      )}

      <div className="mt-4 border-t border-border pt-4">
        <h3 className="mb-2 text-xs font-medium uppercase text-foreground/60">
          Imputar horas
        </h3>
        <AddHoursForm taskId={task.id} projectId={projectId} onLogged={reload} />
      </div>

      {isAdmin && (
        <div className="mt-4 border-t border-border pt-4">
          <h3 className="text-xs font-medium uppercase text-foreground/60">
            Horas imputadas
          </h3>
          <div className="mt-2">
            {loadingDetails ? (
              <p className="text-xs text-foreground/60">Cargando...</p>
            ) : (
              <TaskEntriesPanel entries={entries} members={members} />
            )}
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-border pt-4">
        <h3 className="mb-2 text-xs font-medium uppercase text-foreground/60">
          Comentarios
        </h3>
        <TaskComments
          taskId={task.id}
          projectId={projectId}
          comments={comments}
          loading={loadingDetails}
          members={members}
          currentUserId={currentUserId}
          onReload={reload}
        />
      </div>
    </dialog>
  );
}
