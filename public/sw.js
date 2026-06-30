// Service Worker de MenteLibre — hace que funcione como app (instalable + offline).
// Estrategia: navegación con RED primero (siempre trae la última versión); assets con caché.
const CACHE = 'mentelibre-v3'
const CORE = ['/', '/index.html', '/manifest.json', '/icon-192-v3.png', '/icon-512-v3.png', '/foundation-logo.webp', '/zoe-voz.mp3']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
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

  // Assets: stale-while-revalidate. Devuelve la caché al instante PERO la actualiza en
  // segundo plano, así un asset nuevo (p. ej. el ícono) aparece en la próxima carga y nunca
  // queda "pegado" como pasaba antes con el ícono viejo del planeta.
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((r) => {
        if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)) }
        return r
      }).catch(() => cached)
      return cached || network
    })
  )
})
