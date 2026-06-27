import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { setSfxEnabled } from '../lib/sfx'
import { subscribeGameplay, isGameplay } from '../lib/musicBus'

// Música arcade/casino procedural (Web Audio API). Sin archivos de audio.
// Pegadiza y en bucle: suena en el menú y se calla apenas se empieza a jugar.
const BPM = 112
const STEP_MS = (60 / BPM / 4) * 1000 // semicorchea
const MAX_GAIN = 0.42

// Melodía pegadiza (Do mayor pentatónica), una nota cada corchea sobre 2 compases.
const HOOK = [523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 783.99, 1046.5, 880.0, 783.99, 659.25, 783.99, 659.25, 587.33, 523.25, null]
const MEL = []
for (let i = 0; i < HOOK.length; i++) { MEL.push(HOOK[i]); MEL.push(null) } // 32 pasos: notas en pares
// Bajo saltarín, una nota por tiempo (I–V–vi–iii–IV–I–V–V)
const BASS = [65.41, 98.0, 110.0, 82.41, 87.31, 65.41, 98.0, 98.0]
const BELLS = [1568, 2093, 2349]

export default function MusicEngine() {
  const { t } = useLang()
  const [on, setOn] = useState(true) // música ON: arranca al entrar al juego (menú); se calla al jugar
  const onRef = useRef(true)         // misma intención, leída en vivo por la lógica de audio
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

  // Una nota corta con envolvente percutida.
  function blip(freq, dur, { type = 'triangle', gain = 0.08, pan = 0 } = {}) {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    let node = g
    if (pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); node = p }
    o.connect(g); node.connect(r.master); o.start(t0); o.stop(t0 + dur + 0.02)
  }

  function bass(freq) {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 620
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.34)
    o.connect(lp); lp.connect(g); g.connect(r.master); o.start(t0); o.stop(t0 + 0.36)
  }

  function kick() {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'sine'
    o.frequency.setValueAtTime(130, t0); o.frequency.exponentialRampToValueAtTime(48, t0 + 0.12)
    const g = ctx.createGain(); g.gain.setValueAtTime(0.5, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.16)
    o.connect(g); g.connect(r.master); o.start(t0); o.stop(t0 + 0.18)
  }

  function hat() {
    const r = R.current; const ctx = r.ctx; if (!ctx) return
    const t0 = ctx.currentTime
    const src = ctx.createBufferSource(); src.buffer = r.noiseBuf
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7000
    const g = ctx.createGain(); g.gain.setValueAtTime(0.1, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05)
    src.connect(hp); hp.connect(g); g.connect(r.master); src.start(t0); src.stop(t0 + 0.06)
  }

  function sequencer() {
    const r = R.current
    const seq = setInterval(() => {
      if (!r.ctx || !r.started) return
      const s = r.step % 32
      if (s % 4 === 0) { kick(); bass(BASS[(s / 4) % BASS.length]) }
      if (s % 4 === 2) hat()
      const m = MEL[s]
      if (m) blip(m, 0.2, { type: 'triangle', gain: 0.085, pan: s % 8 < 4 ? -0.12 : 0.12 })
      // Campanita brillante de casino al cerrar cada 2 bucles.
      if (s === 14 && Math.floor(r.step / 32) % 2 === 1) blip(BELLS[Math.floor(r.step / 32) % BELLS.length], 0.6, { type: 'sine', gain: 0.045 })
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
