import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Exchange rates for the Hundi board.
// - World rates (USD -> THB, KRW, …) come from open.er-api.com, refreshed hourly.
// - The kyat MARKET (hundi) rate per US dollar is set by a MyanNet admin (fx_settings table),
//   because public "live" feeds only carry the official Central Bank rate (~2,100), which migrants don't get.
export const revalidate = 3600;
const CODES = ["USD", "THB", "MYR", "SGD", "JPY", "KRW", "TWD", "AUD", "AED", "SAR", "QAR", "KWD", "GBP", "CAD"];

export async function GET() {
  let world: Record<string, number> = {}, worldUpdated = "", official = 0;
  try {
    const r = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 3600 } });
    const j = await r.json();
    if (j?.rates) { world = j.rates; worldUpdated = j.time_last_update_utc || ""; official = j.rates.MMK || 0; }
  } catch {}
  // Three kyat rates per US dollar: official (Central Bank, Naypyitaw), open market, and hundi (set by admin).
  let set: { market: number | null; hundi: number | null; updated_at: string; note: string } | null = null;
  if (supabase) {
    const { data } = await supabase.from("fx_settings").select("usd_mmk_market, usd_mmk_hundi, updated_at, note").eq("id", 1).maybeSingle();
    if (data) set = { market: data.usd_mmk_market ? Number(data.usd_mmk_market) : null, hundi: data.usd_mmk_hundi ? Number(data.usd_mmk_hundi) : null, updated_at: data.updated_at, note: data.note || "" };
  }
  // MMK per 1 unit of each currency
  const rows = CODES.filter((c) => world[c]).map((c) => ({
    code: c,
    hundi: set?.hundi ? set.hundi / world[c] : null,
    market: set?.market ? set.market / world[c] : null,
    official: official ? official / world[c] : null,
  }));
  return NextResponse.json({ rows, set, worldUpdated, officialUsd: official });
}
