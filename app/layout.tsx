import type { Metadata } from "next";

const description =
  "The all-in-one platform for Burmese/Myanmar communities worldwide — find work, send money home, rent a room, ship goods, and buy & sell within a trusted community.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.myannet.app"),
  title: "Myanmar Connect | မြန်မာ ကွန်နက် — Work, Hundi, Rent, Cargo & Trade",
  description,
  keywords: [
    "Myanmar Connect", "myannet.app", "Burmese community", "sushi jobs",
    "hundi", "Burma migrant workers", "Myanmar remittance",
  ],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%238B0000'/><text y='72' x='50' text-anchor='middle' font-size='60'>🇲🇲</text></svg>",
  },
  openGraph: {
    title: "Myanmar Connect | မြန်မာ ကွန်နက်",
    description: "Work · Hundi · Rent · Cargo · Trade",
    url: "https://www.myannet.app",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Myanmar Connect | မြန်မာ ကွန်နက်" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
