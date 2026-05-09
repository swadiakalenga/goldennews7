// GoldenNews7 Service Worker — Push Notification Scaffold
// Future: replace with full push subscription handling

const CACHE_NAME = "gn7-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "GoldenNews7", body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(data.title ?? "GoldenNews7", {
      body: data.body ?? "",
      icon: "/icon-192.png",
      badge: "/icon-72.png",
      data: { url: data.url ?? "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data?.url ?? "/")
  );
});
