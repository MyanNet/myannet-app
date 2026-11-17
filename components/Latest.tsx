"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/ctx";
import * as store from "@/lib/store";
import { ago, isNew } from "@/lib/when";
import { THEME } from "./ui";

// Home page: the newest listings from every section and the newest Zayat topics.
const SEC: Record<string, [string, string, string, string]> = {
  jobs: ["💼", "Help Wanted", "အလုပ်အကိုင်", "#c0392b"], hundi: ["💸", "Hundi", "ဟွန်ဒီ", "#7c3aed"],
  rent: ["🏠", "Rent", "အိမ်ငှား", "#0891b2"], cargo: ["✈️", "Cargo", "ကုန်တင်ဆောင်", "#d97706"],
  goods: ["🛍️", "2nd Hand", "အသုံးချပစ္စည်း", "#16a34a"], biz: ["🏪", "Business", "လုပ်ငန်း", "#9d174d"],
};

export default function Latest({ onOpen }: { onOpen: (tab: string) => void }) {
  const { lang, version } = useApp();
  const mm = lang === "mm";
  const [items, setItems] = useState<store.Listing[]>([]);
  const [topics, setTopics] = useState<store.Topic[]>([]);
  useEffect(() => {
    store.fetchListings().then((l) => setItems(l.slice(0, 8))).catch(() => {});
    store.fetchTopics().then((t) => setTopics(t.slice(0, 3))).catch(() => {});
  }, [version]);
  if (!items.length && !topics.length) return null;
  const newCount = items.filter((l) => isNew(l.created_at)).length;
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 20, marginBottom: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        <div style={{ fontWeight: 900, fontSize: 17, color: THEME.greenDark }}>🆕 {mm ? "မြန်နက်တွင် နောက်ဆုံးတင်ထားသည်များ" : "Latest on MyanNet"}</div>
        {newCount > 0 && <div style={{ fontSize: 12, color: "#713f12", background: "#fef9c3", borderRadius: 12, padding: "3px 10px", fontWeight: 700 }}>{mm ? `ယခုအပတ် ပို့စ်အသစ် ${newCount}` : `${newCount} new this week`}</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
        {items.map((l) => {
          const s = SEC[l.pillar] || ["📌", l.pillar, l.pillar, THEME.green];
          return (
            <div key={l.id} onClick={() => onOpen(l.pillar)} style={{ border: `1px solid ${THEME.border}`, borderLeft: `4px solid ${s[3]}`, borderRadius: 12, padding: "10px 12px", cursor: "pointer", background: "#fcfefc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 6, fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: s[3], fontWeight: 800 }}>{s[0]} {mm ? s[2] : s[1]}</span>
                <span style={{ color: "#888", whiteSpace: "nowrap" }}>{isNew(l.created_at) && <b style={{ color: "#a16207" }}>🆕 </b>}{ago(l.created_at, lang)}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 13, lineHeight: 1.4, color: "#1f2a20", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{l.title}</div>
              <div style={{ fontSize: 11, color: "#777", marginTop: 3 }}>📍 {[l.city, l.country].filter(Boolean).join(", ")}{l.price ? " · " + l.price : ""}</div>
            </div>
          );
        })}
      </div>
      {topics.length > 0 && <>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#8d5a2b", margin: "16px 0 8px" }}>💬 {mm ? "ဇရပ်တွင် နောက်ဆုံး ဆွေးနွေးချက်များ" : "Latest in the Zayat"}</div>
        {topics.map((t) => (
          <div key={t.id} onClick={() => onOpen("zayat")} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "8px 10px", borderRadius: 10, background: "#faf6f0", marginBottom: 6, cursor: "pointer", fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: "#2b1d10" }}>{isNew(t.created_at) && "🆕 "}{t.title}</span>
            <span style={{ color: "#888", fontSize: 11, whiteSpace: "nowrap" }}>💬 {t.reply_count} · {ago(t.last_activity || t.created_at, lang)}</span>
          </div>
        ))}
      </>}
    </div>
  );
}
