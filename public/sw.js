// Service Worker de MenteLibre — RED SIEMPRE, sin caché pegado.
// Tras los problemas de "veo la versión vieja", esta versión NO guarda nada en caché:
// cada carga baja lo último de la red. Al activarse borra TODO el caché viejo y recarga
// las pestañas abiertas una vez, así el teléfono toma la versión nueva sí o sí.
const CACHE = 'mentelibre-net-1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.map((k) => caches.delete(k))) // borra TODO el caché viejo
    await self.clients.claim()
    const wins = await self.clients.matchAll({ type: 'window' })
    wins.forEach((c) => { try { c.navigate(c.url) } catch { /* noop */ } }) // recarga una vez
  })())
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  if (new URL(req.url).origin !== self.location.origin) return
  // RED primero SIEMPRE (nada queda pegado). Caché mínimo solo como respaldo offline.
  e.respondWith(
    fetch(req)
      .then((r) => { if (r && r.ok && req.mode === 'navigate') { const cp = r.clone(); caches.open(CACHE).then((c) => c.put('/index.html', cp)) } return r })
      .catch(() => caches.match(req).then((r) => r || caches.match('/index.html')))
  )
})
