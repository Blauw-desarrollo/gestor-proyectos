import { EntryCard } from "./entry-card";
import { addDays, toISODate } from "../date";
import type { LoggableTask, MyTimeEntry } from "../types";

const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export function WeekCalendar({
  start,
  entries,
  tasks,
}: {
  start: Date;
  entries: MyTimeEntry[];
  tasks: LoggableTask[];
}) {
  const entriesByDay: Record<string, MyTimeEntry[]> = {};
  for (const entry of entries) {
    (entriesByDay[entry.entry_date] ??= []).push(entry);
  }

  const today = toISODate(new Date());
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((day, index) => {
        const iso = toISODate(day);
        const dayEntries = entriesByDay[iso] ?? [];
        const dayTotal = dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
        const isToday = iso === today;

        return (
          <div
            key={iso}
            className={`flex flex-col gap-2 rounded-lg border p-2 shadow-xl backdrop-blur-xl ${
              isToday ? "border-brand bg-brand/10" : "border-border bg-surface/70"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-foreground/60">
                {DAY_LABELS[index]}{" "}
                <span className="font-normal">
                  {day.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </span>
              {dayTotal > 0 && (
                <span className="text-xs font-semibold text-brand">
                  {dayTotal}h
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {dayEntries.length === 0 ? (
                <p className="text-xs text-foreground/40">Sin horas</p>
              ) : (
                dayEntries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} tasks={tasks} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
