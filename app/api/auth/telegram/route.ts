import { NextResponse } from "next/server";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { issueLoginToken } from "@/lib/server-auth";

// Verifies the signed data the Telegram Login Widget sends, per
// https://core.telegram.org/widgets/login#checking-authorization
export async function POST(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return NextResponse.json({ error: "Telegram login is not set up yet" }, { status: 503 });

  const data = (await req.json()) as Record<string, string | number>;
  const { hash, ...fields } = data;
  if (!hash || !fields.id) return NextResponse.json({ error: "Missing data" }, { status: 400 });

  const checkString = Object.keys(fields).sort().map((k) => `${k}=${fields[k]}`).join("\n");
  const secret = createHash("sha256").update(botToken).digest();
  const expected = createHmac("sha256", secret).update(checkString).digest("hex");
  const ok = expected.length === String(hash).length && timingSafeEqual(Buffer.from(expected), Buffer.from(String(hash)));
  if (!ok) return NextResponse.json({ error: "Invalid Telegram signature" }, { status: 401 });
  if (Date.now() / 1000 - Number(fields.auth_date) > 86400) return NextResponse.json({ error: "Login expired, try again" }, { status: 401 });

  try {
    const name = [fields.first_name, fields.last_name].filter(Boolean).join(" ") || String(fields.username || "Telegram user");
    const token_hash = await issueLoginToken(`tg${fields.id}@telegram.myannet.app`, {
      full_name: name, avatar_url: fields.photo_url || null, provider: "telegram", telegram_username: fields.username || null,
    });
    return NextResponse.json({ token_hash });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
