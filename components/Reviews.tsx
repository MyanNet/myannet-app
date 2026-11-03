"use client";
import { useCallback, useEffect, useState } from "react";
import { S } from "@/lib/i18n";
import { useApp } from "@/lib/ctx";
import * as store from "@/lib/store";
import { Modal, Btn, Stars, inputStyle, THEME } from "./ui";

// Compact stars + review count shown on every listing card; opens the full review panel.
export function ReviewBar({ id, title }: { id: string; title: string }) {
  const { lang, version } = useApp();
  const s = S[lang];
  const [list, setList] = useState<store.Review[]>([]);
  const [open, setOpen] = useState(false);
  const load = useCallback(() => { store.fetchReviews(id).then(setList).catch(() => {}); }, [id]);
  useEffect(load, [load, version]);
  const sum = store.summarize(list);
  return <>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
      <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0, fontFamily: "inherit" }}>
        <Stars value={sum.avg} size={14} />
        <span style={{ fontSize: 11, color: "#667" }}>{sum.ratings ? sum.avg.toFixed(1) + " · " : ""}{list.length ? `💬 ${list.length}` : s.writeReview}</span>
      </button>
      <ReportLink listingId={id} />
    </div>
    {open && <ReviewPanel id={id} title={title} list={list} onChange={load} onClose={() => setOpen(false)} />}
  </>;
}

export function ReportLink({ listingId, reviewId }: { listingId: string; reviewId?: string }) {
  const { lang, user, openLogin } = useApp();
  const s = S[lang];
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  if (sent) return <span style={{ fontSize: 11, color: "#999" }}>✓ {s.reported}</span>;
  return <>
    <button onClick={() => (user ? setOpen(true) : openLogin())} style={{ background: "none", border: "none", color: "#999", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>⚑ {s.report}</button>
    {open && <Modal onClose={() => setOpen(false)} width={380}>
      <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>⚑ {s.report}</div>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} maxLength={500} placeholder={s.reportPh} style={{ ...inputStyle, marginBottom: 10 }} />
      {err && <div style={{ color: THEME.red, fontSize: 12, marginBottom: 8 }}>{err}</div>}
      <Btn onClick={async () => { try { await store.report(listingId, reason, reviewId); setSent(true); setOpen(false); } catch (e) { setErr((e as Error).message); } }}>{s.submit}</Btn>
    </Modal>}
  </>;
}

function ReviewPanel({ id, title, list, onChange, onClose }: { id: string; title: string; list: store.Review[]; onChange: () => void; onClose: () => void }) {
  const { lang, user, openLogin } = useApp();
  const s = S[lang];
  const [stars, setStars] = useState(0);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const sum = store.summarize(list);

  const submit = async () => {
    if (!user) return openLogin();
    if (!stars && !body.trim()) return;
    setBusy(true); setErr("");
    try { await store.addReview(user, id, stars || null, body.trim()); setStars(0); setBody(""); onChange(); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <Modal onClose={onClose} width={480}>
      <div style={{ fontWeight: 900, fontSize: 17, color: THEME.greenText, paddingRight: 24 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0 16px" }}>
        <Stars value={sum.avg} size={18} />
        <span style={{ fontSize: 13, color: "#555" }}>{sum.ratings ? `${sum.avg.toFixed(1)} / 5 · ${sum.ratings}` : s.noReviews}</span>
      </div>

      <div style={{ background: THEME.greenSoft, borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>{s.writeReview}</div>
        {user ? <>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{s.yourRating}</div>
          <Stars value={stars} onChange={setStars} size={26} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={1000} placeholder={s.commentPh} style={{ ...inputStyle, margin: "10px 0" }} />
          {err && <div style={{ color: THEME.red, fontSize: 12, marginBottom: 8 }}>{err}</div>}
          <Btn bg={THEME.green} disabled={busy || (!stars && !body.trim())} onClick={submit}>{s.submit}</Btn>
        </> : <Btn bg={THEME.green} onClick={openLogin}>{s.signInToReview}</Btn>}
      </div>

      {list.map((r) => (
        <div key={r.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{r.author_name || "Member"} {r.stars ? <Stars value={r.stars} size={12} /> : null}</div>
            <div style={{ fontSize: 10, color: "#aaa" }}>{new Date(r.created_at).toLocaleDateString()}</div>
          </div>
          {r.body && <div style={{ fontSize: 13, color: "#444", marginTop: 4, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{r.body}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <ReportLink listingId={id} reviewId={r.id} />
            {user && (user.id === r.user_id || user.is_admin) && (
              <button onClick={async () => { await store.deleteReview(r.id); onChange(); }} style={{ background: "none", border: "none", color: THEME.red, fontSize: 11, cursor: "pointer" }}>{s.delete}</button>
            )}
          </div>
        </div>
      ))}
    </Modal>
  );
}
