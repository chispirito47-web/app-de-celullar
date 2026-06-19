// Service worker mínimo: solo permite que el navegador detecte la PWA como instalable.
// No cachea datos (el dashboard necesita datos en vivo de Supabase).
const CACHE = 'casa-dams-shell-v1';
const SHELL = ['/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
});

// Network-first: siempre intenta traer datos frescos; si no hay internet, usa el shell cacheado.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
