// Texto-a-voz del navegador (Web Speech API). Gratis, sin API key.
// Para que los más chicos escuchen la pregunta sin tener que leer.
const LANGS = { es: 'es-US', pt: 'pt-BR' } // es-US = español neutro latino

export function speakSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text, lang = 'es') {
  if (!speakSupported() || !text) return
  try {
    window.speechSynthesis.cancel() // corta lo anterior
    const u = new SpeechSynthesisUtterance(text)
    u.lang = LANGS[lang] || 'es-US'
    u.rate = 0.95
    u.pitch = 1.05
    window.speechSynthesis.speak(u)
  } catch { /* noop */ }
}

export function stopSpeak() {
  if (speakSupported()) { try { window.speechSynthesis.cancel() } catch { /* noop */ } }
}
