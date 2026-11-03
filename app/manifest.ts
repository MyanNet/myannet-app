import type { MetadataRoute } from "next";

// Lets people "Install app" / "Add to Home Screen" / "Add to Dock".
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyanNet | မြန်နက်",
    short_name: "MyanNet",
    description: "All-in-one services, anywhere, for the people of Myanmar",
    start_url: "/",
    display: "standalone",
    background_color: "#f4faf4",
    theme_color: "#2e7d32",
    lang: "my",
    categories: ["social", "business", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
