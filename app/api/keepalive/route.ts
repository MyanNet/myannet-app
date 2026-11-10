import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Called once a day by Vercel Cron (see vercel.json). A small real database
// read keeps the free Supabase project counted as active so it is not paused.
export const dynamic = "force-dynamic";

export async function GET() {
  if (!supabase) return NextResponse.json({ ok: false, reason: "no database" }, { status: 503 });
  const { count, error } = await supabase.from("listings").select("id", { count: "exact", head: true });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, listings: count, at: new Date().toISOString() });
}
