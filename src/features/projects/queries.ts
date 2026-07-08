import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Project, ProjectStatus } from "./types";

export async function getProjectsByStatus(
  status: ProjectStatus,
  search?: string
): Promise<Project[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("projects").select("*").eq("status", status);

  if (search && search.trim() !== "") {
    query = query.ilike("name", `%${search.trim()}%`);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) throw error;
  return data;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}
