"use client";
import { useEffect, useRef, useState } from "react";
import { S } from "@/lib/i18n";
import { useApp } from "@/lib/ctx";
import { LIVE } from "@/lib/supabase";
import * as store from "@/lib/store";
import { Modal, Btn, inputStyle, THEME } from "./ui";

const TG_BOT = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;
const TIKTOK_ON = process.env.NEXT_PUBLIC_TIKTOK_ENABLED === "1";
// Sign-in methods switched on in Supabase, e.g. "facebook,whatsapp,phone,email". Others show "coming soon".
const ENABLED = (process.env.NEXT_PUBLIC_AUTH_PROVIDERS || "facebook").split(",").map((x) => x.trim());
const on = (m: string) => !LIVE || ENABLED.includes(m) || (m === "tiktok" && TIKTOK_ON) || (m === "telegram" && !!TG_BOT);
const CODES = [["+1", "🇺🇸 +1"], ["+95", "🇲🇲 +95"], ["+66", "🇹🇭 +66"], ["+60", "🇲🇾 +60"], ["+81", "🇯🇵 +81"], ["+65", "🇸🇬 +65"], ["+82", "🇰🇷 +82"], ["+91", "🇮🇳 +91"]];

type Mode = "menu" | "whatsapp" | "phone" | "email" | "telegram" | "tiktok";

export default function Login({ onClose }: { onClose: () => void }) {
  const { lang } = useApp();
  const s = S[lang];
  const [mode, setMode] = useState<Mode>("menu");
  const [cc, setCc] = useState("+1");
  const [num, setNum] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const tgBox = useRef<HTMLDivElement>(null);

  const fullPhone = cc + num.replace(/\D/g, "").replace(/^0+/, "");
  const run = async (fn: () => Promise<unknown> | unknown, closeAfter = false) => {
    setBusy(true); setErr("");
    try { await fn(); if (closeAfter) onClose(); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };

  // Telegram's official login widget, loaded only when the bot is configured.
  useEffect(() => {
    if (mode !== "telegram" || !LIVE || !TG_BOT || !tgBox.current) return;
    (window as any).onTelegramAuth = (u: Record<string, unknown>) => run(() => store.signInTelegram(u), true);
    const sc = document.createElement("script");
    sc.src = "https://telegram.org/js/telegram-widget.js?22";
    sc.async = true;
    sc.setAttribute("data-telegram-login", TG_BOT);
    sc.setAttribute("data-size", "large");
    sc.setAttribute("data-onauth", "onTelegramAuth(user)");
    sc.setAttribute("data-request-access", "write");
    tgBox.current.innerHTML = "";
    tgBox.current.appendChild(sc);
  }, [mode]);

  const pick = (m: Mode) => {
    setErr(""); setNote(""); setSent(false); setCode("");
    if (!LIVE && (m === "telegram" || m === "tiktok")) { store.demoSignIn(m); onClose(); return; }
    if (!on(m)) { setNote(m === "tiktok" ? s.tiktokPending : m === "telegram" ? s.telegramPending : s.comingSoon); return; }
    if (m === "tiktok") { store.signInTikTok(); return; }
    if (m === "telegram" && !TG_BOT) { setNote(s.telegramPending); return; }
    setMode(m);
  };

  const big = (bg: string, icon: React.ReactNode, label: string, onClick: () => void, color = "#fff") => (
    <Btn bg={bg} color={color} onClick={onClick} disabled={busy} style={{ marginBottom: 10, justifyContent: "flex-start", paddingLeft: 18 }}>
      <span style={{ width: 22, textAlign: "center", fontSize: 17 }}>{icon}</span><span>{label}</span>
    </Btn>
  );

  return (
    <Modal onClose={onClose} width={400}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontSize: 30, marginBottom: 4 }}>🇲🇲</div>
        <div style={{ fontWeight: 900, fontSize: 19, color: THEME.greenText }}>{s.signInTitle}</div>
        <div style={{ fontSize: 13, color: "#667", marginTop: 4, lineHeight: 1.6 }}>{s.signInSub}</div>
      </div>

      {!LIVE && <div style={{ background: "#fff8e1", border: "1px solid #f3d27a", borderRadius: 10, padding: 10, fontSize: 11, color: "#7a5b00", marginBottom: 14, lineHeight: 1.5 }}>{s.demoBanner}</div>}

      {mode === "menu" && <>
        {big("#1877f2", <b>f</b>, s.fb, () => (on("facebook") ? run(store.signInFacebook, !LIVE) : setNote(s.comingSoon)))}
        {big("#000", "♪", s.tiktok, () => pick("tiktok"))}
        {big("#229ED9", "✈", s.telegram, () => pick("telegram"))}
        {big("#25D366", "🟢", s.whatsapp, () => pick("whatsapp"))}
        {big("#7360f2", "📱", s.phoneViber, () => pick("phone"))}
        <div style={{ textAlign: "center", margin: "6px 0 2px" }}>
          <span onClick={() => pick("email")} style={{ fontSize: 13, color: THEME.green, cursor: "pointer", fontWeight: 700 }}>✉️ {s.email}</span>
        </div>
        {note && <div style={{ background: THEME.greenSoft, borderRadius: 10, padding: 10, fontSize: 12, color: THEME.greenText, marginTop: 10 }}>{note}</div>}
      </>}

      {(mode === "whatsapp" || mode === "phone") && <>
        {!sent ? <>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6 }}>{s.phoneLabel}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <select value={cc} onChange={(e) => setCc(e.target.value)} style={{ ...inputStyle, width: 110 }}>
              {CODES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <input value={num} onChange={(e) => setNum(e.target.value)} inputMode="tel" placeholder="812 345 6789" style={inputStyle} />
          </div>
          <Btn bg={mode === "whatsapp" ? "#25D366" : "#7360f2"} disabled={busy || num.replace(/\D/g, "").length < 6}
            onClick={() => run(async () => { await store.sendPhoneCode(fullPhone, mode === "whatsapp" ? "whatsapp" : "sms"); setSent(true); })}>
            {s.sendCode}
          </Btn>
        </> : <>
          <div style={{ background: THEME.greenSoft, borderRadius: 10, padding: 10, fontSize: 12, color: THEME.greenText, marginBottom: 10, textAlign: "center" }}>
            {mode === "whatsapp" ? s.codeSentWa : s.codeSentSms} {fullPhone}
            {!LIVE && <div style={{ fontSize: 11, color: "#7a5b00", marginTop: 4 }}>{s.demoCode}</div>}
          </div>
          <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} maxLength={6} inputMode="numeric" placeholder="••••••"
            style={{ ...inputStyle, fontSize: 24, textAlign: "center", letterSpacing: 8, marginBottom: 10 }} />
          <Btn disabled={busy || code.length < 6} onClick={() => run(() => store.verifyPhoneCode(fullPhone, code, mode), true)}>{s.verify}</Btn>
        </>}
      </>}

      {mode === "email" && <>
        {note ? <div style={{ background: THEME.greenSoft, borderRadius: 10, padding: 12, fontSize: 13, color: THEME.greenText, textAlign: "center" }}>{note}</div> : <>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={s.emailPh} style={{ ...inputStyle, marginBottom: 10 }} />
          <Btn disabled={busy || !email.includes("@")} onClick={() => run(async () => { await store.sendEmailLink(email); if (LIVE) setNote(s.emailSent); else onClose(); })}>{s.sendLink}</Btn>
        </>}
      </>}

      {mode === "telegram" && <div ref={tgBox} style={{ display: "flex", justifyContent: "center", minHeight: 48 }} />}

      {err && <div style={{ color: THEME.red, fontSize: 12, marginTop: 10, textAlign: "center" }}>{err}</div>}
      {mode !== "menu" && <div onClick={() => { setMode("menu"); setErr(""); setNote(""); }} style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#888", cursor: "pointer" }}>← {s.back}</div>}

      <div style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 16, lineHeight: 1.7 }}>
        {s.agree} <a href="/terms" style={{ color: THEME.green }}>{s.terms}</a> {s.and} <a href="/privacy" style={{ color: THEME.green }}>{s.privacy}</a>.
      </div>
    </Modal>
  );
}
