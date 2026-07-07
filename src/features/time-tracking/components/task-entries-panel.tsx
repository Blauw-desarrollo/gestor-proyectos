import type { Member } from "@/features/tasks/types";
import type { TaskTimeEntry } from "../types";

export function TaskEntriesPanel({
  entries,
  members,
}: {
  entries: TaskTimeEntry[];
  members: Member[];
}) {
  if (entries.length === 0) {
    return (
      <p className="px-4 py-3 text-sm text-foreground/70">
        Sin horas imputadas todavía.
      </p>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs uppercase text-foreground/60">
          <th className="px-4 py-1.5 font-medium">Fecha</th>
          <th className="px-4 py-1.5 font-medium">Usuario</th>
          <th className="px-4 py-1.5 font-medium">Horas</th>
          <th className="px-4 py-1.5 font-medium">Notas</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => {
          const member = members.find(
            (m) => m.clerk_user_id === entry.user_clerk_id
          );
          return (
            <tr key={entry.id} className="border-t border-border">
              <td className="px-4 py-1.5 text-foreground/70">
                {new Date(entry.entry_date).toLocaleDateString("es-ES")}
              </td>
              <td className="px-4 py-1.5 text-foreground/70">
                {member?.display_name ?? member?.clerk_user_id ?? entry.user_clerk_id}
              </td>
              <td className="px-4 py-1.5 text-foreground/70">{entry.hours}</td>
              <td className="px-4 py-1.5 text-foreground/70">
                {entry.notes ?? "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
