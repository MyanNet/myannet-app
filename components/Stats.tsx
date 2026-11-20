"use client";
import { useEffect, useState } from "react";
import * as store from "@/lib/store";
import { flag, nameOf } from "@/lib/countries";

// Admin: who visits MyanNet, from where, how they found it, and what they look at.
const SRC: Record<string, string> = { facebook: "📘 Facebook", direct: "⌨️ Typed / app / no link", google: "🔍 Google", search: "🔍 Other search", telegram: "✈️ Telegram", viber: "📱 Viber", whatsapp: "🟢 WhatsApp", instagram: "📷 Instagram", tiktok: "🎵 TikTok", other: "🔗 Other sites" };
const SEC: Record<string, string> = { home: "🏠 Home", jobs: "💼 Help Wanted", hundi: "💸 Hundi / rates", rent: "🏠 Rent", cargo: "✈️ Cargo", goods: "🛍️ Buy / Sell", biz: "🏪 Businesses", zayat: "💬 Podium", rates: "💱 Rates page" };

function Bars({ rows, label, value }: { rows: any[]; label: (r: any) => string; value: (r: any) => number }) {
  const max = Math.max(1, ...rows.map(value));
  if (!rows.length) return <div style={{ fontSize: 12, color: "#999" }}>No data yet</div>;
  return <div>{rows.map((r, i) => (
    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, marginBottom: 4 }}>
      <div style={{ width: 170, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label(r)}</div>
      <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 4, height: 14 }}><div style={{ width: `${(value(r) / max) * 100}%`, background: "#2e7d32", height: 14, borderRadius: 4 }} /></div>
      <div style={{ width: 40, textAlign: "right", fontWeight: 700 }}>{value(r)}</div>
    </div>))}</div>;
}

export default function Stats() {
  const [days, setDays] = useState(7);
  const [d, setD] = useState<any>(null);
  const [err, setErr] = useState("");
  useEffect(() => { setD(null); store.adminStats(days).then(setD).catch((e) => setErr(e.message)); }, [days]);
  const card = (label: string, v: any, sub?: string) => (
    <div style={{ flex: "1 1 120px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "#1b5e20" }}>{v ?? "—"}</div>
      {sub && <div style={{ fontSize: 11, color: "#888" }}>{sub}</div>}
    </div>);
  const box: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, flex: "1 1 300px" };
  return (
    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 14, marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontWeight: 800, color: "#166534" }}>📊 Visitors</div>
        <div>{[1, 7, 30, 90].map((n) => <button key={n} onClick={() => setDays(n)} style={{ marginLeft: 4, padding: "4px 10px", borderRadius: 14, border: "1px solid #bbf7d0", background: days === n ? "#166534" : "#fff", color: days === n ? "#fff" : "#166534", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>{n === 1 ? "Today" : `${n} days`}</button>)}</div>
      </div>
      {err && <div style={{ color: "#b91c1c", fontSize: 12 }}>{err}</div>}
      {d && <>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {card("Visitors (unique)", d.visitors)}{card("Page views", d.views)}
          {card("Members", d.members, `+${d.new_members} new`)}{card("Listings", d.listings, `+${d.new_listings} new`)}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={box}><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>📅 Visitors per day</div>
            <Bars rows={d.daily} label={(r) => new Date(r.day + "T12:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} value={(r) => r.visitors} /></div>
          <div style={box}><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>🌍 Countries</div>
            <Bars rows={d.countries} label={(r) => r.country ? `${flag(r.country)} ${nameOf(r.country)}` : "Unknown"} value={(r) => r.visitors} /></div>
          <div style={box}><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>📍 Cities</div>
            <Bars rows={d.cities} label={(r) => `${r.city}${r.country ? ", " + r.country : ""}`} value={(r) => r.visitors} /></div>
          <div style={box}><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>🔗 How they found MyanNet</div>
            <Bars rows={d.sources} label={(r) => SRC[r.source] || r.source || "Unknown"} value={(r) => r.visitors} /></div>
          <div style={box}><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>👀 Sections opened</div>
            <Bars rows={d.sections} label={(r) => SEC[r.section] || r.section} value={(r) => r.views} /></div>
          <div style={box}><div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>📱 Device</div>
            <Bars rows={d.devices} label={(r) => r.device === "phone" ? "📱 Phone" : "💻 Computer"} value={(r) => r.visitors} /></div>
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 8 }}>Counts start Nov 19, 2026. Your own visits as admin are not counted. No names or IP addresses are stored.</div>
      </>}
    </div>
  );
}
