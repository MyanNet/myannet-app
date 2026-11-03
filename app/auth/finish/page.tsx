"use client";
import { useEffect, useState } from "react";
import { finishWithToken } from "@/lib/store";

// Exchanges the one-time token from TikTok sign-in for a session, then goes home.
export default function Finish() {
  const [msg, setMsg] = useState("Signing you in… / ဝင်ရောက်နေသည်…");
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1)).get("token_hash");
    if (!hash) { setMsg("Sign-in link is missing or expired."); return; }
    finishWithToken(hash)
      .then(() => window.location.replace("/?welcome=1"))
      .catch((e) => setMsg("Sign-in failed: " + e.message));
  }, []);
  return <div style={{ fontFamily: "system-ui,sans-serif", padding: 40, textAlign: "center", color: "#24452a" }}>{msg}</div>;
}
