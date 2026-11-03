"use client";
import { useEffect, useState } from "react";
import { S } from "@/lib/i18n";
import { useApp } from "@/lib/ctx";
import * as store from "@/lib/store";
import { ReviewBar } from "./Reviews";
import { Modal, Btn, THEME } from "./ui";

const KIND_LABEL: Record<string, [string, string]> = {
  offer: ["Offering", "ပေးဆောင်သည်"], seek: ["Looking for", "ရှာဖွေနေသည်"],
  carry: ["Can carry", "သယ်ပေးနိုင်"], need: ["Need carry", "သယ်ပေးသူလို"],
  biz: ["Business", "လုပ်ငန်း"], ad: ["Promotion", "ကြော်ငြာ"], card: ["Contact card", "ဆက်သွယ်ရန်ကတ်"],
  hundi: ["Agent", "ကိုယ်စားလှယ်"], goods: ["For sale", "ရောင်းရန်"],
};

const digits = (v: string) => v.replace(/[^\d+]/g, "");
const handle = (v: string) => v.trim().replace(/^@/, "");
function contactLinks(c: store.Contact) {
  const out: [string, string, string][] = [];
  if (c.facebook) out.push(["Facebook", "#1877f2", /^https?:/.test(c.facebook) ? c.facebook : `https://facebook.com/${handle(c.facebook)}`]);
  if (c.tiktok) out.push(["TikTok", "#000", `https://www.tiktok.com/@${handle(c.tiktok)}`]);
  if (c.telegram) out.push(["Telegram", "#229ED9", `https://t.me/${handle(c.telegram)}`]);
  if (c.viber) out.push(["Viber", "#7360f2", `viber://chat?number=${encodeURIComponent(digits(c.viber))}`]);
  if (c.whatsapp) out.push(["WhatsApp", "#25D366", `https://wa.me/${digits(c.whatsapp).replace(/^\+/, "")}`]);
  if (c.phone) out.push(["📞", "#555", `tel:${digits(c.phone)}`]);
  return out;
}

export function ListingCard({ l, color }: { l: store.Listing; color: string }) {
  const { lang } = useApp();
  const k = KIND_LABEL[l.kind];
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 18, boxShadow: "0 4px 14px rgba(0,0,0,0.06)", borderTop: `4px solid ${color}` }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {k && <span style={{ background: `${color}18`, color, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{lang === "mm" ? k[1] : k[0]}</span>}
        <span style={{ background: THEME.greenSoft, color: THEME.green, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>🆕 MyanNet</span>
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2, overflowWrap: "anywhere" }}>{l.title}</div>
      <div style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>📍 {[l.city, l.country].filter(Boolean).join(", ")} · 👤 {l.author_name}</div>
      {l.price && <div style={{ color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>💰 {l.price}</div>}
      {l.description && <div style={{ fontSize: 12, color: "#555", marginBottom: 8, lineHeight: 1.6, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{l.description}</div>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {contactLinks(l.contact).map(([label, bg, href]) => (
          <a key={label} href={href} target="_blank" rel="noreferrer noopener" style={{ background: bg, color: "#fff", borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>{label}</a>
        ))}
      </div>
      <ReviewBar id={l.id} title={l.title} />
    </div>
  );
}

// Community posts for one section, shown above the sample listings.
export function CommunityListings({ pillar, color }: { pillar: string; color: string }) {
  const { lang, version, user, openLogin, openPost } = useApp();
  const s = S[lang];
  const [items, setItems] = useState<store.Listing[] | null>(null);
  useEffect(() => { store.fetchListings(pillar).then(setItems).catch(() => setItems([])); }, [pillar, version]);
  const post = () => (user ? openPost(pillar) : openLogin());
  if (items === null) return null;
  if (!items.length) return (
    <div style={{ background: "#fff", border: `2px dashed ${THEME.border}`, borderRadius: 16, padding: 18, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
      <div style={{ fontSize: 13, color: "#667" }}>{s.beFirst}</div>
      <button onClick={post} style={{ background: THEME.green, color: "#fff", border: "none", borderRadius: 20, padding: "8px 18px", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>{s.postFree}</button>
    </div>
  );
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10, color: THEME.greenText }}>🆕 {s.fromCommunity}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(285px,1fr))", gap: 14 }}>
        {items.map((l) => <ListingCard key={l.id} l={l} color={color} />)}
      </div>
    </div>
  );
}

export function MyListings({ onClose }: { onClose: () => void }) {
  const { lang, user, refresh } = useApp();
  const s = S[lang];
  const [items, setItems] = useState<store.Listing[]>([]);
  const load = () => { if (user) store.myListings(user).then(setItems).catch(() => {}); };
  useEffect(load, [user]);
  const act = async (fn: () => Promise<void>) => { await fn(); load(); refresh(); };
  return (
    <Modal onClose={onClose} width={520}>
      <div style={{ fontWeight: 900, fontSize: 18, color: THEME.greenText, marginBottom: 14 }}>📋 {s.myListings}</div>
      {!items.length && <div style={{ fontSize: 13, color: "#777" }}>{s.noMine}</div>}
      {items.map((l) => (
        <div key={l.id} style={{ border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 12, marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{l.title}</div>
          <div style={{ fontSize: 11, color: "#888", margin: "2px 0 8px" }}>{l.pillar} · {new Date(l.created_at).toLocaleDateString()} {l.status === "closed" && `· ${s.closed}`}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn bg={THEME.greenSoft} color={THEME.greenText} style={{ padding: 8, fontSize: 12 }} onClick={() => act(() => store.setListingStatus(l.id, l.status === "active" ? "closed" : "active"))}>
              {l.status === "active" ? s.markClosed : s.reopen}
            </Btn>
            <Btn bg={THEME.redSoft} color={THEME.red} style={{ padding: 8, fontSize: 12 }} onClick={() => act(() => store.deleteListing(l.id))}>{s.delete}</Btn>
          </div>
        </div>
      ))}
    </Modal>
  );
}
