"use client";
import { useEffect, useState } from "react";
import { flag } from "@/lib/countries";
import { ago } from "@/lib/when";

// Three kyat rates: hundi (what agents pay), open market, and official (Central Bank, Naypyitaw).
type Row = { code: string; hundi: number | null; market: number | null; official: number | null };
type Data = { rows: Row[]; set: { market: number | null; hundi: number | null; updated_at: string; note: string } | null; worldUpdated: string; officialUsd: number };
const META: Record<string, [string, string]> = {
  USD: ["US", "US Dollar"], THB: ["TH", "Thai Baht"], MYR: ["MY", "Malaysian Ringgit"], SGD: ["SG", "Singapore Dollar"],
  JPY: ["JP", "Japanese Yen"], KRW: ["KR", "Korean Won"], TWD: ["TW", "Taiwan Dollar"], AUD: ["AU", "Australian Dollar"],
  AED: ["AE", "UAE Dirham (Dubai)"], SAR: ["SA", "Saudi Riyal"], QAR: ["QA", "Qatari Riyal"], KWD: ["KW", "Kuwaiti Dinar"],
  GBP: ["GB", "British Pound"], CAD: ["CA", "Canadian Dollar"],
};
const KINDS = [
  ["hundi", "Hundi", "ဟွန်ဒီ", "#7c3aed"],
  ["market", "Open market", "ပြင်ပဈေး", "#0e7490"],
  ["official", "Official (CBM)", "တရားဝင် (ဗဟိုဘဏ်)", "#9ca3af"],
] as const;
const fmt = (n: number) => n >= 100 ? Math.round(n).toLocaleString() : n.toLocaleString(undefined, { maximumFractionDigits: 2 });
let cache: Promise<Data> | null = null;
const load = () => (cache ||= fetch("/api/rates").then((r) => r.json()));
const best = (r?: Row) => r?.hundi ?? r?.market ?? null;

// One-line strip for the home page.
export function RatesTicker({ lang, onOpen }: { lang: string; onOpen: () => void }) {
  const [d, setD] = useState<Data | null>(null);
  useEffect(() => { load().then(setD).catch(() => {}); }, []);
  if (!d?.set || !(d.set.hundi || d.set.market)) return null;
  const label = d.set.hundi ? (lang === "mm" ? "ဟွန်ဒီ နှုန်း" : "Hundi rate") : (lang === "mm" ? "ပြင်ပဈေး" : "Market rate");
  return (
    <div onClick={onOpen} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", fontSize: 12, color: "#4c1d95", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 12, padding: "6px 12px", marginBottom: 10, cursor: "pointer" }}>
      <b>💱 {label}</b>
      {["USD", "THB", "MYR", "SGD", "KRW", "JPY", "AED"].map((c) => { const v = best(d.rows.find((x) => x.code === c)); return v ? <span key={c}>{flag(META[c][0])} 1 {c} = <b>{fmt(v)}</b> K</span> : null; })}
      <span style={{ color: "#888" }}>· {ago(d.set.updated_at, lang)} ›</span>
    </div>
  );
}

// Full board + calculator for the Hundi page.
export function RatesBoard({ lang }: { lang: string }) {
  const mm = lang === "mm";
  const [d, setD] = useState<Data | null>(null);
  const [cur, setCur] = useState("USD");
  const [amt, setAmt] = useState("500");
  useEffect(() => { load().then(setD).catch(() => {}); }, []);
  if (!d) return null;
  const row = d.rows.find((r) => r.code === cur);
  const usd = d.rows.find((r) => r.code === "USD");
  const shown = KINDS.filter(([k]) => d.rows.some((r) => r[k]));
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 18, boxShadow: "0 4px 14px rgba(0,0,0,0.07)" }}>
      <div style={{ fontWeight: 900, fontSize: 17, color: "#7c3aed", marginBottom: 4 }}>💱 {mm ? "မြန်မာကျပ် ငွေလဲနှုန်း" : "Myanmar kyat exchange rates"}</div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 12, lineHeight: 1.6 }}>
        {mm ? "နှုန်း ၃ မျိုး — ဟွန်ဒီ (ကိုယ်စားလှယ်များ ပေးနှုန်း)၊ ပြင်ပဈေး၊ တရားဝင် (နေပြည်တော် ဗဟိုဘဏ် သတ်မှတ်ချက်)။ " : "Three rates — hundi (what agents pay), open market, and official (set by the Central Bank in Naypyitaw). "}
        {d.set ? (mm ? `ဟွန်ဒီ/ပြင်ပဈေး နှုန်းကို ${ago(d.set.updated_at, lang)} က မြန်နက်မှ အပ်ဒိတ်လုပ်ခဲ့သည်။ ` : `Hundi/market rates updated by MyanNet ${ago(d.set.updated_at, lang).toLowerCase()}. `) : ""}
        {mm ? "အခြားငွေကြေးများကို ကမ္ဘာ့ငွေလဲနှုန်းဖြင့် နာရီတိုင်း တွက်ချက်သည်။" : "Other currencies are worked out from world rates, refreshed every hour."}
        {d.set?.note ? " " + d.set.note : ""}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {shown.map(([k, en, my, c]) => usd?.[k] ? (
          <div key={k} style={{ flex: "1 1 150px", border: `2px solid ${c}`, borderRadius: 12, padding: "8px 12px" }}>
            <div style={{ fontSize: 11, color: c, fontWeight: 800 }}>{mm ? my : en}</div>
            <div style={{ fontWeight: 900, fontSize: 20, color: "#1f2937" }}>{fmt(usd[k]!)} <span style={{ fontSize: 12 }}>K / $1</span></div>
          </div>
        ) : null)}
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", background: "#faf5ff", borderRadius: 12, padding: 12, marginBottom: 14 }}>
        <input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", fontSize: 15, width: 110 }} />
        <select value={cur} onChange={(e) => setCur(e.target.value)} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd", fontSize: 14 }}>
          {d.rows.map((r) => <option key={r.code} value={r.code}>{flag(META[r.code][0])} {r.code} — {META[r.code][1]}</option>)}
        </select>
        <span style={{ fontSize: 18 }}>→ 🇲🇲</span>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {shown.map(([k, en, my, c]) => row?.[k] ? (
            <div key={k}><div style={{ fontSize: 10, color: c, fontWeight: 800 }}>{mm ? my : en}</div>
              <div style={{ fontWeight: 900, fontSize: k === shown[0][0] ? 22 : 15, color: k === "official" ? "#9ca3af" : "#4c1d95" }}>{Math.round((+amt || 0) * row[k]!).toLocaleString()} K</div></div>
          ) : null)}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "right", color: "#666", fontSize: 11 }}>
            <th style={{ textAlign: "left", padding: 6 }}>{mm ? "ငွေကြေး" : "Currency"}</th>
            {shown.map(([k, en, my, c]) => <th key={k} style={{ padding: 6, color: c }}>{mm ? my : en}</th>)}
          </tr></thead>
          <tbody>{d.rows.map((r) => (
            <tr key={r.code} onClick={() => setCur(r.code)} style={{ borderTop: "1px solid #f0f0f0", cursor: "pointer", background: cur === r.code ? "#faf5ff" : undefined }}>
              <td style={{ padding: 6 }}>{flag(META[r.code][0])} 1 {r.code} <span style={{ color: "#999", fontSize: 11 }}>{META[r.code][1]}</span></td>
              {shown.map(([k]) => <td key={k} style={{ padding: 6, textAlign: "right", fontWeight: k === shown[0][0] ? 800 : 500, color: k === "official" ? "#9ca3af" : "#1f2937" }}>{r[k] ? fmt(r[k]!) : "—"}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: "#999", marginTop: 10, lineHeight: 1.6 }}>
        {mm ? "ခန့်မှန်းနှုန်းသာ ဖြစ်ပါသည်။ ကိုယ်စားလှယ်တစ်ဦးချင်း၏ နှုန်းနှင့် ကြေးငွေ ကွာခြားနိုင်ပါသည်။ မပို့မီ ကိုယ်စားလှယ်ထံ အတည်ပြုပါ။ မြန်နက်သည် ငွေမကိုင်တွယ်ပါ။"
            : "Estimates only. Each agent's rate and fee can differ — confirm with your agent before sending. MyanNet does not handle money."}
        {" "}World rates: ExchangeRate-API.
      </div>
    </div>
  );
}
