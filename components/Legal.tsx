import React from "react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: "#f4faf4", minHeight: "100vh", color: "#1f2a20" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #d9e7da", padding: "14px 18px" }}>
        <a href="/" style={{ color: "#1b5e20", fontWeight: 900, fontSize: 17, textDecoration: "none" }}>← MyanNet | မြန်နက်</a>
      </div>
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 18px 60px", lineHeight: 1.75, fontSize: 15 }}>
        <h1 style={{ color: "#1b5e20", marginBottom: 4 }}>{title}</h1>
        <div style={{ color: "#778", fontSize: 13, marginBottom: 24 }}>Last updated {updated}</div>
        {children}
      </main>
    </div>
  );
}
