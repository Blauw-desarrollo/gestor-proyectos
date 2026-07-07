import { TASK_STATUS_LABELS, type Member, type TaskStatus } from "../types";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-foreground/60">{label}</span>
      {children}
    </label>
  );
}

export function TaskFormFields({
  members,
  defaults,
}: {
  members: Member[];
  defaults?: {
    title: string;
    status: TaskStatus;
    assignee_clerk_id: string | null;
    estimated_hours: number | null;
  };
}) {
  return (
    <>
      <Field label="Título">
        <input
          name="title"
          placeholder="Título de la tarea"
          defaultValue={defaults?.title}
          required
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        />
      </Field>
      <Field label="Estado">
        <select
          name="status"
          defaultValue={defaults?.status ?? "todo"}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        >
          {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Asignado">
        <select
          name="assignee_clerk_id"
          defaultValue={defaults?.assignee_clerk_id ?? ""}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        >
          <option value="">Sin asignar</option>
          {members.map((member) => (
            <option key={member.clerk_user_id} value={member.clerk_user_id}>
              {member.display_name ?? member.clerk_user_id}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Horas est.">
        <input
          name="estimated_hours"
          type="number"
          min={0}
          step="0.5"
          defaultValue={defaults?.estimated_hours ?? undefined}
          className="w-28 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground"
        />
      </Field>
    </>
  );
}
