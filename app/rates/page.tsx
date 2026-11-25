import type { Metadata } from "next";
import { RatesBoard } from "@/components/Rates";
import Track from "@/components/Track";

// Shareable rates page. The og:image is the latest rates picture, so a link
// to www.myannet.app/rates shows the picture as a big preview on Facebook.
const IMG = "/share/rates-2026-11-24b.jpg";

export const metadata: Metadata = {
  title: "ယနေ့ ကျပ်ငွေလဲနှုန်း · Kyat market rates | MyanNet မြန်နက်",
  description: "USD, ဘတ်, ရင်းဂစ်, ဝမ်, ယန်း, ဒါဟမ်… ကျပ်ငွေ ပြင်ပဈေး — နေ့စဉ် အပ်ဒိတ်။ Kyat market exchange rates, updated daily.",
  openGraph: {
    title: "ယနေ့ ကျပ်ငွေလဲနှုန်း · Kyat market rates",
    description: "နေ့စဉ် အပ်ဒိတ် · www.myannet.app",
    url: "https://www.myannet.app/rates",
    type: "website",
    images: [{ url: IMG, width: 1080, height: 1080 }],
  },
  twitter: { card: "summary_large_image", images: [IMG] },
};

export default function RatesPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", background: "#f5f7f5", minHeight: "100vh" }}>
      <Track section="rates" />
      <div style={{ background: "#2e7d32", color: "#fff", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 20 }}>MyanNet မြန်နက်</a>
        <a href="/" style={{ color: "#fff", fontSize: 14 }}>🏠 Home · ပင်မစာမျက်နှာ</a>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px" }}>
        <RatesBoard lang="mm" />
        <div style={{ textAlign: "center", margin: "18px 0" }}>
          <a href="/" style={{ display: "inline-block", background: "#2e7d32", color: "#fff", padding: "10px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>
            အလုပ်၊ အခန်းငှား၊ ဝယ်/ရောင်း… MyanNet ကို ကြည့်ရန် →
          </a>
        </div>
      </div>
    </main>
  );
}
