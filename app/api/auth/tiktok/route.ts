import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

// Step 1 of TikTok Login Kit (web): send the person to TikTok to approve.
export async function GET(req: Request) {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const origin = new URL(req.url).origin;
  if (!clientKey) return NextResponse.redirect(`${origin}/?login_error=tiktok_not_ready`);

  const state = randomBytes(16).toString("hex");
  const params = new URLSearchParams({
    client_key: clientKey,
    scope: "user.info.basic",
    response_type: "code",
    redirect_uri: `${origin}/api/auth/tiktok/callback`,
    state,
  });
  const res = NextResponse.redirect(`https://www.tiktok.com/v2/auth/authorize/?${params}`);
  res.cookies.set("tt_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/" });
  return res;
}
