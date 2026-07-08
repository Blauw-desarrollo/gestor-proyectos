"use client";

import { useEffect, useState, useTransition } from "react";
import { startTimer, stopTimer } from "../actions";
import type { ActiveTimer } from "../types";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function TimerControl({
  taskId,
  projectId,
  activeTimer,
}: {
  taskId: string;
  projectId: string;
  activeTimer: ActiveTimer;
}) {
  const isRunningHere = activeTimer?.task_id === taskId;
  const [elapsed, setElapsed] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isRunningHere || !activeTimer) return;
    const startedAt = new Date(activeTimer.started_at).getTime();
    const tick = () => setElapsed(Date.now() - startedAt);
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isRunningHere, activeTimer]);

  if (isRunningHere) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-brand">
          {formatElapsed(elapsed)}
        </span>
        <button
          onClick={() => {
            startTransition(async () => {
              const result = await stopTimer(projectId);
              if (result?.error) alert(result.error);
            });
          }}
          disabled={isPending}
          className="rounded-md border border-border px-2 py-1 text-xs text-foreground hover:bg-background disabled:opacity-50"
        >
          Detener
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          const result = await startTimer(taskId, projectId);
          if (result?.error) alert(result.error);
        });
      }}
      disabled={isPending}
      className="rounded-md border border-border px-2 py-1 text-xs text-foreground hover:bg-background disabled:opacity-50"
    >
      Iniciar
    </button>
  );
}
