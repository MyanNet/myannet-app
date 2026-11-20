"use client";
import { useEffect } from "react";
// Counts a visit to a standalone page (same as the home page's counter).
export default function Track({ section }: { section: string }) {
  useEffect(() => {
    try {
      if (localStorage.getItem("mn_is_admin") || navigator.webdriver) return;
      let v = localStorage.getItem("mn_vid");
      if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("mn_vid", v); }
      fetch("/api/track", { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ v, s: section, r: document.referrer, q: window.location.search }) }).catch(() => {});
    } catch {}
  }, [section]);
  return null;
}
