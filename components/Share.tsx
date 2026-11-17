"use client";
import { useState } from "react";

// Share the clean MyanNet link (never the address bar, which can hold login keys).
const URL_ = "https://www.myannet.app";
export default function Share({ lang }: { lang: string }) {
  const [copied, setCopied] = useState(false);
  const text = lang === "mm"
    ? "မြန်နက် — မည်သည့်နေရာမဆို မြန်မာများအတွက် အခမဲ့ ဝန်ဆောင်မှုများ (အလုပ်၊ ငွေလွှဲ၊ အခန်းငှား၊ ပစ္စည်းသယ်၊ အရောင်းအဝယ်)"
    : "MyanNet — free all-in-one services for Myanmar and Burmese people anywhere (jobs, send money, rooms, hand-carry, buy & sell)";
  const enc = encodeURIComponent;
  const links: [string, string, string][] = [
    ["Facebook", "#1877f2", `https://www.facebook.com/sharer/sharer.php?u=${enc(URL_)}`],
    ["Viber", "#7360f2", `viber://forward?text=${enc(text + " " + URL_)}`],
    ["Telegram", "#229ed9", `https://t.me/share/url?url=${enc(URL_)}&text=${enc(text)}`],
    ["WhatsApp", "#25d366", `https://wa.me/?text=${enc(text + " " + URL_)}`],
  ];
  const btn = (bg: string): React.CSSProperties => ({ background: bg, color: "#fff", border: "none", borderRadius: 18, padding: "6px 12px", fontWeight: 700, fontSize: 12, cursor: "pointer", textDecoration: "none", display: "inline-block" });
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", alignItems: "center", marginTop: 14 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#556" }}>{lang === "mm" ? "မျှဝေရန်:" : "Share MyanNet:"}</span>
      {links.map(([n, c, href]) => <a key={n} href={href} target="_blank" rel="noreferrer" style={btn(c)}>{n}</a>)}
      <button style={btn("#555")} onClick={async () => { try { await navigator.clipboard.writeText(URL_); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} }}>
        {copied ? (lang === "mm" ? "✓ ကူးပြီး" : "✓ Copied") : (lang === "mm" ? "🔗 လင့်ခ်ကူးရန်" : "🔗 Copy link")}
      </button>
    </div>
  );
}
