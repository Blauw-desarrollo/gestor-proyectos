import { notFound } from "next/navigation";
import { getProjectById } from "@/features/projects/queries";
import { getProjectTasks, getMembers } from "@/features/tasks/queries";
import { getEntriesGroupedByTask } from "@/features/time-tracking/queries";
import { TasksTable } from "@/features/tasks/components/tasks-table";
import { NewTaskForm } from "@/features/tasks/components/new-task-form";
import { isAdmin } from "@/lib/auth/roles";

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const project = await getProjectById(projectId);
  if (!project) notFound();

  const [tasks, admin, members] = await Promise.all([
    getProjectTasks(projectId),
    isAdmin(),
    getMembers(),
  ]);

  const entriesByTask = admin
    ? await getEntriesGroupedByTask(tasks.map((task) => task.id))
    : {};

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
      <TasksTable
        tasks={tasks}
        projectId={projectId}
        members={members}
        isAdmin={admin}
        entriesByTask={entriesByTask}
      />
    </div>
  );
}
