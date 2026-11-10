"use client";
import { useEffect, useState } from "react";
import { S } from "@/lib/i18n";
import { useApp } from "@/lib/ctx";
import * as store from "@/lib/store";
import { Modal, THEME } from "./ui";

// Asked once, right after someone's first sign-in: are they offering, looking, or just browsing/testing?
export default function Welcome() {
  const { user, lang, openPost } = useApp();
  const s = S[lang] as any;
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(!!user && !store.knownIntent(user)); }, [user]);
  if (!open || !user) return null;

  const pick = async (intent: string) => {
    await store.setIntent(user, intent);
    setOpen(false);
    if (intent === "offer") openPost();
    if (intent === "seek") document.getElementById("mn-pillars-home")?.scrollIntoView({ behavior: "smooth" });
  };

  const opt = (intent: string, [icon, title, sub]: string[]) => (
    <button key={intent} onClick={() => pick(intent)}
      style={{ display: "flex", gap: 14, alignItems: "center", width: "100%", textAlign: "left", background: THEME.greenSoft, border: `1px solid ${THEME.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer", fontFamily: "inherit" }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 800, fontSize: 15, color: THEME.greenText }}>{title}</span>
        <span style={{ display: "block", fontSize: 12, color: "#667", marginTop: 2, lineHeight: 1.5 }}>{sub}</span>
      </span>
    </button>
  );

  return (
    <Modal onClose={() => pick("browse")} width={440}>
      <div style={{ fontSize: 13, color: THEME.green, fontWeight: 700, marginBottom: 4 }}>👋 {user.name}</div>
      <div style={{ fontWeight: 900, fontSize: 19, color: THEME.greenText, marginBottom: 4 }}>{s.welcomeQ}</div>
      <div style={{ fontSize: 13, color: "#667", marginBottom: 16 }}>{s.welcomeSub}</div>
      {opt("offer", s.intentOffer)}
      {opt("seek", s.intentSeek)}
      {opt("browse", s.intentBrowse)}
    </Modal>
  );
}
