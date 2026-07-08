import { getMyEntriesForWeek, getLoggableTasks } from "@/features/time-tracking/queries";
import { getWeekRange } from "@/features/time-tracking/date";
import { NewEntryForm } from "@/features/time-tracking/components/new-entry-form";
import { WeekCalendar } from "@/features/time-tracking/components/week-calendar";
import { WeekNav } from "@/features/time-tracking/components/week-nav";

export default async function HorasPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const reference = date ? new Date(date) : new Date();

  const [entries, tasks] = await Promise.all([
    getMyEntriesForWeek(reference),
    getLoggableTasks(),
  ]);

  const { start, end } = getWeekRange(reference);
  const total = entries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Horas</h1>
        <NewEntryForm tasks={tasks} />
      </div>
      <div className="flex items-center justify-between">
        <WeekNav start={start} end={end} reference={reference} />
        <span className="text-sm font-medium text-foreground">
          Total: <span className="text-brand">{total}h</span>
        </span>
      </div>
      <WeekCalendar start={start} entries={entries} tasks={tasks} />
    </div>
  );
}
