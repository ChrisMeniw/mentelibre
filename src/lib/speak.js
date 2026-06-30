// Texto-a-voz. Voz principal: mujer joven REAL en la nube (proxy /api/tts). Respaldo: navegador.
import { setPlaybackAudioSession } from './audioUnlock'

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

// Señales de voz NATURAL (humana, no robótica): neuronales / de red / premium.
const NATURAL = ['neural', 'natural', 'premium', 'enhanced', 'online', 'siri', 'google', 'wavenet', 'multilingual', 'plus', 'naturalne']
// Voces ROBÓTICAS / de juguete que hay que EVITAR (las compactas y novelty de macOS/iOS).
const ROBOTIC = ['compact', 'eloquence', 'fred', 'albert', 'zarvox', 'novelty', 'bells', 'cellos', 'organ',
  'whisper', 'trinoids', 'wobble', 'pipe', 'bubbles', 'jester', 'bahh', 'boing', 'junior', 'ralph', 'kathy',
  'agnes', 'bruce', 'vicki', 'victoria', 'good news', 'bad news', 'reed', 'rocko', 'sandy', 'shelley', 'grandma', 'grandpa', 'flo']
const isRobotic = (v) => ROBOTIC.some((r) => (v.name || '').toLowerCase().includes(r))

// Puntúa una voz: NATURALIDAD manda (que NO suene robótica), luego mujer y dialecto.
function scoreVoice(v) {
  const l = norm(v)
  const n = (v.name || '').toLowerCase()
  let s = 0
  if (NATURAL.some((k) => n.includes(k))) s += 50     // voz humana (neuronal/red) → lo más importante
  if (v.localService === false) s += 25               // voces de red = casi siempre neuronales/naturales
  if (isRobotic(v)) s -= 60                            // castiga fuerte las robóticas/de juguete
  if (isFemale(v)) s += 15                             // ZOE es mujer
  if (LATAM.includes(l)) s += 4                        // dialecto latino
  if (l === 'es-us' || l === 'pt-br' || l === 'es-mx') s += 2
  return s
}
function bestVoice(pool) {
  if (!pool.length) return null
  // Preferí femeninas NO robóticas; si no hay, femeninas; si no, lo que haya.
  const ideal = pool.filter((v) => !isMale(v) && !isRobotic(v))
  const noMale = pool.filter((v) => !isMale(v))
  const use = ideal.length ? ideal : (noMale.length ? noMale : pool)
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
  // Chris pidió que NUNCA suene robótica: si lo único que ofrece el dispositivo es una voz
  // robótica/de juguete, preferimos el silencio (la voz natural de la nube es la principal).
  if (v && isRobotic(v)) return
  if (v) u.voice = v // voz LATAM (es) o pt-BR (pt); si no hay, queda u.lang
  // Voz de MUJER JOVEN, HUMANA (no robótica): ritmo natural y tono apenas cálido.
  // (Antes pitch 1.12 sonaba más sintético; 1.04 + rate 0.96 suena más persona.)
  u.rate = 0.96
  u.pitch = 1.04
  synth.speak(u)
  try { synth.resume() } catch { /* iOS a veces queda en pausa */ }
}

// Respaldo: voz del navegador (Web Speech) si la voz en la nube no carga.
function speakBrowser(text, lang = 'es') {
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

const TL = { es: 'es', pt: 'pt-BR' }
// WAV de silencio (0 muestras) para "desbloquear" el elemento de audio en el primer toque.
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
let ttsEl = null     // UN elemento reutilizable (no uno nuevo por pregunta)
let primed = false   // ¿ya se desbloqueó con un gesto? → puede sonar en la lectura automática

function getEl() {
  if (!ttsEl && typeof Audio !== 'undefined') { ttsEl = new Audio(); ttsEl.preload = 'auto' }
  return ttsEl
}

// En el PRIMER gesto del usuario reproducimos un silencio para habilitar el elemento.
// A partir de ahí la voz de la nube puede sonar SOLA (lectura automática de la pregunta),
// sin caer a la voz robótica del navegador por culpa del bloqueo de autoplay.
function primeTts() {
  if (primed) return
  const el = getEl()
  if (!el) return
  try {
    el.muted = true
    el.src = SILENCE
    const p = el.play()
    if (p && p.then) p.then(() => { try { el.pause() } catch { /* noop */ } el.muted = false; primed = true }).catch(() => { /* se reintenta en el próximo gesto */ })
    else { el.muted = false; primed = true }
  } catch { /* noop */ }
}
if (typeof window !== 'undefined') {
  const go = () => primeTts()
  ;['pointerdown', 'touchend', 'click', 'keydown'].forEach((e) => window.addEventListener(e, go, { passive: true }))
}

// Voz PRINCIPAL: mujer joven REAL (vía /api/tts), natural e IGUAL en todos los teléfonos.
// Usa el elemento ya desbloqueado, así suena también en la lectura automática. Si la nube
// falla, recién ahí cae al navegador (y este NUNCA usa una voz robótica).
export function speak(text, lang = 'es') {
  if (!text) return
  stopSpeak()
  try { setPlaybackAudioSession() } catch { /* noop */ } // iOS: ignora el switch de silencio
  const tl = TL[lang] || 'es'
  const el = getEl()
  if (!el) { speakBrowser(text, lang); return }
  try {
    el.muted = false
    el.volume = 1
    el.onerror = () => speakBrowser(text, lang)
    el.src = `/api/tts?tl=${tl}&q=${encodeURIComponent(String(text).slice(0, 280))}`
    const p = el.play()
    if (p && p.catch) p.catch(() => speakBrowser(text, lang)) // bloqueado/sin red → navegador (no robótica)
  } catch {
    speakBrowser(text, lang)
  }
}

export function stopSpeak() {
  if (ttsEl) { try { ttsEl.pause() } catch { /* noop */ } }
  if (speakSupported()) { try { window.speechSynthesis.cancel() } catch { /* noop */ } }
}
