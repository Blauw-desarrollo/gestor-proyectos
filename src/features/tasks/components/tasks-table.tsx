import { TaskRow } from "./task-row";
import type { Member, TaskWithHours } from "../types";
import type { TaskTimeEntry } from "@/features/time-tracking/types";

export function TasksTable({
  tasks,
  projectId,
  members,
  isAdmin,
  entriesByTask,
}: {
  tasks: TaskWithHours[];
  projectId: string;
  members: Member[];
  isAdmin: boolean;
  entriesByTask: Record<string, TaskTimeEntry[]>;
}) {
  if (tasks.length === 0) {
    return (
      <p className="text-sm text-foreground/70">
        Este proyecto todavía no tiene tareas.
      </p>
    );
  }

  return (
    <table className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase text-foreground/60">
          <th className="px-4 py-2 font-medium">Título</th>
          <th className="px-4 py-2 font-medium">Estado</th>
          <th className="px-4 py-2 font-medium">Asignado</th>
          <th className="px-4 py-2 font-medium">Estimadas</th>
          <th className="px-4 py-2 font-medium">Reales</th>
          <th className="px-4 py-2 font-medium">Desviación</th>
          {isAdmin && <th className="px-4 py-2" />}
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
            entries={entriesByTask[task.id] ?? []}
          />
        ))}
      </tbody>
    </table>
  );
}
