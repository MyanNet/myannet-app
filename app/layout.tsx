import type { Metadata, Viewport } from "next";
import Script from "next/script";

const description =
  "The all-in-one platform for Burmese/Myanmar communities worldwide — find work, find services, rent a room, ship goods, buy & sell, and share community events — all in one trusted place.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.myannet.app"),
  title: "MyanNet | မြန်နက် — All-in-one services, anywhere, for Myanmar and Burmese people",
  description,
  applicationName: "MyanNet",
  keywords: [
    "MyanNet", "မြန်နက်", "myannet.app", "Burmese community", "sushi jobs",
    "Burmese services", "Burma migrant workers", "Myanmar community events", "Burmese business directory",
  ],
  appleWebApp: { capable: true, title: "MyanNet", statusBarStyle: "default" },
  openGraph: {
    title: "MyanNet | မြန်နက်",
    description: "Jobs · Services · Rent · Cargo · Buy/Sell · Businesses · Events",
    url: "https://www.myannet.app",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "MyanNet | မြန်နက်" },
};

export const viewport: Viewport = { themeColor: "#2e7d32", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
        {/* Service worker: makes MyanNet installable as an app on Android, iPhone and Mac */}
        <Script id="sw" strategy="afterInteractive">{`if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{})}`}</Script>
      </body>
    </html>
  );
}
