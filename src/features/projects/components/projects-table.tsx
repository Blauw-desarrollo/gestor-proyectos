import { ProjectRow } from "./project-row";
import type { Project } from "../types";

export function ProjectsTable({
  projects,
  isAdmin,
}: {
  projects: Project[];
  isAdmin: boolean;
}) {
  if (projects.length === 0) {
    return (
      <p className="text-sm text-foreground/70">
        No hay proyectos que coincidan.
      </p>
    );
  }

  return (
    <table className="w-full overflow-hidden rounded-lg border border-border bg-surface">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase text-foreground/60">
          <th className="px-4 py-2 font-medium">Nombre</th>
          <th className="px-4 py-2 font-medium">Creado</th>
          {isAdmin && <th className="px-4 py-2" />}
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <ProjectRow key={project.id} project={project} isAdmin={isAdmin} />
        ))}
      </tbody>
    </table>
  );
}
