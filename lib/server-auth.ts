import { createClient } from "@supabase/supabase-js";

// Server-only helper for Telegram and TikTok, which Supabase has no built-in button for.
// It finds or creates a MyanNet account for that person and returns a one-time
// token the browser exchanges for a normal Supabase session.
export async function issueLoginToken(email: string, meta: Record<string, unknown>): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Supabase is not configured");
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const created = await admin.auth.admin.createUser({ email, email_confirm: true, user_metadata: meta });
  if (created.error && !/already|registered|exists/i.test(created.error.message)) throw created.error;

  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (error || !data?.properties?.hashed_token) throw error || new Error("Could not create login token");
  return data.properties.hashed_token;
}
