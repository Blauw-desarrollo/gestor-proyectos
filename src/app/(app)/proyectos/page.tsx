import Link from "next/link";
import { getProjectsByStatus } from "@/features/projects/queries";
import { ProjectsTable } from "@/features/projects/components/projects-table";
import { NewProjectForm } from "@/features/projects/components/new-project-form";
import { isAdmin } from "@/lib/auth/roles";
import type { ProjectStatus } from "@/features/projects/types";

export default async function ProyectosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const activeTab: ProjectStatus = status === "archived" ? "archived" : "active";

  const [projects, admin] = await Promise.all([
    getProjectsByStatus(activeTab, q),
    isAdmin(),
  ]);

  const tabHref = (nextStatus: ProjectStatus) =>
    `/proyectos?status=${nextStatus}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Proyectos</h1>
        {admin && <NewProjectForm />}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-md border border-border bg-surface p-1">
          <Link
            href={tabHref("active")}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              activeTab === "active"
                ? "bg-brand text-white"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Activos
          </Link>
          <Link
            href={tabHref("archived")}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              activeTab === "archived"
                ? "bg-brand text-white"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Archivados
          </Link>
        </div>
        <form className="flex items-center gap-2">
          <input type="hidden" name="status" value={activeTab} />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar proyecto..."
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
          />
        </form>
      </div>

      <ProjectsTable projects={projects} isAdmin={admin} />
    </div>
  );
}
