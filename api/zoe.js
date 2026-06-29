// Proxy server-side de ZOE (la profe IA). La API key vive SOLO en el servidor
// (process.env.ANTHROPIC_API_KEY, SIN prefijo VITE_), así que NUNCA se expone al navegador.
// Si no hay clave configurada o la API falla, devuelve texto vacío y el juego usa su
// respaldo cálido: la experiencia del chico NUNCA se traba.
const MODEL = 'claude-sonnet-4-6'

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ text: '', error: 'method' }); return }

  // Acepta la clave en ANTHROPIC_API_KEY (recomendada) o en la vieja VITE_ANTHROPIC_API_KEY.
  // Ambas se leen SOLO acá en el servidor; el navegador no las ve (el código cliente no las usa).
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) { res.status(200).json({ text: '', noKey: true }); return } // sin clave: respaldo

  try {
    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
    const system = String((body && body.system) || '')
    const message = String((body && body.message) || '').slice(0, 2000)
    const maxTokens = Math.min(Math.max(parseInt((body && body.maxTokens), 10) || 300, 1), 600)
    if (!message) { res.status(200).json({ text: '' }); return }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: message }] }),
    })
    if (!upstream.ok) { res.status(200).json({ text: '', error: 'upstream ' + upstream.status }); return }
    const data = await upstream.json()
    res.status(200).json({ text: (data.content && data.content[0] && data.content[0].text) || '' })
  } catch (e) {
    res.status(200).json({ text: '', error: 'exception' })
  }
}
