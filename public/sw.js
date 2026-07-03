// Service Worker de MenteLibre — HTML/JS SIEMPRE de la red (nada de versiones viejas
// pegadas), pero los archivos PESADOS que no cambian (fotos, música, íconos, bundles con
// hash) se guardan en el aparato: la app abre rápida aunque la conexión sea lenta.
const CACHE = 'mentelibre-v3'

// Qué se guarda en caché: imágenes, música, fuentes y los bundles /assets/ (tienen hash en
// el nombre: si cambian, cambia el nombre → nunca queda uno viejo). El VIDEO no (iOS lo pide
// por partes y el caché lo rompe) y /api/ jamás (voz e IA siempre en vivo).
const STATIC = /\.(mp3|webp|png|jpg|jpeg|svg|woff2?)$/

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))) // borra cachés viejos
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return          // voz e IA: siempre en vivo
  if (url.pathname.endsWith('.mp4')) return             // video: directo (iOS usa rangos)

  const isStatic = STATIC.test(url.pathname) || url.pathname.startsWith('/assets/')
  if (isStatic) {
    // CACHÉ PRIMERO para lo pesado e inmutable → carga instantánea la segunda vez.
    e.respondWith((async () => {
      const c = await caches.open(CACHE)
      const hit = await c.match(req)
      if (hit) return hit
      const r = await fetch(req)
      if (r && r.ok) c.put(req, r.clone())
      return r
    })().catch(() => fetch(req)))
    return
  }

  // Resto (HTML, JSON, etc.): RED PRIMERO siempre; el index queda solo como respaldo offline.
  e.respondWith(
    fetch(req)
      .then((r) => { if (r && r.ok && req.mode === 'navigate') { const cp = r.clone(); caches.open(CACHE).then((c) => c.put('/index.html', cp)) } return r })
      .catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
  )
})
