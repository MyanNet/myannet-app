"use client";
import { supabase, LIVE } from "./supabase";

export type Contact = {
  facebook?: string; tiktok?: string; telegram?: string;
  viber?: string; whatsapp?: string; phone?: string;
};
export type Listing = {
  id: string; pillar: string; kind: string; title: string; description: string;
  country: string; city: string; price?: string | null; contact: Contact;
  user_id: string; author_name: string; status: string; created_at: string;
};
export type Review = {
  id: string; listing_id: string; user_id: string; author_name: string;
  stars: number | null; body: string; created_at: string;
};
export type AppUser = {
  id: string; name: string; photo?: string | null; method: string; is_admin?: boolean;
};

export const DAILY_POST_LIMIT = 5;

// ---------- demo-mode storage (this browser only) ----------
const mem: Record<string, string> = {};
const read = <T,>(k: string, d: T): T => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }
  catch { return mem[k] ? JSON.parse(mem[k]) : d; }
};
const write = (k: string, v: unknown) => {
  const s = JSON.stringify(v);
  try { localStorage.setItem(k, s); } catch { mem[k] = s; }
};
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const authListeners = new Set<(u: AppUser | null) => void>();
const emitDemo = (u: AppUser | null) => authListeners.forEach((f) => f(u));

// ---------- auth ----------
async function toAppUser(u: any): Promise<AppUser | null> {
  if (!u || !supabase) return null;
  const { data: p } = await supabase.from("profiles").select("display_name,avatar_url,is_admin").eq("id", u.id).maybeSingle();
  const meta = u.user_metadata || {};
  return {
    id: u.id,
    name: p?.display_name || meta.full_name || meta.name || u.phone || (u.email || "").split("@")[0] || "Member",
    photo: p?.avatar_url || meta.avatar_url || meta.picture || null,
    method: meta.provider || u.app_metadata?.provider || "member",
    is_admin: !!p?.is_admin,
  };
}

export async function getUser(): Promise<AppUser | null> {
  if (!LIVE) return read<AppUser | null>("mn_user", null);
  const { data } = await supabase!.auth.getUser();
  return toAppUser(data.user);
}

export function onAuthChange(cb: (u: AppUser | null) => void): () => void {
  if (!LIVE) { authListeners.add(cb); return () => { authListeners.delete(cb); }; }
  const { data } = supabase!.auth.onAuthStateChange(async (_e, session) => cb(await toAppUser(session?.user)));
  return () => data.subscription.unsubscribe();
}

export function demoSignIn(method: string) {
  const names: Record<string, string> = {
    facebook: "Demo Facebook User", tiktok: "Demo TikTok User", telegram: "Demo Telegram User",
    whatsapp: "Demo WhatsApp User", phone: "Demo Phone User", email: "Demo Email User",
  };
  const u: AppUser = { id: "demo-" + method, name: names[method] || "Demo User", method, is_admin: true };
  write("mn_user", u); emitDemo(u); return u;
}

export async function signInFacebook() {
  if (!LIVE) return demoSignIn("facebook");
  const { error } = await supabase!.auth.signInWithOAuth({
    provider: "facebook", options: { redirectTo: window.location.origin, scopes: "public_profile,email" },
  });
  if (error) throw error;
}

export function signInTikTok() {
  if (!LIVE) return demoSignIn("tiktok");
  window.location.href = "/api/auth/tiktok";
}

// channel "whatsapp" sends the code through WhatsApp; "sms" is a normal text (covers Viber users).
export async function sendPhoneCode(phone: string, channel: "sms" | "whatsapp") {
  if (!LIVE) return;
  const { error } = await supabase!.auth.signInWithOtp({ phone, options: { channel } });
  if (error) throw error;
}
export async function verifyPhoneCode(phone: string, token: string, method: string) {
  if (!LIVE) { if (token !== "123456") throw new Error("Demo mode: use code 123456"); return demoSignIn(method); }
  const { error } = await supabase!.auth.verifyOtp({ phone, token, type: "sms" });
  if (error) throw error;
}

export async function sendEmailLink(email: string) {
  if (!LIVE) return demoSignIn("email");
  const { error } = await supabase!.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
  if (error) throw error;
}

export async function signInTelegram(tgUser: Record<string, unknown>) {
  if (!LIVE) return demoSignIn("telegram");
  const res = await fetch("/api/auth/telegram", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(tgUser) });
  const j = await res.json();
  if (!res.ok) throw new Error(j.error || "Telegram sign-in failed");
  const { error } = await supabase!.auth.verifyOtp({ token_hash: j.token_hash, type: "email" });
  if (error) throw error;
}

export async function finishWithToken(token_hash: string) {
  const { error } = await supabase!.auth.verifyOtp({ token_hash, type: "email" });
  if (error) throw error;
}

export async function signOut() {
  if (!LIVE) { try { localStorage.removeItem("mn_user"); } catch {} delete mem["mn_user"]; emitDemo(null); return; }
  await supabase!.auth.signOut();
}

// ---------- listings ----------
export type NewListing = Omit<Listing, "id" | "user_id" | "author_name" | "status" | "created_at">;

export async function fetchListings(pillar?: string): Promise<Listing[]> {
  if (!LIVE) {
    const all = read<Listing[]>("mn_listings", []).filter((l) => l.status === "active");
    return (pillar ? all.filter((l) => l.pillar === pillar) : all).sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  let q = supabase!.from("listings").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(100);
  if (pillar) q = q.eq("pillar", pillar);
  const { data, error } = await q;
  if (error) throw error;
  return data as Listing[];
}

export async function myListings(user: AppUser): Promise<Listing[]> {
  if (!LIVE) return read<Listing[]>("mn_listings", []).filter((l) => l.user_id === user.id);
  const { data, error } = await supabase!.from("listings").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) throw error;
  return data as Listing[];
}

export async function createListing(user: AppUser, input: NewListing): Promise<Listing> {
  if (!LIVE) {
    const all = read<Listing[]>("mn_listings", []);
    const dayAgo = new Date(Date.now() - 864e5).toISOString();
    if (all.filter((l) => l.user_id === user.id && l.created_at > dayAgo).length >= DAILY_POST_LIMIT)
      throw new Error("Daily post limit reached (5 per day)");
    const l: Listing = { ...input, id: uid(), user_id: user.id, author_name: user.name, status: "active", created_at: new Date().toISOString() };
    write("mn_listings", [l, ...all]); return l;
  }
  const { data, error } = await supabase!.from("listings").insert({ ...input, author_name: user.name }).select().single();
  if (error) throw error;
  return data as Listing;
}

export async function setListingStatus(id: string, status: "active" | "closed") {
  if (!LIVE) { write("mn_listings", read<Listing[]>("mn_listings", []).map((l) => (l.id === id ? { ...l, status } : l))); return; }
  const { error } = await supabase!.from("listings").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteListing(id: string) {
  if (!LIVE) { write("mn_listings", read<Listing[]>("mn_listings", []).filter((l) => l.id !== id)); return; }
  const { error } = await supabase!.from("listings").delete().eq("id", id);
  if (error) throw error;
}

// ---------- reviews ----------
export async function fetchReviews(listingId: string): Promise<Review[]> {
  if (!LIVE) return read<Review[]>("mn_reviews", []).filter((r) => r.listing_id === listingId);
  const { data, error } = await supabase!.from("reviews").select("*").eq("listing_id", listingId).order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  return data as Review[];
}

export function summarize(reviews: Review[]) {
  const rated = reviews.filter((r) => r.stars);
  const avg = rated.length ? rated.reduce((s, r) => s + (r.stars || 0), 0) / rated.length : 0;
  return { avg, ratings: rated.length, comments: reviews.filter((r) => r.body.trim()).length };
}

export async function addReview(user: AppUser, listingId: string, stars: number | null, body: string) {
  if (!LIVE) {
    const all = read<Review[]>("mn_reviews", []);
    if (stars && all.some((r) => r.listing_id === listingId && r.user_id === user.id && r.stars))
      throw new Error("You already rated this listing");
    write("mn_reviews", [{ id: uid(), listing_id: listingId, user_id: user.id, author_name: user.name, stars, body, created_at: new Date().toISOString() }, ...all]);
    return;
  }
  const { error } = await supabase!.from("reviews").insert({ listing_id: listingId, stars, body, author_name: user.name });
  if (error) throw new Error(error.code === "23505" ? "You already rated this listing" : error.message);
}

export async function deleteReview(id: string) {
  if (!LIVE) { write("mn_reviews", read<Review[]>("mn_reviews", []).filter((r) => r.id !== id)); return; }
  const { error } = await supabase!.from("reviews").delete().eq("id", id);
  if (error) throw error;
}

// ---------- reports ----------
export type Report = { id: string; listing_id: string; review_id?: string | null; reason: string; created_at: string };

export async function report(listingId: string, reason: string, reviewId?: string) {
  if (!LIVE) { write("mn_reports", [{ id: uid(), listing_id: listingId, review_id: reviewId || null, reason, created_at: new Date().toISOString() }, ...read<Report[]>("mn_reports", [])]); return; }
  const { error } = await supabase!.from("reports").insert({ listing_id: listingId, review_id: reviewId || null, reason });
  if (error) throw error;
}

export async function fetchReports(): Promise<Report[]> {
  if (!LIVE) return read<Report[]>("mn_reports", []);
  const { data, error } = await supabase!.from("reports").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Report[];
}

export async function clearReport(id: string) {
  if (!LIVE) { write("mn_reports", read<Report[]>("mn_reports", []).filter((r) => r.id !== id)); return; }
  await supabase!.from("reports").delete().eq("id", id);
}

export async function getListing(id: string): Promise<Listing | null> {
  if (!LIVE) return read<Listing[]>("mn_listings", []).find((l) => l.id === id) || null;
  const { data } = await supabase!.from("listings").select("*").eq("id", id).maybeSingle();
  return (data as Listing) || null;
}

// ---------- interest sign-ups ----------
export async function registerInterest(email: string, role: string, country: string) {
  if (!LIVE) { write("mn_signups", [{ email, role, country, at: new Date().toISOString() }, ...read<unknown[]>("mn_signups", [])]); return; }
  const { error } = await supabase!.from("interest_signups").insert({ email, role, country });
  if (error) throw error;
}
