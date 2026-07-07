#!/usr/bin/env node
// Genera src/types/database.ts desde el esquema real de Supabase.
// Sustituye al one-liner de bash de scripts/setup.sh: en Windows, npm ejecuta
// los scripts con cmd.exe, que no expande `$VAR`, así que lo hacemos aquí.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

function loadEnvLocal() {
  const path = ".env.local";
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const projectId = process.env.SUPABASE_PROJECT_ID;
if (!projectId || projectId === "xxx") {
  console.error("Falta SUPABASE_PROJECT_ID en .env.local");
  process.exit(1);
}
if (!process.env.SUPABASE_ACCESS_TOKEN) {
  console.error(
    "Falta SUPABASE_ACCESS_TOKEN en .env.local.\n" +
      "Genéralo en https://supabase.com/dashboard/account/tokens y añade:\n" +
      "SUPABASE_ACCESS_TOKEN=sbp_xxx"
  );
  process.exit(1);
}

const result = spawnSync(
  "npx",
  ["supabase", "gen", "types", "typescript", "--project-id", projectId, "--schema", "public"],
  { encoding: "utf8", shell: true, env: process.env }
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status ?? 1);
}

writeFileSync("src/types/database.ts", result.stdout);
console.log("src/types/database.ts generado.");
