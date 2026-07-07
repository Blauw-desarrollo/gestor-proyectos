export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getWeekRange(reference: Date): { start: Date; end: Date } {
  const start = startOfWeek(reference);
  const end = addDays(start, 6);
  return { start, end };
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
}
