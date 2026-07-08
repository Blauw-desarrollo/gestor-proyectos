import { TaskRow } from "./task-row";
import type { Member, TaskWithHours } from "../types";
import type { ActiveTimer } from "@/features/time-tracking/types";

export function TasksTable({
  tasks,
  projectId,
  members,
  isAdmin,
  currentUserId,
  activeTimer,
}: {
  tasks: TaskWithHours[];
  projectId: string;
  members: Member[];
  isAdmin: boolean;
  currentUserId: string | null;
  activeTimer: ActiveTimer;
}) {
  if (tasks.length === 0) {
    return (
      <p className="text-sm text-foreground/70">
        Este proyecto todavía no tiene tareas.
      </p>
    );
  }

  return (
    <table className="w-full overflow-hidden rounded-lg border border-border bg-surface/70 shadow-xl backdrop-blur-xl">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase text-foreground/60">
          <th className="px-4 py-2 font-medium">Título</th>
          <th className="px-4 py-2 font-medium">Estado</th>
          <th className="px-4 py-2 font-medium">Asignado</th>
          <th className="px-4 py-2 font-medium">Vencimiento</th>
          <th className="px-4 py-2 font-medium">Estimadas</th>
          <th className="px-4 py-2 font-medium">Reales</th>
          <th className="px-4 py-2 font-medium">Desviación</th>
          <th className="px-4 py-2 font-medium">Cronómetro</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            projectId={projectId}
            members={members}
            isAdmin={isAdmin}
            currentUserId={currentUserId}
            activeTimer={activeTimer}
          />
        ))}
      </tbody>
    </table>
  );
}
