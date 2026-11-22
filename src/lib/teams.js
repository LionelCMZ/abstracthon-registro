import { supabase } from "./supabase.js";

const TABLE = "projects";

export async function createTeam({ teamName, githubUrl }) {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({ team_name: teamName, github_url: githubUrl })
    .select("id")
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function getTeams() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select("id, team_name, github_url, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}
