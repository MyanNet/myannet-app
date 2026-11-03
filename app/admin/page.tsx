"use client";
import { useEffect, useState } from "react";
import * as store from "@/lib/store";
import { LIVE } from "@/lib/supabase";

// Admin page: reported listings and reviews, with remove / dismiss buttons.
// Only people with is_admin = true in Supabase can read reports (enforced by the database).
export default function Admin() {
  const [user, setUser] = useState<store.AppUser | null | undefined>(undefined);
  const [reports, setReports] = useState<store.Report[]>([]);
  const [listings, setListings] = useState<Record<string, store.Listing | null>>({});
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const r = await store.fetchReports();
      setReports(r);
      const m: Record<string, store.Listing | null> = {};
      for (const id of Array.from(new Set(r.map((x) => x.listing_id)))) m[id] = id.startsWith("s-") ? null : await store.getListing(id);
      setListings(m);
    } catch (e) { setErr((e as Error).message); }
  };
  useEffect(() => { store.getUser().then((u) => { setUser(u); if (u?.is_admin) load(); }); }, []);

  const box: React.CSSProperties = { background: "#fff", border: "1px solid #d9e7da", borderRadius: 12, padding: 14, marginBottom: 10 };
  const btn = (bg: string): React.CSSProperties => ({ background: bg, color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontWeight: 700, cursor: "pointer", fontSize: 12, marginRight: 8 });

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: "#f4faf4", minHeight: "100vh", padding: "20px 16px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <a href="/" style={{ color: "#1b5e20", fontWeight: 900, textDecoration: "none" }}>← MyanNet</a>
        <h1 style={{ color: "#1b5e20" }}>Admin · Reports</h1>
        {!LIVE && <p style={{ fontSize: 13, color: "#7a5b00" }}>Demo mode: showing reports made in this browser only.</p>}
        {user === undefined && <p>Loading…</p>}
        {user === null && <p>Please sign in on the home page first.</p>}
        {user && !user.is_admin && <p>Your account is not an admin. In Supabase, set is_admin = true on your profile.</p>}
        {err && <p style={{ color: "#c0392b" }}>{err}</p>}
        {user?.is_admin && !reports.length && <p>No open reports. 🎉</p>}
        {reports.map((r) => {
          const l = listings[r.listing_id];
          return (
            <div key={r.id} style={box}>
              <div style={{ fontSize: 12, color: "#888" }}>{new Date(r.created_at).toLocaleString()} · {r.review_id ? "review" : "listing"} · {r.listing_id}</div>
              <div style={{ fontWeight: 800, margin: "4px 0" }}>{l ? l.title : r.listing_id.startsWith("s-") ? "Sample listing" : "(listing removed)"}</div>
              {l && <div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>by {l.author_name} · {l.description.slice(0, 160)}</div>}
              <div style={{ fontSize: 13, background: "#fdecea", borderRadius: 8, padding: 8, marginBottom: 8 }}>Reason: {r.reason || "(none given)"}</div>
              {r.review_id && <button style={btn("#c0392b")} onClick={async () => { await store.deleteReview(r.review_id!); await store.clearReport(r.id); load(); }}>Remove review</button>}
              {!r.review_id && l && <button style={btn("#c0392b")} onClick={async () => { await store.deleteListing(l.id); await store.clearReport(r.id); load(); }}>Remove listing</button>}
              <button style={btn("#2e7d32")} onClick={async () => { await store.clearReport(r.id); load(); }}>Dismiss</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
