// Minimal service worker so browsers offer "Install app".
// It always uses the network (no offline caching yet), so updates appear immediately.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
