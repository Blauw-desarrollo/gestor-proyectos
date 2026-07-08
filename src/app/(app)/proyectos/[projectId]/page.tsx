import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectById } from "@/features/projects/queries";
import {
  getProjectTasks,
  getMembers,
  getCommentsGroupedByTask,
} from "@/features/tasks/queries";
import {
  getEntriesGroupedByTask,
  getActiveTimer,
} from "@/features/time-tracking/queries";
import { TasksTable } from "@/features/tasks/components/tasks-table";
import { NewTaskForm } from "@/features/tasks/components/new-task-form";
import { TASK_STATUS_LABELS, type TaskStatus } from "@/features/tasks/types";
import { isAdmin } from "@/lib/auth/roles";

export default async function ProyectoDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { projectId } = await params;
  const { q, status } = await searchParams;
  const statusFilter =
    status && status in TASK_STATUS_LABELS ? (status as TaskStatus) : undefined;

  const project = await getProjectById(projectId);
  if (!project) notFound();

  const [tasks, admin, members, { userId }, activeTimer] = await Promise.all([
    getProjectTasks(projectId, { search: q, status: statusFilter }),
    isAdmin(),
    getMembers(),
    auth(),
    getActiveTimer(),
  ]);

  const taskIds = tasks.map((task) => task.id);
  const [entriesByTask, commentsByTask] = await Promise.all([
    admin ? getEntriesGroupedByTask(taskIds) : Promise.resolve({}),
    getCommentsGroupedByTask(taskIds),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          {project.name}
        </h1>
        <p className="text-sm text-foreground/70">
          {project.status === "active" ? "Activo" : "Archivado"}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase text-foreground/60">
          Tareas
        </h2>
        {admin && <NewTaskForm projectId={projectId} members={members} />}
      </div>
      <form className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar tarea..."
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        />
        <select
          name="status"
          defaultValue={statusFilter ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        >
          <option value="">Todos los estados</option>
          {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </form>
      <TasksTable
        tasks={tasks}
        projectId={projectId}
        members={members}
        isAdmin={admin}
        entriesByTask={entriesByTask}
        commentsByTask={commentsByTask}
        currentUserId={userId}
        activeTimer={activeTimer}
      />
    </div>
  );
}
