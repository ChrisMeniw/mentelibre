// Proxy de Texto-a-Voz: el navegador no puede pedirle el audio a Google Translate
// (lo bloquea por origen), así que lo pedimos del lado del SERVIDOR y lo devolvemos
// como audio. Resultado: una voz femenina natural, gratis, IGUAL en todos los teléfonos
// (no la voz robótica del dispositivo). Texto corto (preguntas) — límite ~300 caracteres.
export default async function handler(req, res) {
  try {
    const q = String((req.query && req.query.q) || '').slice(0, 300)
    const tlRaw = String((req.query && req.query.tl) || 'es').toLowerCase()
    if (!q) { res.status(400).send('missing q'); return }
    const tl = tlRaw.startsWith('pt') ? 'pt-BR' : 'es'

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(tl)}&client=tw-ob&q=${encodeURIComponent(q)}`
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        'Referer': 'https://translate.google.com/',
        'Accept': 'audio/mpeg,*/*',
      },
    })
    if (!upstream.ok) { res.status(502).send('tts upstream ' + upstream.status); return }

    const buf = Buffer.from(await upstream.arrayBuffer())
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable') // mismo texto = mismo audio
    res.status(200).send(buf)
  } catch (e) {
    res.status(500).send('tts error')
  }
}
