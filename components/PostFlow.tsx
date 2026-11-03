"use client";
import { useState } from "react";
import { S } from "@/lib/i18n";
import { useApp } from "@/lib/ctx";
import * as store from "@/lib/store";
import { Modal, Btn, inputStyle, THEME } from "./ui";

// Each post type maps to one of the site's sections ("pillars").
export const TYPE_TO_PILLAR: Record<string, string> = {
  biz: "biz", ad: "biz", card: "biz", jobs: "jobs", rent: "rent", hundi: "hundi", cargo: "cargo", goods: "goods",
};
const TYPE_ORDER = ["biz", "ad", "card", "jobs", "rent", "hundi", "cargo", "goods"];
const COUNTRIES = ["USA", "Myanmar", "Thailand", "Malaysia", "Japan", "Singapore", "South Korea", "India", "Other"];
const CONTACT_FIELDS: [keyof store.Contact, string][] = [
  ["facebook", "cFacebook"], ["tiktok", "cTiktok"], ["telegram", "cTelegram"],
  ["viber", "cViber"], ["whatsapp", "cWhatsapp"], ["phone", "cPhone"],
];

export default function PostFlow({ initialType, onClose }: { initialType?: string; onClose: () => void }) {
  const { lang, user, refresh } = useApp();
  const s = S[lang];
  const [type, setType] = useState<string | undefined>(initialType);
  const [kind, setKind] = useState("offer");
  const [f, setF] = useState({ title: "", description: "", country: "USA", city: "", price: "" });
  const [contact, setContact] = useState<store.Contact>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const twoWay = type === "jobs" || type === "rent" || type === "cargo";
  const kinds = type === "cargo" ? ["carry", "need"] : ["offer", "seek"];

  const submit = async () => {
    if (!user || !type) return;
    if (f.title.trim().length < 3) return setErr(s.needTitle);
    const c = Object.fromEntries(Object.entries(contact).filter(([, v]) => v && v.trim())) as store.Contact;
    if (!Object.keys(c).length) return setErr(s.needContact);
    setBusy(true); setErr("");
    try {
      await store.createListing(user, {
        pillar: TYPE_TO_PILLAR[type],
        kind: twoWay ? kind : type,
        title: f.title.trim(), description: f.description.trim(), country: f.country, city: f.city.trim(),
        price: f.price.trim() || null, contact: c,
      });
      setDone(true); refresh();
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };

  if (done) return (
    <Modal onClose={onClose} width={420}>
      <div style={{ textAlign: "center", padding: "18px 0" }}>
        <div style={{ fontSize: 52 }}>🎉</div>
        <div style={{ fontWeight: 900, fontSize: 19, color: THEME.green, margin: "8px 0 18px" }}>{s.posted}</div>
        <Btn bg={THEME.green} onClick={() => { setDone(false); setType(undefined); setF({ title: "", description: "", country: "USA", city: "", price: "" }); setContact({}); }} style={{ marginBottom: 8 }}>{s.postAnother}</Btn>
        <Btn bg="#eef2ee" color="#444" onClick={onClose}>{s.close}</Btn>
      </div>
    </Modal>
  );

  if (!type) return (
    <Modal onClose={onClose} width={520}>
      <div style={{ fontWeight: 900, fontSize: 19, color: THEME.greenText, marginBottom: 4 }}>{s.whatShare}</div>
      <div style={{ fontSize: 13, color: "#667", marginBottom: 16 }}>{s.whatShareSub}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
        {TYPE_ORDER.map((k) => (
          <button key={k} onClick={() => setType(k)} style={{ background: THEME.greenSoft, border: `1px solid ${THEME.border}`, borderRadius: 14, padding: "14px 10px", cursor: "pointer", textAlign: "center", fontFamily: "inherit" }}>
            <div style={{ fontSize: 26 }}>{s.types[k][0]}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: THEME.greenText, marginTop: 6, lineHeight: 1.4 }}>{s.types[k][1]}</div>
          </button>
        ))}
      </div>
    </Modal>
  );

  const lbl = (t: string) => <div style={{ fontSize: 12, fontWeight: 700, color: "#555", margin: "10px 0 4px" }}>{t}</div>;
  return (
    <Modal onClose={onClose} width={520}>
      <div style={{ fontWeight: 900, fontSize: 18, color: THEME.greenText, marginBottom: 6 }}>{s.types[type][0]} {s.types[type][1]}</div>
      {twoWay && <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
        {kinds.map((k, i) => (
          <button key={k} onClick={() => setKind(k)} style={{ flex: 1, padding: 9, borderRadius: 10, border: `2px solid ${kind === k ? THEME.green : "#ddd"}`, background: kind === k ? THEME.greenSoft : "#fff", fontWeight: 700, cursor: "pointer", color: THEME.greenText, fontFamily: "inherit" }}>
            {i === 0 ? s.kindOffer : s.kindSeek}
          </button>
        ))}
      </div>}
      {lbl(s.title + " *")}
      <input value={f.title} maxLength={120} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder={s.titlePh} style={inputStyle} />
      {lbl(s.desc)}
      <textarea value={f.description} maxLength={2000} rows={4} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder={s.descPh} style={{ ...inputStyle, resize: "vertical" }} />
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>{lbl(s.country)}
          <select value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} style={inputStyle}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select>
        </div>
        <div style={{ flex: 1 }}>{lbl(s.city)}<input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} style={inputStyle} /></div>
      </div>
      {lbl(s.price)}
      <input value={f.price} maxLength={60} onChange={(e) => setF({ ...f, price: e.target.value })} placeholder={s.pricePh} style={inputStyle} />
      <div style={{ fontSize: 13, fontWeight: 800, color: THEME.greenText, margin: "16px 0 4px" }}>{s.contactTitle}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0 10px" }}>
        {CONTACT_FIELDS.map(([k, labelKey]) => (
          <div key={k}>{lbl((s as any)[labelKey])}
            <input value={contact[k] || ""} onChange={(e) => setContact({ ...contact, [k]: e.target.value })} style={inputStyle} />
          </div>
        ))}
      </div>
      {err && <div style={{ color: THEME.red, fontSize: 12, marginTop: 12 }}>{err}</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        <Btn bg="#eef2ee" color="#444" onClick={() => setType(undefined)} style={{ flex: 1 }}>← {s.back}</Btn>
        <Btn bg={THEME.green} onClick={submit} disabled={busy} style={{ flex: 2 }}>{busy ? s.publishing : s.publish}</Btn>
      </div>
    </Modal>
  );
}
