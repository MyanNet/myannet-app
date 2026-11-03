import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { issueLoginToken } from "@/lib/server-auth";

// Step 2 of TikTok Login Kit: TikTok sends the person back here with a code.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const fail = (why: string) => NextResponse.redirect(`${origin}/?login_error=${encodeURIComponent(why)}`);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const saved = (await cookies()).get("tt_state")?.value;
  if (!code || !state || state !== saved) return fail("tiktok_state");

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) return fail("tiktok_not_ready");

  try {
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: clientKey, client_secret: clientSecret, code,
        grant_type: "authorization_code", redirect_uri: `${origin}/api/auth/tiktok/callback`,
      }),
    });
    const tok = await tokenRes.json();
    if (!tok.access_token) return fail("tiktok_token");

    const infoRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name", {
      headers: { authorization: `Bearer ${tok.access_token}` },
    });
    const user = (await infoRes.json())?.data?.user;
    if (!user?.open_id) return fail("tiktok_user");

    const safeId = String(user.open_id).replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase();
    const token_hash = await issueLoginToken(`tt${safeId}@tiktok.myannet.app`, {
      full_name: user.display_name || "TikTok user", avatar_url: user.avatar_url || null, provider: "tiktok",
    });
    const res = NextResponse.redirect(`${origin}/auth/finish#token_hash=${token_hash}`);
    res.cookies.delete("tt_state");
    return res;
  } catch {
    return fail("tiktok_error");
  }
}
