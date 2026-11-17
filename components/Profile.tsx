"use client";
import { useState } from "react";
import * as store from "@/lib/store";
import { Modal, Btn, inputStyle, THEME } from "./ui";

// "Edit my name": the name everyone sees on posts, reviews and Zayat, and whether to show the photo.
export default function Profile({ user, lang, onClose, onSaved }: { user: store.AppUser; lang: string; onClose: () => void; onSaved: (u: store.AppUser) => void }) {
  const mm = lang === "mm";
  const [name, setName] = useState(user.name || "");
  const [showPhoto, setShowPhoto] = useState(!!user.photo);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const save = async () => {
    setBusy(true); setErr("");
    try { onSaved(await store.setMyName(user, name, showPhoto)); onClose(); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <Modal onClose={onClose} width={400}>
      <div style={{ fontWeight: 900, fontSize: 18, color: THEME.greenDark, marginBottom: 6 }}>{mm ? "✏️ ကျွန်ုပ်၏ အမည်" : "✏️ Edit my name"}</div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 12, lineHeight: 1.6 }}>
        {mm ? "ပို့စ်၊ သုံးသပ်ချက်နှင့် ဇရပ်တွင် အခြားသူများမြင်ရမည့် အမည်။ အမည်ပြောင်ပဲ သုံးလို့ရပါတယ်။" : "This is the name everyone sees on your posts, reviews and Zayat topics. A nickname is fine."}
      </div>
      <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} style={inputStyle} />
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, margin: "12px 0" }}>
        <input type="checkbox" checked={showPhoto} onChange={(e) => setShowPhoto(e.target.checked)} />
        {mm ? "ကျွန်ုပ်၏ ဓာတ်ပုံကို ပြပါ" : "Show my photo"}
      </label>
      {err && <div style={{ color: THEME.red, fontSize: 12, marginBottom: 8 }}>{err}</div>}
      <Btn bg={THEME.green} disabled={busy || name.trim().length < 2} onClick={save}>{mm ? "သိမ်းရန်" : "Save"}</Btn>
    </Modal>
  );
}
