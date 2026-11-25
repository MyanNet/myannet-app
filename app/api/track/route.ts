import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Counts a visit: section, country/city (from Vercel's location headers), where the visitor came from,
// and phone/computer. No names and no IP addresses are stored.
export const dynamic = "force-dynamic";

function sourceOf(ref: string, qs: string) {
  const r = ref.toLowerCase(), q = qs.toLowerCase();
  const utm = /[?&]utm_source=([^&]+)/.exec(q)?.[1];
  if (utm) return decodeURIComponent(utm).slice(0, 20);
  if (/fbclid=/.test(q) || /facebook\.com|fb\.me|fb\.com/.test(r)) return "facebook";
  if (/instagram\./.test(r)) return "instagram";
  if (/t\.me|telegram\./.test(r)) return "telegram";
  if (/viber\./.test(r)) return "viber";
  if (/whatsapp\.|wa\.me/.test(r)) return "whatsapp";
  if (/tiktok\./.test(r)) return "tiktok";
  if (/google\./.test(r)) return "google";
  if (/bing\.|duckduckgo\.|yahoo\./.test(r)) return "search";
  if (!r || /myannet\.app/.test(r)) return "direct";
  return "other";
}

const META_DC = new Set(["prineville","forest city","altoona","boardman","clonee","luleå","lulea","odense","los lunas","papillion","henrico","new albany","eagle mountain","gallatin","stanton springs","dekalb","sarpy","council bluffs","the dalles","quincy","fort worth"]);

export async function POST(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  if (/bot|crawl|spider|preview|facebookexternalhit|slurp|headless/i.test(ua) || !supabase) return new NextResponse(null, { status: 204 });
  let b: { v?: string; s?: string; r?: string; q?: string } = {};
  try { b = await req.json(); } catch {}
  const country = req.headers.get("x-vercel-ip-country") || "";
  let city = req.headers.get("x-vercel-ip-city") || "";
  try { city = decodeURIComponent(city); } catch {}
  // Facebook/Meta checks every shared link from its own data centers with a real browser.
  // Those are not people, so skip visits from Meta data-center towns on a computer.
  const device = /mobi|android|iphone|ipad/i.test(ua) ? "phone" : "computer";
  if (device === "computer" && META_DC.has(city.toLowerCase())) return new NextResponse(null, { status: 204 });
  const ref = (b.r || "").slice(0, 300);
  let refHost = "";
  try { refHost = ref ? new URL(ref).host : ""; } catch {}
  await supabase.rpc("track_visit", {
    p_visitor: (b.v || "").slice(0, 40), p_section: (b.s || "home").slice(0, 30), p_country: country, p_city: city,
    p_source: sourceOf(ref, b.q || ""), p_referrer: refHost, p_device: device,
  });
  return new NextResponse(null, { status: 204 });
}
