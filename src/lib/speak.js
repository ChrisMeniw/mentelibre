// Texto-a-voz del navegador (Web Speech API). Gratis, sin API key.
// Para que los más chicos escuchen la pregunta sin tener que leer.
const LANGS = { es: 'es-US', pt: 'pt-BR' } // es-US = español neutro latino, pt-BR = portugués de Brasil

// Dialectos LATAM (NUNCA España es-ES). Se prioriza esto para que NO suene "española".
const LATAM = ['es-us', 'es-mx', 'es-419', 'es-ar', 'es-co', 'es-cl', 'es-pe', 'es-uy', 'es-ve', 'es-la', 'es-do', 'es-gt']

// ZOE es MUJER → la voz debe ser femenina. La Web Speech API no da el género
// de forma fiable, así que lo forzamos por nombre: preferir femeninas, excluir masculinas.
const FEMALE = [
  'paulina', 'angelica', 'angélica', 'sabina', 'dalia', 'monica', 'mónica', 'helena', 'laura',
  'esperanza', 'marisol', 'catalina', 'florencia', 'isabela', 'jimena', 'lucia', 'lucía',
  'luciana', 'francisca', 'maria', 'maría', 'joana', 'fernanda', 'camila', 'vitória', 'vitoria',
  'female', 'femenina', 'mujer', 'feminino', 'google español', 'google português', 'google portugues',
]
const MALE = [
  'juan', 'jorge', 'diego', 'carlos', 'miguel', 'pablo', 'roberto', 'andres', 'andrés', 'felipe',
  'ricardo', 'daniel', 'pedro', 'antonio', 'raul', 'raúl', 'gonzalo', 'mateo', 'thiago', 'fabio',
  'male', 'masculin', 'hombre', 'masculino',
]
const isMale = (v) => MALE.some((m) => (v.name || '').toLowerCase().includes(m))
const isFemale = (v) => FEMALE.some((f) => (v.name || '').toLowerCase().includes(f))

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

// Señales de voz NATURAL (no robótica). Estas voces son gratis; solo hay que
// tenerlas instaladas. macOS/iOS/Android traen variantes "enhanced/premium/natural".
const NATURAL = ['premium', 'enhanced', 'natural', 'neural', 'siri', 'google', 'wavenet', 'multilingual']

// Puntúa una voz: MUJER primero, luego natural (no robótica), luego dialecto.
function scoreVoice(v) {
  const l = norm(v)
  const n = (v.name || '').toLowerCase()
  let s = 0
  if (isFemale(v)) s += 20                             // ZOE es mujer → priorizar voz femenina
  if (NATURAL.some((k) => n.includes(k))) s += 6       // voz natural (no robótica)
  if (v.localService === false) s += 3                 // voces de red suelen ser más naturales
  if (l === 'es-us' || l === 'pt-br') s += 1
  if (l === 'es-mx') s += 1
  return s
}
function bestVoice(pool) {
  if (!pool.length) return null
  // Saca las voces masculinas; si por algún motivo no quedara ninguna, usa el pool completo.
  const noMale = pool.filter((v) => !isMale(v))
  const use = noMale.length ? noMale : pool
  return [...use].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0]
}

// Elige la mejor voz FEMENINA y natural para el idioma.
function pickVoice(lang) {
  const voices = cachedVoices.length ? cachedVoices : refreshVoices()
  if (!voices.length) return null

  if (lang === 'pt') {
    const m = voices.filter((v) => norm(v).startsWith('pt'))
    return bestVoice(m)
  }

  // ESPAÑOL: priorizar LATAM (evitar España es-ES); dentro de eso, la más natural.
  const es = voices.filter((v) => norm(v).startsWith('es'))
  if (!es.length) return null
  const latam = es.filter((v) => LATAM.includes(norm(v)))
  return bestVoice(latam.length ? latam : es)
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
