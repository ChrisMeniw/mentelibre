import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { setSfxEnabled } from '../lib/sfx'
import { subscribeGameplay, isGameplay } from '../lib/musicBus'

// Música arcade/casino procedural (Web Audio API). Sin archivos de audio.
// Pegadiza y en bucle: suena en el menú y se calla apenas se empieza a jugar.
const BPM = 126
const STEP_MS = (60 / BPM / 4) * 1000 // semicorchea (16th)
const MAX_GAIN = 0.40

// Estilo Fortnite/Roblox: EDM melódico y enérgico. Progresión en La menor
// Am – F – C – G (i–VI–III–VII), un acorde por compás de 16 semicorcheas.
const CHORDS = [
  [220.0, 261.63, 329.63, 440.0],   // Am  (A3 C4 E4 A4)
  [174.61, 220.0, 261.63, 349.23],  // F   (F3 A3 C4 F4)
  [261.63, 329.63, 392.0, 523.25],  // C   (C4 E4 G4 C5)
  [196.0, 246.94, 293.66, 392.0],   // G   (G3 B3 D4 G4)
]
// Arpegio saltarín (índices a los 4 tonos del acorde) — el "pluck" pegadizo tipo Fortnite.
const ARP = [0, 2, 1, 2, 3, 2, 1, 2, 0, 2, 3, 2, 1, 3, 2, 3]
const BASS_ROOT = [110.0, 87.31, 130.81, 98.0] // A2 F2 C3 G2

// Melodía/hook pegadizo encima del arpegio (64 semicorcheas; null = silencio).
const A4 = 440, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F4 = 349.23, G4 = 392.0, G5 = 783.99
const MELODY = [
  A4, null, E5, null, A4, null, C5, null, E5, null, null, D5, C5, null, A4, null, // Am
  F4, null, C5, null, F4, null, A4, null, C5, null, null, A4, F4, null, C5, null,  // F
  G4, null, E5, null, G4, null, C5, null, E5, null, null, G5, E5, null, C5, null,  // C
  G4, null, D5, null, G4, null, B4, null, D5, null, null, B4, G4, null, D5, null,  // G
]

export default function MusicEngine() {
  const { t } = useLang()
  // Música ENCENDIDA por defecto (suena al entrar con la intro); apagada solo si
  // el usuario la silenció (recuerda la elección en localStorage 'ml_music').
  const initialOn = (() => { try { return localStorage.getItem('ml_music') !== 'off' } catch { return true } })()
  const [on, setOn] = useState(initialOn)
  const onRef = useRef(initialOn) // misma intención, leída en vivo por la lógica de audio
  const R = useRef({ ctx: null, master: null, timers: [], started: false, noiseBuf: null, step: 0 })
  const gestured = useRef(false)
  const gameplay = useRef(isGameplay())

  function ensureCtx() {
    const r = R.current
    if (r.ctx) return r.ctx
    const Ctx = window.AudioContext || window.webkitAudioContext
    const ctx = new Ctx()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    r.ctx = ctx; r.master = master; r.noiseBuf = buf
    return ctx
  }

  // Pluck saltarín (saw+square con filtro que cae) — el alma del arpegio Fortnite.
  function pluck(freq, { gain = 0.055, pan = 0, dur = 0.19 } = {}) {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq
    const o2 = ctx.createOscillator(); o2.type = 'square'; o2.frequency.value = freq * 1.004
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'
    lp.frequency.setValueAtTime(4600, t0); lp.frequency.exponentialRampToValueAtTime(1100, t0 + dur)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.006)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    let node = g
    if (pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); node = p }
    o.connect(lp); o2.connect(lp); lp.connect(g); node.connect(r.master)
    o.start(t0); o2.start(t0); o.stop(t0 + dur + 0.03); o2.stop(t0 + dur + 0.03)
  }

  // Lead brillante (la melodía pegadiza) — square con filtro, bien al frente.
  function lead(freq, { gain = 0.085, pan = 0 } = {}) {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = freq
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = freq * 2 // brillo
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3400
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28)
    const g2 = ctx.createGain(); g2.gain.value = 0.3
    let node = g
    if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); node = p }
    o.connect(lp); lp.connect(g); o2.connect(g2); g2.connect(g); node.connect(r.master)
    o.start(t0); o2.start(t0); o.stop(t0 + 0.3); o2.stop(t0 + 0.3)
  }

  // Bajo saltarín con sub — gordo pero corto (groove de baile).
  function subbass(freq, { gain = 0.24 } = {}) {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq
    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = freq / 2
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2)
    o.connect(lp); lp.connect(g); sub.connect(g); g.connect(r.master)
    o.start(t0); sub.start(t0); o.stop(t0 + 0.22); sub.stop(t0 + 0.22)
  }

  function kick() {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'sine'
    o.frequency.setValueAtTime(150, t0); o.frequency.exponentialRampToValueAtTime(46, t0 + 0.11)
    const g = ctx.createGain(); g.gain.setValueAtTime(0.62, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.17)
    o.connect(g); g.connect(r.master); o.start(t0); o.stop(t0 + 0.19)
  }

  function hat() {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const src = ctx.createBufferSource(); src.buffer = r.noiseBuf
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 8000
    const g = ctx.createGain(); g.gain.setValueAtTime(0.09, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.04)
    src.connect(hp); hp.connect(g); g.connect(r.master); src.start(t0); src.stop(t0 + 0.05)
  }

  // Palmada en 2 y 4 (backbeat enérgico).
  function clap() {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const src = ctx.createBufferSource(); src.buffer = r.noiseBuf
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1600; bp.Q.value = 0.7
    const g = ctx.createGain(); g.gain.setValueAtTime(0.2, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.13)
    src.connect(bp); bp.connect(g); g.connect(r.master); src.start(t0); src.stop(t0 + 0.15)
  }

  // Acorde "supersaw" suave al inicio de cada compás (energía/relleno).
  function stab(freqs) {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.038, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55)
    lp.connect(g); g.connect(r.master)
    freqs.forEach((f) => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(lp); o.start(t0); o.stop(t0 + 0.58) })
  }

  function sequencer() {
    const r = R.current
    const seq = setInterval(() => {
      if (!r.ctx || !r.started) return
      const s = r.step % 64           // 4 compases de 16 semicorcheas
      const bar = Math.floor(s / 16)
      const st = s % 16
      // Batería: bombo en cada tiempo, palmada en 2 y 4, hats en contratiempos.
      if (st % 4 === 0) kick()
      if (st === 4 || st === 12) clap()
      if (st % 2 === 1) hat()
      // Bajo: en cada tiempo, con rebote de octava en el contratiempo.
      if (st % 4 === 0) subbass(BASS_ROOT[bar])
      else if (st % 2 === 0) subbass(BASS_ROOT[bar] * 2, { gain: 0.11 })
      // Arpegio pluck en cada semicorchea (paneado L/R).
      pluck(CHORDS[bar][ARP[st]], { gain: 0.05, pan: st % 4 < 2 ? -0.18 : 0.18 })
      // Melodía pegadiza por encima.
      const m = MELODY[s]
      if (m) lead(m, { gain: 0.085, pan: 0.04 })
      // Acorde de relleno al inicio de cada compás.
      if (st === 0) stab(CHORDS[bar])
      r.step++
    }, STEP_MS)
    r.timers.push(seq)
  }

  function start() {
    const r = R.current
    if (r.started) return
    const ctx = ensureCtx()
    if (ctx.state === 'suspended') ctx.resume()
    r.started = true; r.step = 0
    sequencer()
    // fade-in casi inmediato para que se escuche apenas se abre la página.
    const now = ctx.currentTime
    r.master.gain.cancelScheduledValues(now)
    r.master.gain.setValueAtTime(Math.max(0.0001, r.master.gain.value), now)
    r.master.gain.linearRampToValueAtTime(MAX_GAIN, now + 0.4)
  }

  function stop() {
    const r = R.current
    if (!r.ctx || !r.started) return
    const now = r.ctx.currentTime
    r.master.gain.cancelScheduledValues(now)
    r.master.gain.setValueAtTime(r.master.gain.value, now)
    r.master.gain.linearRampToValueAtTime(0, now + 0.6) // fade-out corto al empezar a jugar
    setTimeout(() => {
      r.timers.forEach((tm) => clearInterval(tm))
      r.timers = []
      r.started = false
    }, 650)
  }

  // ¿Debe sonar la música ahora mismo? (lee solo refs → siempre vigente)
  function sync() {
    const shouldPlay = gestured.current && onRef.current && !gameplay.current
    if (shouldPlay) start()
    else stop()
  }

  // El audio necesita un gesto del usuario (política de autoplay del navegador).
  useEffect(() => {
    // Estado inicial real (por si se entra directo a una pantalla de juego).
    gameplay.current = isGameplay()
    // Escucha cuándo se entra/sale del juego para callar/retomar la música.
    const unsub = subscribeGameplay((g) => { gameplay.current = g; sync() })

    // Intenta arrancar en CUALQUIER interacción y reintenta hasta que suene de verdad.
    const events = ['pointerdown', 'touchstart', 'click', 'keydown']
    const tryStart = () => {
      gestured.current = true
      const r = R.current
      if (r.ctx && r.ctx.state === 'suspended') r.ctx.resume()
      sync()
      if (r.ctx && r.ctx.state === 'running' && r.started) detach()
    }
    function detach() { events.forEach((e) => window.removeEventListener(e, tryStart)) }
    events.forEach((e) => window.addEventListener(e, tryStart, { passive: true }))

    // Al volver a la pestaña, reanuda el audio si el navegador lo suspendió.
    const onVis = () => { const r = R.current; if (!document.hidden && r.ctx && r.ctx.state === 'suspended') r.ctx.resume() }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      detach()
      document.removeEventListener('visibilitychange', onVis)
      unsub()
      const r = R.current
      r.timers.forEach((tm) => clearInterval(tm))
      try { r.ctx && r.ctx.close() } catch { /* noop */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // El botón controla la intención del usuario y los efectos de sonido.
  function toggle() {
    const next = !on
    setOn(next)
    onRef.current = next
    try { localStorage.setItem('ml_music', next ? 'on' : 'off') } catch { /* noop */ }
    setSfxEnabled(next)
    gestured.current = true
    sync()
  }

  return (
    <button
      onClick={toggle}
      aria-label={on ? t('soundOff') : t('soundOn')}
      title={on ? t('soundOff') : t('soundOn')}
      style={{ position: 'fixed', bottom: 80, right: 16, zIndex: 50 }}
      className="w-12 h-12 rounded-full card grid place-items-center text-xl active:scale-90 transition"
    >
      {on ? '🔊' : '🔇'}
    </button>
  )
}
