// Traduce errores técnicos de Postgres/Supabase a un mensaje que un
// usuario pueda entender, en vez de enseñarle el texto crudo de Postgres
// (ej. "new row violates row-level security policy for table X").
export function friendlyDbError(message: string): string {
  if (message.toLowerCase().includes("row-level security")) {
    return "No se ha podido completar la acción por un problema de sesión o permisos. Recarga la página y vuelve a intentarlo.";
  }
  return message;
}
