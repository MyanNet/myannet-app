"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/ctx";
import * as store from "@/lib/store";
import { ago, isNew } from "@/lib/when";
import { THEME } from "./ui";

// Home page: newest listings (left) and newest Podium topics (right), compact so the home page fits one screen.
const SEC: Record<string, [string, string, string, string]> = {
  jobs: ["💼", "Help Wanted", "အလုပ်အကိုင်", "#c0392b"], hundi: ["💸", "Hundi", "ဟွန်ဒီ", "#7c3aed"],
  rent: ["🏠", "Rent", "အိမ်ငှား", "#0891b2"], cargo: ["✈️", "Cargo", "ကုန်တင်ဆောင်", "#d97706"],
  goods: ["🛍️", "2nd Hand", "အသုံးချပစ္စည်း", "#16a34a"], biz: ["🏪", "Business", "လုပ်ငန်း", "#9d174d"],
};
const BROWN = "#8d5a2b";

export default function Latest({ onOpen }: { onOpen: (tab: string) => void }) {
  const { lang, version, user, openLogin } = useApp();
  const mm = lang === "mm";
  const [items, setItems] = useState<store.Listing[]>([]);
  const [topics, setTopics] = useState<store.Topic[]>([]);
  const [newCount, setNewCount] = useState(0);
  useEffect(() => {
    Promise.all([store.fetchListings().catch(() => []), store.fetchTopics().catch(() => [])]).then(([l, t]) => {
      setItems(l.slice(0, 8)); setTopics(t.slice(0, 4));
      setNewCount(l.filter((x) => isNew(x.created_at)).length + t.filter((x) => isNew(x.created_at)).length);
    });
  }, [version]);
  return (
    <div className="mn-latest" style={{ display: "grid", gridTemplateColumns: "minmax(0,2.2fr) minmax(0,1fr)", gap: 10 }}>
      <style>{`@media (max-width:760px){.mn-latest{grid-template-columns:1fr!important}.mn-latest-grid{grid-template-columns:1fr!important}}`}</style>
      <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", boxShadow: "0 3px 12px rgba(0,0,0,0.06)", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontWeight: 900, fontSize: 15, color: THEME.greenDark }}>🆕 {mm ? "နောက်ဆုံးတင်ထားသည်များ" : "Latest on MyanNet"}</div>
          {newCount > 0 && <div style={{ fontSize: 11, color: "#713f12", background: "#fef9c3", borderRadius: 10, padding: "2px 8px", fontWeight: 700 }}>{mm ? `ယခုအပတ် အသစ် ${newCount}` : `${newCount} new this week`}</div>}
        </div>
        {!items.length && <div style={{ fontSize: 13, color: "#888", padding: 10 }}>{mm ? "ပို့စ် မရှိသေးပါ။" : "No posts yet."}</div>}
        <div className="mn-latest-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 6 }}>
          {items.map((l) => {
            const s = SEC[l.pillar] || ["📌", l.pillar, l.pillar, THEME.green];
            return (
              <div key={l.id} onClick={() => onOpen(l.pillar)} style={{ borderLeft: `3px solid ${s[3]}`, background: "#fafcfa", borderRadius: 8, padding: "6px 9px", cursor: "pointer", minWidth: 0, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 6, fontSize: 10.5 }}>
                  <span style={{ color: s[3], fontWeight: 800 }}>{s[0]} {mm ? s[2] : s[1]}</span>
                  <span style={{ color: "#888", whiteSpace: "nowrap" }}>{isNew(l.created_at) && <b style={{ color: "#a16207" }}>🆕 </b>}{ago(l.created_at, lang)}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 12.5, color: "#1f2a20", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                <div style={{ fontSize: 10.5, color: "#777", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>📍 {[l.city, l.country].filter(Boolean).join(", ")}{l.price ? " · " + l.price : ""}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", boxShadow: "0 3px 12px rgba(0,0,0,0.06)", borderTop: `3px solid ${BROWN}`, display: "flex", flexDirection: "column" }}>
        <div onClick={() => onOpen("zayat")} style={{ fontWeight: 900, fontSize: 15, color: BROWN, marginBottom: 2, cursor: "pointer" }}>💬 {mm ? "မြန်နက် ဟစ်တိုင်" : "MyanNet Podium"} ›</div>
        <div style={{ fontSize: 11, color: "#8a7a6a", marginBottom: 8 }}>{mm ? "မေးမြန်း၊ မျှဝေ၊ အချင်းချင်း ကူညီကြပါ" : "Ask, share tips and help each other"}</div>
        {topics.map((t) => (
          <div key={t.id} onClick={() => onOpen("zayat")} style={{ padding: "6px 8px", borderRadius: 8, background: "#faf6f0", marginBottom: 5, cursor: "pointer" }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: "#2b1d10", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{isNew(t.created_at) && "🆕 "}{t.title}</div>
            <div style={{ fontSize: 10.5, color: "#888" }}>💬 {t.reply_count} · {ago(t.last_activity || t.created_at, lang)}</div>
          </div>
        ))}
        <button onClick={() => (user ? onOpen("zayat") : openLogin())} style={{ marginTop: "auto", background: BROWN, color: "#fff", border: "none", borderRadius: 10, padding: "7px", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
          {mm ? "+ ခေါင်းစဉ်အသစ် စတင်ရန်" : "+ Start a topic"}
        </button>
      </div>
    </div>
  );
}

// Eye-catching pill at the top of the home page: "🆕 16 new posts this week".
export function NewBanner({ lang }: { lang: string }) {
  const { version } = useApp();
  const [n, setN] = useState(0);
  useEffect(() => {
    Promise.all([store.fetchListings().catch(() => []), store.fetchTopics().catch(() => [])])
      .then(([l, t]) => setN(l.filter((x) => isNew(x.created_at)).length + t.filter((x) => isNew(x.created_at)).length));
  }, [version]);
  if (!n) return null;
  const mm = lang === "mm";
  return (
    <button onClick={() => document.getElementById("mn-latest")?.scrollIntoView({ behavior: "smooth", block: "center" })}
      style={{ background: "#fde047", color: "#713f12", border: "none", borderRadius: 22, padding: "8px 18px", fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(234,179,8,0.35)", animation: "mnPulse 2s ease-in-out 3" }}>
      <style>{`@keyframes mnPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}`}</style>
      🆕 {mm ? `ယခုအပတ် ပို့စ်အသစ် ${n} ခု` : `${n} new posts this week`}
    </button>
  );
}
