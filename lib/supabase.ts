import { createClient, SupabaseClient } from "@supabase/supabase-js";

// MyanNet's Supabase project. Both values are public by design: the publishable
// key only allows what the database's row-level security rules permit.
const DEFAULT_URL = "https://jksifhyaqactmgitiznp.supabase.co";
const DEFAULT_KEY = "sb_publishable_NEZTvwzcBcV6QbnuIoeYEQ_pszMoIpG";

const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
// Use the Vercel value only if it looks like a real Supabase public key.
const anonKey = /^(sb_publishable_|eyJ)/.test(envKey) ? envKey : DEFAULT_KEY;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;

export const LIVE = !!supabase;
