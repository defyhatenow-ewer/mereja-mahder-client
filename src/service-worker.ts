/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare const self: ServiceWorkerGlobalScope & typeof globalThis;
// Claim clients as soon as SW activates
clientsClaim();

// Precache Vite-generated assets (auto-injected)
precacheAndRoute(self.__WB_MANIFEST);

// Cache API calls with stale-while-revalidate strategy
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new StaleWhileRevalidate({
    cacheName: "api-cache",
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 604800, // I week
        maxEntries: 50,
      }),
    ],
  })
);
