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
    <div className="flex items-center gap-3">
      <Link
        href={`/horas?date=${toISODate(prev)}`}
        aria-label="Semana anterior"
        className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground hover:bg-background"
      >
        ←
      </Link>
      <span className="text-sm font-medium text-foreground">
        {formatShortDate(start)} – {formatShortDate(end)}
      </span>
      <Link
        href={`/horas?date=${toISODate(next)}`}
        aria-label="Semana siguiente"
        className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground hover:bg-background"
      >
        →
      </Link>
    </div>
  );
}
