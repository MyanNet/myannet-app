# myannet-app
MyanNet မြန်နက် — All-in-one services, anywhere, for the people of Myanmar · www.myannet.app

## V3 setup (environment variables in Vercel)
Until these are set the site runs in **demo mode** (posts and reviews stay in the visitor's browser).

| Variable | From |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (secret) |
| `NEXT_PUBLIC_TELEGRAM_BOT_NAME`, `TELEGRAM_BOT_TOKEN` | @BotFather |
| `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `NEXT_PUBLIC_TIKTOK_ENABLED=1` | developers.tiktok.com (after app approval) |

Database: run `supabase/schema.sql` once in the Supabase SQL Editor.
Facebook, phone (SMS) and WhatsApp codes are switched on inside Supabase → Authentication → Providers.
