// Texto-a-voz del navegador (Web Speech API). Gratis, sin API key.
// Para que los más chicos escuchen la pregunta sin tener que leer.
const LANGS = { es: 'es-US', pt: 'pt-BR' } // es-US = español neutro latino, pt-BR = portugués de Brasil

// Dialectos LATAM (NUNCA España es-ES). Se prioriza esto para que NO suene "española".
const LATAM = ['es-us', 'es-mx', 'es-419', 'es-ar', 'es-co', 'es-cl', 'es-pe', 'es-uy', 'es-ve', 'es-la', 'es-do', 'es-gt']

// Nombres de voces LATAM femeninas/neutras frecuentes (macOS / Windows / Chrome).
const PREFERRED = {
  es: ['paulina', 'sabina', 'dalia', 'angélica', 'angelica', 'estados unidos', 'jimena', 'juan'],
  pt: ['luciana', 'google português', 'google portugues', 'maria', 'francisca', 'joana', 'fernanda', 'camila'],
}

export function speakSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let cachedVoices = []
function refreshVoices() {
  if (!speakSupported()) return []
  cachedVoices = window.speechSynthesis.getVoices() || []
  return cachedVoices
}
if (speakSupported()) {
  refreshVoices()
  try { window.speechSynthesis.onvoiceschanged = refreshVoices } catch { /* noop */ }
}

const norm = (v) => (v.lang || '').toLowerCase().replace('_', '-')

// Elige la mejor voz para el idioma.
function pickVoice(lang) {
  const voices = cachedVoices.length ? cachedVoices : refreshVoices()
  if (!voices.length) return null

  if (lang === 'pt') {
    const m = voices.filter((v) => norm(v).startsWith('pt'))
    if (!m.length) return null
    for (const name of PREFERRED.pt) { const f = m.find((v) => (v.name || '').toLowerCase().includes(name)); if (f) return f }
    return m.find((v) => norm(v) === 'pt-br') || m[0]
  }

  // ESPAÑOL: priorizar LATAM y EVITAR España (es-ES). Solo usa es-ES si no hay nada más.
  const es = voices.filter((v) => norm(v).startsWith('es'))
  if (!es.length) return null
  const latam = es.filter((v) => LATAM.includes(norm(v)))
  const pool = latam.length ? latam : es
  for (const name of PREFERRED.es) { const f = pool.find((v) => (v.name || '').toLowerCase().includes(name)); if (f) return f }
  return pool.find((v) => norm(v) === 'es-us') || pool.find((v) => norm(v) === 'es-mx') || pool[0]
}

function speakNow(text, lang) {
  const synth = window.speechSynthesis
  try { synth.cancel() } catch { /* noop */ }
  const u = new SpeechSynthesisUtterance(text)
  u.lang = LANGS[lang] || 'es-US'
  const v = pickVoice(lang)
  if (v) u.voice = v // voz LATAM (es) o pt-BR (pt); si no hay, queda u.lang
  u.rate = 0.95
  u.pitch = 1.08
  synth.speak(u)
  try { synth.resume() } catch { /* iOS a veces queda en pausa */ }
}

export function speak(text, lang = 'es') {
  if (!speakSupported() || !text) return
  try {
    // Si las voces todavía no cargaron, esperá UNA vez al evento (clave en Safari/iOS).
    if (!cachedVoices.length) {
      refreshVoices()
      if (!cachedVoices.length) {
        let said = false
        const go = () => { if (said) return; said = true; try { speakNow(text, lang) } catch { /* noop */ } }
        try { window.speechSynthesis.addEventListener('voiceschanged', go, { once: true }) } catch { /* noop */ }
        setTimeout(go, 350) // respaldo si el evento nunca llega
        return
      }
    }
    speakNow(text, lang)
  } catch { /* noop */ }
}

export function stopSpeak() {
  if (speakSupported()) { try { window.speechSynthesis.cancel() } catch { /* noop */ } }
}
