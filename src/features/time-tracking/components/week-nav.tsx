import Link from "next/link";
import { addDays, formatShortDate, toISODate } from "../date";

export function WeekNav({
  start,
  end,
  reference,
}: {
  start: Date;
  end: Date;
  reference: Date;
}) {
  const prev = addDays(reference, -7);
  const next = addDays(reference, 7);

  return (
    <div className="flex items-center gap-4">
      <Link
        href={`/horas?date=${toISODate(prev)}`}
        className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground hover:bg-background"
      >
        ← Semana anterior
      </Link>
      <span className="text-sm font-medium text-foreground">
        {formatShortDate(start)} – {formatShortDate(end)}
      </span>
      <Link
        href={`/horas?date=${toISODate(next)}`}
        className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground hover:bg-background"
      >
        Semana siguiente →
      </Link>
    </div>
  );
}
