// Música de la INTRO: cálida, esperanzadora y cinematográfica — acorde al video
// inspirador (chico mirando un cielo de ideas). Web Audio, sin archivos.
// Progresión I–V–vi–IV en Do mayor (la más "esperanzadora") con pads suaves,
// un bajo tibio y una melodía de campanitas tipo celesta. Nada de casino acá.

let actx = null
let master = null
let barTimer = null
let started = false
let bar = 0

// Acordes (root, 3ª, 5ª) — Do, Sol, Lam, Fa
const CHORDS = [
  [261.63, 329.63, 392.0],  // C
  [246.94, 293.66, 392.0],  // G/B suave
  [261.63, 329.63, 440.0],  // Am
  [261.63, 349.23, 440.0],  // F add
]
const BASS = [130.81, 98.0, 110.0, 87.31]          // C2 · G2 · A2 · F2
// Melodía pentatónica, una frase simple por compás (índices de beat -> nota; null = silencio)
const MEL = [
  [659.25, null, 783.99, null],
  [587.33, null, 698.46, null],
  [659.25, null, 880.0, null],
  [698.46, null, 587.33, null],
]

const BAR_MS = 3000          // un acorde cada 3 s (lento, calmo)
const BEAT_MS = BAR_MS / 4

function ctx() {
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    actx = new AC()
    master = actx.createGain()
    master.gain.value = 0.0001
    master.connect(actx.destination)
  }
  if (actx.state === 'suspended') actx.resume()
  return actx
}

// Nota de pad: dos osciladores suaves con ataque y caída largos (almohada de aire).
function pad(freq, when, dur) {
  const c = actx, t0 = c.currentTime + when
  ;['sine', 'triangle'].forEach((type, i) => {
    const o = c.createOscillator(); o.type = type
    o.frequency.value = freq * (i ? 1.001 : 1)        // leve desafine = calidez
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(i ? 0.018 : 0.03, t0 + 0.5)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    const p = c.createStereoPanner ? c.createStereoPanner() : null
    if (p) { p.pan.value = i ? 0.15 : -0.15; o.connect(g); g.connect(p); p.connect(master) }
    else { o.connect(g); g.connect(master) }
    o.start(t0); o.stop(t0 + dur + 0.05)
  })
}

function subBass(freq, when, dur) {
  const c = actx, t0 = c.currentTime + when
  const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = freq
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(0.06, t0 + 0.3)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.05)
}

// Campanita/celesta: brillante y con cola, suena a "magia" e ilusión.
function bell(freq, when) {
  const c = actx, t0 = c.currentTime + when
  ;[1, 2].forEach((mult, i) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = freq * mult
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(i ? 0.02 : 0.07, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + (i ? 0.9 : 1.4))
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + 1.5)
  })
}

function playBar() {
  if (!actx) return
  const i = bar % 4
  pad(CHORDS[i][0], 0, BAR_MS / 1000 * 0.98)
  pad(CHORDS[i][1], 0.02, BAR_MS / 1000 * 0.98)
  pad(CHORDS[i][2], 0.04, BAR_MS / 1000 * 0.98)
  subBass(BASS[i], 0, BAR_MS / 1000 * 0.9)
  const phrase = MEL[i]
  phrase.forEach((n, beat) => { if (n) bell(n, (beat * BEAT_MS) / 1000) })
  bar++
}

export function startIntroMusic() {
  if (started) return
  const c = ctx(); if (!c) return
  started = true; bar = 0
  const now = c.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(0.0001, now)
  master.gain.exponentialRampToValueAtTime(0.5, now + 1.6)   // fade-in suave
  playBar()
  barTimer = setInterval(playBar, BAR_MS)
}

export function stopIntroMusic() {
  if (!actx || !started) return
  const c = actx, now = c.currentTime
  master.gain.cancelScheduledValues(now)
  master.gain.setValueAtTime(master.gain.value, now)
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)  // fade-out al entrar
  clearInterval(barTimer); barTimer = null; started = false
  setTimeout(() => { try { c.close() } catch { /* noop */ } actx = null; master = null }, 1000)
}

export function isIntroMusicOn() { return started }
