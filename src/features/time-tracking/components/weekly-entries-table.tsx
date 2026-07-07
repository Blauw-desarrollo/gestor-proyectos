import { EntryRow } from "./entry-row";
import type { AssignableTask, MyTimeEntry } from "../types";

export function WeeklyEntriesTable({
  entries,
  tasks,
  total,
}: {
  entries: MyTimeEntry[];
  tasks: AssignableTask[];
  total: number;
}) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-foreground/70">
        No has imputado horas esta semana.
      </p>
    );
  }

  return (
    <table className="w-full overflow-hidden rounded-lg border border-border bg-surface">
      <thead>
        <tr className="border-b border-border text-left text-xs uppercase text-foreground/60">
          <th className="px-4 py-2 font-medium">Fecha</th>
          <th className="px-4 py-2 font-medium">Tarea</th>
          <th className="px-4 py-2 font-medium">Horas</th>
          <th className="px-4 py-2 font-medium">Notas</th>
          <th className="px-4 py-2" />
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <EntryRow key={entry.id} entry={entry} tasks={tasks} />
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t border-border">
          <td className="px-4 py-2 text-sm font-semibold text-foreground" colSpan={2}>
            Total
          </td>
          <td className="px-4 py-2 text-sm font-semibold text-foreground">
            {total}
          </td>
          <td colSpan={2} />
        </tr>
      </tfoot>
    </table>
  );
}
