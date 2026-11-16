"use client";
import { useCallback, useEffect, useState } from "react";
import { useApp } from "@/lib/ctx";
import * as store from "@/lib/store";
import { Modal, Btn, inputStyle, THEME } from "./ui";
import { ReportLink } from "./Reviews";

// MyanNet Zayat (ဇရပ်): community discussion. Business and community help only — no politics.
const BROWN = "#8d5a2b";
const CATS = ["ask", "business", "city", "help", "announce", "general"];

const Z = {
  en: {
    title: "🛖 MyanNet Zayat",
    sub: "Ask questions, share tips and help each other — Myanmar people everywhere.",
    start: "+ Start a topic", all: "All",
    cats: { ask: "❓ Ask & Advice", business: "💼 Business & Work", city: "📍 Local / By City", help: "🤝 Help Needed", announce: "📣 Announcements", general: "☕ General Chat" },
    rulesTitle: "Zayat rules",
    rules: [
      "Talk about work, business, services and daily life abroad.",
      "No political discussion — MyanNet is a business and community-help space.",
      "Be respectful: no insults, hate or harassment.",
      "No scams, no asking for money, and don't share other people's private information.",
      "To sell or advertise, post in the listing sections instead.",
      "Posts that break these rules are removed. Use ⚑ Report to tell us.",
    ],
    noTopics: "No topics yet — be the first to start one!",
    cat: "Category", titleL: "Title", titlePh: "e.g. Where can I find a Burmese grocery in Houston?",
    body: "Details", bodyPh: "Add more details (optional)",
    city: "City / country (optional)", post: "Post topic",
    agree: "By posting you agree to the Zayat rules above.",
    replies: "replies", replyPh: "Write a reply…", send: "Reply", noReplies: "No replies yet.",
    signIn: "Sign in to join the discussion", del: "Delete", confirmDel: "Delete this topic and its replies?",
    by: "by",
  },
  mm: {
    title: "🛖 မြန်နက် ဇရပ်",
    sub: "မေးမြန်းပါ၊ အတွေ့အကြုံမျှဝေပါ၊ အချင်းချင်း ကူညီကြပါ — နေရာတိုင်းရှိ မြန်မာများအတွက်။",
    start: "+ ခေါင်းစဉ်အသစ် စတင်ရန်", all: "အားလုံး",
    cats: { ask: "❓ မေးမြန်း / အကြံဉာဏ်", business: "💼 လုပ်ငန်း / အလုပ်", city: "📍 မြို့အလိုက်", help: "🤝 အကူအညီလိုသည်", announce: "📣 ကြေညာချက်", general: "☕ အထွေထွေ" },
    rulesTitle: "ဇရပ် စည်းကမ်းများ",
    rules: [
      "အလုပ်၊ လုပ်ငန်း၊ ဝန်ဆောင်မှုနှင့် နိုင်ငံခြားနေထိုင်မှုဆိုင်ရာ အကြောင်းအရာများကို ဆွေးနွေးပါ။",
      "နိုင်ငံရေး ဆွေးနွေးချက်များ မတင်ပါနှင့် — မြန်နက်သည် စီးပွားရေးနှင့် အပြန်အလှန်ကူညီရေး နေရာဖြစ်သည်။",
      "လေးစားစွာ ပြောဆိုပါ — စော်ကားခြင်း၊ အမုန်းစကားနှင့် နှောင့်ယှက်ခြင်း မပြုရ။",
      "လိမ်လည်ခြင်း၊ ငွေတောင်းခြင်း မပြုရ၊ အခြားသူ၏ ကိုယ်ရေးအချက်အလက်များကို မမျှဝေရ။",
      "ရောင်းချ/ကြော်ငြာလိုပါက သက်ဆိုင်ရာ ကဏ္ဍတွင် တင်ပါ။",
      "စည်းကမ်းချိုးဖောက်သော ပို့စ်များကို ဖယ်ရှားပါမည်။ ⚑ တိုင်ကြားရန် ကိုနှိပ်၍ အသိပေးပါ။",
    ],
    noTopics: "ခေါင်းစဉ် မရှိသေးပါ — ပထမဆုံး စတင်လိုက်ပါ!",
    cat: "အမျိုးအစား", titleL: "ခေါင်းစဉ်", titlePh: "ဥပမာ - Houston တွင် မြန်မာကုန်စုံဆိုင် ဘယ်မှာရှိလဲ?",
    body: "အသေးစိတ်", bodyPh: "အသေးစိတ် ထပ်ရေးပါ (မဖြစ်မနေ မဟုတ်)",
    city: "မြို့ / နိုင်ငံ (မဖြစ်မနေ မဟုတ်)", post: "ခေါင်းစဉ် တင်ရန်",
    agree: "တင်ခြင်းဖြင့် အထက်ပါ ဇရပ် စည်းကမ်းများကို သဘောတူပါသည်။",
    replies: "ပြန်စာ", replyPh: "ပြန်စာ ရေးရန်…", send: "ပြန်စာပို့ရန်", noReplies: "ပြန်စာ မရှိသေးပါ။",
    signIn: "ဆွေးနွေးရန် ဝင်ရောက်ပါ", del: "ဖျက်ရန်", confirmDel: "ဤခေါင်းစဉ်နှင့် ပြန်စာများကို ဖျက်မလား?",
    by: "",
  },
};

const when = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

function Rules({ z }: { z: typeof Z.en }) {
  return (
    <details style={{ background: "#fff8ee", border: "1px solid #f0dcc0", borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#5b3a1a" }}>
      <summary style={{ fontWeight: 800, cursor: "pointer" }}>📜 {z.rulesTitle}</summary>
      <ol style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.7 }}>{z.rules.map((r) => <li key={r}>{r}</li>)}</ol>
    </details>
  );
}

export default function Zayat() {
  const { lang, user, openLogin, version, refresh } = useApp();
  const z = Z[lang === "mm" ? "mm" : "en"];
  const [cat, setCat] = useState("");
  const [topics, setTopics] = useState<store.Topic[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [composing, setComposing] = useState(false);
  const [open, setOpen] = useState<store.Topic | null>(null);

  const load = useCallback(() => {
    store.fetchTopics(cat || undefined).then((t) => { setTopics(t); setLoaded(true); }).catch(() => setLoaded(true));
  }, [cat]);
  useEffect(load, [load, version]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "18px 16px" }}>
      <div style={{ background: `linear-gradient(135deg,#b07a45,${BROWN})`, color: "#fff", borderRadius: 18, padding: "20px 18px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 21 }}>{z.title}</div>
          <div style={{ opacity: 0.9, fontSize: 13, marginTop: 3 }}>{z.sub}</div>
        </div>
        <button onClick={() => (user ? setComposing(true) : openLogin())} style={{ background: "rgba(255,255,255,0.22)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", borderRadius: 22, padding: "9px 20px", fontWeight: 800, cursor: "pointer", fontSize: 13 }}>{z.start}</button>
      </div>

      <Rules z={z} />

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {["", ...CATS].map((c) => (
          <button key={c || "all"} onClick={() => setCat(c)} style={{ padding: "6px 13px", borderRadius: 20, border: `2px solid ${cat === c ? BROWN : "#ddd"}`, background: cat === c ? BROWN : "#fff", color: cat === c ? "#fff" : "#555", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
            {c ? (z.cats as Record<string, string>)[c] : z.all}
          </button>
        ))}
      </div>

      {loaded && !topics.length && <div style={{ background: "#fff", borderRadius: 14, padding: 28, textAlign: "center", color: "#777", fontSize: 14 }}>{z.noTopics}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {topics.map((t) => (
          <div key={t.id} onClick={() => setOpen(t)} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 3px 12px rgba(0,0,0,0.06)", cursor: "pointer", borderLeft: `4px solid ${BROWN}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#2b1d10" }}>{t.title}</div>
              <div style={{ fontSize: 12, color: BROWN, fontWeight: 800, whiteSpace: "nowrap" }}>💬 {t.reply_count}</div>
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
              {(z.cats as Record<string, string>)[t.category] || t.category}{t.city ? " · 📍 " + t.city : ""} · {z.by} {t.author_name || "Member"} · {when(t.created_at)}
            </div>
            {t.body && <div style={{ fontSize: 13, color: "#555", marginTop: 6, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{t.body}</div>}
          </div>
        ))}
      </div>

      {composing && <Compose z={z} onClose={() => setComposing(false)} onDone={(t) => { setComposing(false); refresh(); setOpen(t); }} />}
      {open && <TopicView z={z} topic={open} onClose={() => { setOpen(null); load(); }} onDeleted={() => { setOpen(null); refresh(); }} />}
    </div>
  );
}

function Compose({ z, onClose, onDone }: { z: typeof Z.en; onClose: () => void; onDone: (t: store.Topic) => void }) {
  const { user } = useApp();
  const [category, setCategory] = useState("ask");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [city, setCity] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const label = (s: string) => <div style={{ fontSize: 12, fontWeight: 700, color: "#555", margin: "10px 0 4px" }}>{s}</div>;
  const submit = async () => {
    if (!user || title.trim().length < 3) return;
    setBusy(true); setErr("");
    try { onDone(await store.createTopic(user, { category, title: title.trim(), body: body.trim(), city: city.trim() })); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <Modal onClose={onClose} width={500}>
      <div style={{ fontWeight: 900, fontSize: 18, color: BROWN, marginBottom: 8 }}>{z.start.replace("+ ", "")}</div>
      <Rules z={z} />
      {label(z.cat)}
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
        {CATS.map((c) => <option key={c} value={c}>{(z.cats as Record<string, string>)[c]}</option>)}
      </select>
      {label(z.titleL)}
      <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} placeholder={z.titlePh} style={inputStyle} />
      {label(z.body)}
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} maxLength={3000} placeholder={z.bodyPh} style={inputStyle} />
      {label(z.city)}
      <input value={city} onChange={(e) => setCity(e.target.value)} maxLength={80} style={inputStyle} />
      <div style={{ fontSize: 11, color: "#888", margin: "10px 0" }}>{z.agree}</div>
      {err && <div style={{ color: THEME.red, fontSize: 12, marginBottom: 8 }}>{err}</div>}
      <Btn bg={BROWN} disabled={busy || title.trim().length < 3} onClick={submit}>{z.post}</Btn>
    </Modal>
  );
}

function TopicView({ z, topic, onClose, onDeleted }: { z: typeof Z.en; topic: store.Topic; onClose: () => void; onDeleted: () => void }) {
  const { user, openLogin } = useApp();
  const key = "z-" + topic.id;
  const [replies, setReplies] = useState<store.Review[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const load = useCallback(() => {
    // oldest first reads like a conversation
    store.fetchReviews(key).then((r) => setReplies([...r].reverse())).catch(() => {});
  }, [key]);
  useEffect(load, [load]);
  const canDelete = (uid: string) => !!user && (user.id === uid || !!user.is_admin);

  const send = async () => {
    if (!user) return openLogin();
    if (!body.trim()) return;
    setBusy(true); setErr("");
    try { await store.addReview(user, key, null, body.trim()); setBody(""); load(); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <Modal onClose={onClose} width={560}>
      <div style={{ fontSize: 11, color: BROWN, fontWeight: 800, marginBottom: 4 }}>{(z.cats as Record<string, string>)[topic.category]}{topic.city ? " · 📍 " + topic.city : ""}</div>
      <div style={{ fontWeight: 900, fontSize: 18, color: "#2b1d10", paddingRight: 24 }}>{topic.title}</div>
      <div style={{ fontSize: 11, color: "#888", margin: "4px 0 10px" }}>{z.by} {topic.author_name || "Member"} · {when(topic.created_at)}</div>
      {topic.body && <div style={{ fontSize: 14, color: "#333", lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 10 }}>{topic.body}</div>}
      <div style={{ display: "flex", gap: 12, alignItems: "center", paddingBottom: 12, borderBottom: "1px solid #eee" }}>
        <ReportLink listingId={key} />
        {canDelete(topic.user_id) && (
          <button onClick={async () => { if (window.confirm(z.confirmDel)) { await store.deleteTopic(topic.id); onDeleted(); } }} style={{ background: "none", border: "none", color: THEME.red, fontSize: 11, cursor: "pointer" }}>{z.del}</button>
        )}
      </div>

      <div style={{ fontWeight: 800, fontSize: 13, margin: "12px 0 6px", color: BROWN }}>💬 {replies.length} {z.replies}</div>
      {!replies.length && <div style={{ fontSize: 13, color: "#999", marginBottom: 8 }}>{z.noReplies}</div>}
      {replies.map((r) => (
        <div key={r.id} style={{ background: "#faf6f0", borderRadius: 10, padding: "9px 12px", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>{r.author_name || "Member"}</div>
            <div style={{ fontSize: 10, color: "#aaa" }}>{when(r.created_at)}</div>
          </div>
          <div style={{ fontSize: 13, color: "#444", marginTop: 3, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{r.body}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
            <ReportLink listingId={key} reviewId={r.id} />
            {canDelete(r.user_id) && <button onClick={async () => { await store.deleteReview(r.id); load(); }} style={{ background: "none", border: "none", color: THEME.red, fontSize: 11, cursor: "pointer" }}>{z.del}</button>}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 10 }}>
        {user ? <>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={1000} placeholder={z.replyPh} style={{ ...inputStyle, marginBottom: 8 }} />
          {err && <div style={{ color: THEME.red, fontSize: 12, marginBottom: 8 }}>{err}</div>}
          <Btn bg={BROWN} disabled={busy || !body.trim()} onClick={send}>{z.send}</Btn>
        </> : <Btn bg={BROWN} onClick={openLogin}>{z.signIn}</Btn>}
      </div>
    </Modal>
  );
}
