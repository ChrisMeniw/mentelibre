// Texto-a-voz del navegador (Web Speech API). Gratis, sin API key.
// Para que los más chicos escuchen la pregunta sin tener que leer.
const LANGS = { es: 'es-US', pt: 'pt-BR' } // es-US = español neutro latino, pt-BR = portugués de Brasil

// Voces naturales y femeninas preferidas por idioma (cálidas, estilo ZOE).
const PREFERRED = {
  es: ['mónica', 'monica', 'paulina', 'esperanza', 'google español', 'sabina', 'helena', 'laura'],
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
  // La lista de voces suele cargar asincrónicamente: la actualizamos cuando llega.
  try { window.speechSynthesis.onvoiceschanged = refreshVoices } catch { /* noop */ }
}

// Elige la mejor voz para el idioma. Clave para que en portugués hable EN PORTUGUÉS.
function pickVoice(lang) {
  const voices = cachedVoices.length ? cachedVoices : refreshVoices()
  if (!voices.length) return null
  const prefix = lang === 'pt' ? 'pt' : 'es'
  const matches = voices.filter((v) => (v.lang || '').toLowerCase().startsWith(prefix))
  if (!matches.length) return null
  // 1) por nombre preferido (voces femeninas naturales)
  for (const name of (PREFERRED[lang] || [])) {
    const m = matches.find((v) => (v.name || '').toLowerCase().includes(name))
    if (m) return m
  }
  // 2) prioriza el dialecto exacto (pt-BR / es-US) sobre pt-PT / es-ES
  const want = (lang === 'pt' ? 'pt-br' : 'es-us')
  const exact = matches.find((v) => (v.lang || '').toLowerCase().replace('_', '-') === want)
  return exact || matches[0]
}

export function speak(text, lang = 'es') {
  if (!speakSupported() || !text) return
  try {
    window.speechSynthesis.cancel() // corta lo anterior
    const u = new SpeechSynthesisUtterance(text)
    u.lang = LANGS[lang] || 'es-US'
    const v = pickVoice(lang)
    if (v) u.voice = v // fija la voz del idioma correcto explícitamente
    u.rate = 0.95
    u.pitch = 1.08
    window.speechSynthesis.speak(u)
  } catch { /* noop */ }
}

export function stopSpeak() {
  if (speakSupported()) { try { window.speechSynthesis.cancel() } catch { /* noop */ } }
}
