export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="flex items-center gap-3 text-sm text-foreground/60">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-brand" />
        Cargando proyectos...
      </div>
    </div>
  );
}
