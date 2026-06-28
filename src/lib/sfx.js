// Efectos de sonido procedurales (Web Audio API). Sin archivos.
// Se crean dentro de gestos del usuario (onClick), así cumplen la política de autoplay.

let actx = null
let enabled = true

function ctx() {
  if (typeof window === 'undefined') return null
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    actx = new AC()
  }
  if (actx.state === 'suspended') actx.resume()
  return actx
}

export function setSfxEnabled(v) { enabled = !!v }
export function isSfxEnabled() { return enabled }

// Una nota corta con envolvente suave (y barrido opcional de frecuencia).
function tone(freq, dur, { type = 'sine', gain = 0.16, when = 0, sweepTo = null, pan = 0 } = {}) {
  const c = ctx()
  if (!c || !enabled) return
  const t0 = c.currentTime + when
  const o = c.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(freq, t0)
  if (sweepTo) o.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  let out = g
  if (pan && c.createStereoPanner) {
    const p = c.createStereoPanner()
    p.pan.value = pan
    g.connect(p)
    out = p
  }
  o.connect(g)
  out.connect(c.destination)
  o.start(t0)
  o.stop(t0 + dur + 0.03)
}

// Toque de botón — pop corto y burbujeante.
// Anti-doble: si se llama dos veces casi juntas (botón con su propio sonido + el
// detector global de toques), suena una sola vez.
let lastPop = -1000
export function sfxPop() {
  const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : 0
  if (now - lastPop < 80) return
  lastPop = now
  tone(420, 0.12, { type: 'triangle', gain: 0.14, sweepTo: 680 })
}

// Tic-tac de los últimos segundos — urgencia (más ruido en la cuenta regresiva).
export function sfxTick() {
  tone(1320, 0.05, { type: 'square', gain: 0.12 })
  tone(660, 0.05, { type: 'square', gain: 0.08, when: 0.005 })
}

// Enviar respuesta — whoosh ascendente.
export function sfxSend() {
  tone(300, 0.18, { type: 'sawtooth', gain: 0.09, sweepTo: 760 })
  tone(900, 0.22, { type: 'sine', gain: 0.05, when: 0.04, sweepTo: 1500 })
}

// La IA respondió — chispas alegres ascendentes.
export function sfxSparkle() {
  const notes = [880, 1175, 1568]
  notes.forEach((f, i) => tone(f, 0.26, { type: 'sine', gain: 0.07, when: i * 0.06, pan: i % 2 ? 0.3 : -0.3 }))
}

// Acierto / paso completado — dos notas felices.
export function sfxCorrect() {
  tone(659, 0.16, { type: 'triangle', gain: 0.14 })
  tone(988, 0.3, { type: 'triangle', gain: 0.11, when: 0.12 })
}

// Subir de nivel — fanfarria GRANDE y dinámica (riser + acorde + campanas).
export function sfxLevelUp() {
  // Riser que sube (tensión) antes del estallido.
  tone(220, 0.5, { type: 'sawtooth', gain: 0.06, sweepTo: 880 })
  // Fanfarria principal C–E–G–C–E (doblada con octava brillante).
  const seq = [523, 659, 784, 1047, 1319]
  seq.forEach((f, i) => {
    tone(f, 0.36, { type: 'triangle', gain: 0.18, when: 0.18 + i * 0.11, pan: i % 2 ? 0.3 : -0.3 })
    tone(f * 2, 0.34, { type: 'sine', gain: 0.06, when: 0.18 + i * 0.11 })
  })
  // Lluvia de campanitas que corona.
  const bells = [1568, 2093, 2637, 2093]
  bells.forEach((f, i) => tone(f, 0.5, { type: 'sine', gain: 0.07, when: 0.7 + i * 0.07, pan: i % 2 ? 0.4 : -0.4 }))
}

// Desafío completado — acorde + lluvia de chispas.
export function sfxComplete() {
  ;[523, 659, 784].forEach((f) => tone(f, 0.5, { type: 'sine', gain: 0.1 }))
  const notes = [1047, 1319, 1568, 2093]
  notes.forEach((f, i) => tone(f, 0.4, { type: 'triangle', gain: 0.07, when: 0.15 + i * 0.08, pan: i % 2 ? 0.4 : -0.4 }))
}

// ---- EFECTO 1: estrellas que aparecen una por una ----
export function sfxStar1() { tone(880, 0.09, { type: 'sine', gain: 0.18 }) }        // ding agudo
export function sfxStar2() { tone(660, 0.09, { type: 'sine', gain: 0.18 }) }        // ding medio
export function sfxStar3() { ;[523, 659, 784].forEach((f) => tone(f, 0.16, { type: 'triangle', gain: 0.12 })) } // acorde mayor
// Fanfarria corta Do-Mi-Sol ascendente (bonus de 3 estrellas).
export function sfxStarsFanfare() { ;[523, 659, 784].forEach((f, i) => tone(f, 0.2, { type: 'triangle', gain: 0.15, when: i * 0.1 })) }
// Pop suave del +XP flotante.
export function sfxXp() { tone(400, 0.07, { type: 'triangle', gain: 0.12, sweepTo: 640 }) }

// Racha / combo — arpegio que SUBE de tono con cada eslabón (adictivo, tipo arcade).
// n = largo de la racha (2, 3, 4...). Cuanto más alta, más brillante y triunfal.
export function sfxCombo(n) {
  const base = 660 * Math.pow(1.0595, Math.min(n, 8) * 2) // sube ~1 tono por nivel
  ;[0, 1, 2].forEach((i) => tone(base * Math.pow(1.26, i), 0.13, { type: 'triangle', gain: 0.13, when: i * 0.07, pan: i % 2 ? 0.3 : -0.3 }))
  tone(base * 2, 0.18, { type: 'sine', gain: 0.05, when: 0.14 }) // brillo de campana arriba
}

// Monedas — JACKPOT de casino: cascada de monedas metálicas cayendo a la bandeja.
export function sfxCoins() {
  const notes = [1568, 1976, 2349, 2093, 1760, 2637] // notas brillantes de "ting"
  const COUNT = 16
  for (let i = 0; i < COUNT; i++) {
    const f = notes[i % notes.length]
    tone(f, 0.12, { type: 'triangle', gain: 0.075, when: i * 0.04, pan: i % 2 ? 0.4 : -0.4 })
    tone(f * 2, 0.08, { type: 'sine', gain: 0.028, when: i * 0.04 }) // armónico = brillo de campana
  }
  // Campana final tipo "jackpot" que corona la lluvia de monedas.
  const end = COUNT * 0.04
  ;[1568, 2093, 2637].forEach((f, i) => tone(f, 0.5, { type: 'sine', gain: 0.06, when: end + i * 0.02 }))
}
