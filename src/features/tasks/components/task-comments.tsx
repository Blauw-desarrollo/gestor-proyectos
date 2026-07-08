"use client";

import { useState, useTransition } from "react";
import { addComment, deleteComment } from "../actions";
import type { Member, TaskComment } from "../types";

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TaskComments({
  taskId,
  projectId,
  comments,
  loading,
  members,
  currentUserId,
  onReload,
}: {
  taskId: string;
  projectId: string;
  comments: TaskComment[];
  loading: boolean;
  members: Member[];
  currentUserId: string | null;
  onReload: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3">
      {loading ? (
        <p className="text-xs text-foreground/60">Cargando...</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-foreground/60">Sin comentarios todavía.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {comments.map((comment) => {
            const author = members.find(
              (member) => member.clerk_user_id === comment.author_clerk_id
            );
            const canDelete = comment.author_clerk_id === currentUserId;
            return (
              <li
                key={comment.id}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-foreground/70">
                    {author?.display_name ?? author?.clerk_user_id ?? "Alguien"}{" "}
                    <span className="font-normal text-foreground/40">
                      · {formatDateTime(comment.created_at)}
                    </span>
                  </span>
                  {canDelete && (
                    <button
                      onClick={() => {
                        startTransition(async () => {
                          const result = await deleteComment(
                            projectId,
                            comment.id
                          );
                          if (result?.error) alert(result.error);
                          else onReload();
                        });
                      }}
                      disabled={isPending}
                      className="text-xs text-foreground/40 hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-foreground">
                  {comment.body}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await addComment(projectId, taskId, formData);
            if (result?.error) {
              setError(result.error);
            } else {
              setError(null);
              const form = document.getElementById(
                `comment-form-${taskId}`
              ) as HTMLFormElement | null;
              form?.reset();
              onReload();
            }
          });
        }}
        id={`comment-form-${taskId}`}
        className="flex flex-col gap-2"
      >
        <textarea
          name="body"
          placeholder="Escribe un comentario..."
          rows={2}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="self-end rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          Comentar
        </button>
      </form>
    </div>
  );
}
