import { getActiveProjects } from "@/features/projects/queries";
import { ProjectsTable } from "@/features/projects/components/projects-table";
import { NewProjectForm } from "@/features/projects/components/new-project-form";
import { isAdmin } from "@/lib/auth/roles";

export default async function ProyectosPage() {
  const [projects, admin] = await Promise.all([
    getActiveProjects(),
    isAdmin(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Proyectos</h1>
        {admin && <NewProjectForm />}
      </div>
      <ProjectsTable projects={projects} isAdmin={admin} />
    </div>
  );
}
