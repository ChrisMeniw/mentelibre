// Service Worker de MenteLibre — hace que funcione como app (instalable + offline).
// Estrategia: navegación con RED primero (siempre trae la última versión); assets con caché.
const CACHE = 'mentelibre-v5'
const CORE = ['/', '/index.html', '/manifest.json', '/icon-192-v3.png', '/icon-512-v3.png', '/foundation-logo.webp', '/zoe-voz.mp3']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    await self.clients.claim()
    // Versión nueva detectada: recargar las pestañas abiertas para que tomen lo último al
    // instante (así no queda pegada la versión vieja en el teléfono).
    const wins = await self.clients.matchAll({ type: 'window' })
    wins.forEach((c) => { try { c.navigate(c.url) } catch { /* noop */ } })
  })())
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  // No tocar otros orígenes (p. ej. la API de la IA en api.anthropic.com).
  if (url.origin !== self.location.origin) return

  // Navegación: red primero, caché como respaldo (offline).
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put('/index.html', cp)); return r })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
    )
    return
  }

  // Assets: RED PRIMERO (siempre lo último), la caché solo como respaldo offline. Así la
  // versión nueva aparece al instante y NADA queda "pegado" en caché (ni ZOE ni el ícono).
  e.respondWith(
    fetch(req)
      .then((r) => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)) } return r })
      .catch(() => caches.match(req))
  )
})
