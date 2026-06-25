import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { setSfxEnabled } from '../lib/sfx'

// Paso 4 — Música ambiental procedural (Web Audio API). Nada de archivos de audio.
const ROOT = 220 // A3
const semis = (n) => ROOT * Math.pow(2, n / 12)
const DORIAN = [0, 2, 3, 5, 7, 9, 10]
const PAD_INTERVALS = [0, 2, 3, 5]      // acorde Dórico, 4 voces
const ARP_SEQ = [0, 2, 4, 7, 4, 2, 6, 4]
const BASS_NOTES = [0, 7, 5, 3]
const BPM = 72
const BEAT = 60 / BPM
const MAX_GAIN = 0.45

export default function MusicEngine() {
  const { t } = useLang()
  const [on, setOn] = useState(false)
  const R = useRef({ ctx: null, master: null, timers: [], pads: [], started: false, noiseBuf: null })

  function ensureCtx() {
    const r = R.current
    if (r.ctx) return r.ctx
    const Ctx = window.AudioContext || window.webkitAudioContext
    const ctx = new Ctx()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    // buffer de ruido blanco para el stardust
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    r.ctx = ctx; r.master = master; r.noiseBuf = buf
    return ctx
  }

  function saturationCurve() {
    const n = 1024, c = new Float32Array(n)
    for (let i = 0; i < n; i++) { const x = (i / n) * 2 - 1; c[i] = Math.tanh(x * 2) }
    return c
  }

  function buildLayers() {
    const r = R.current
    const ctx = r.ctx, master = r.master
    const now = ctx.currentTime

    // 1) PAD ESPACIAL — 4 senos en acorde dórico + LFO en lowpass (respiración)
    const padFilter = ctx.createBiquadFilter()
    padFilter.type = 'lowpass'; padFilter.frequency.value = 900; padFilter.Q.value = 6
    padFilter.connect(master)
    const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.07; lfoGain.gain.value = 350
    lfo.connect(lfoGain); lfoGain.connect(padFilter.frequency); lfo.start()
    r.pads.push(lfo)
    for (const iv of PAD_INTERVALS) {
      const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = semis(iv)
      const g = ctx.createGain(); g.gain.value = 0.18
      const det = ctx.createOscillator(); det.frequency.value = semis(iv) * 1.005; det.type = 'sine'
      const dg = ctx.createGain(); dg.gain.value = 0.09
      osc.connect(g); g.connect(padFilter); det.connect(dg); dg.connect(padFilter)
      osc.start(now); det.start(now)
      r.pads.push(osc, det)
    }

    // 2) ARPEGGIO — triángulo, 72 BPM, octavas 1 y 2
    let arpI = 0
    const arpInt = setInterval(() => {
      const ctx = r.ctx; if (!ctx) return
      const idx = DORIAN[ARP_SEQ[arpI % ARP_SEQ.length] % DORIAN.length]
      arpI++
      for (const oct of [2, 4]) {
        const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = semis(idx) * oct
        const g = ctx.createGain()
        const tn = ctx.currentTime
        g.gain.setValueAtTime(0.0001, tn)
        g.gain.exponentialRampToValueAtTime(oct === 2 ? 0.10 : 0.05, tn + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, tn + 0.9)
        o.connect(g); g.connect(master); o.start(tn); o.stop(tn + 1)
      }
    }, BEAT * 1000)
    r.timers.push(arpInt)

    // 3) BAJO PULSANTE — sawtooth filtrado + saturación, cada 2 beats
    let bassI = 0
    const shaper = ctx.createWaveShaper(); shaper.curve = saturationCurve()
    const bassFilter = ctx.createBiquadFilter(); bassFilter.type = 'lowpass'; bassFilter.frequency.value = 420
    shaper.connect(bassFilter); bassFilter.connect(master)
    const bassInt = setInterval(() => {
      const ctx = r.ctx; if (!ctx) return
      const note = BASS_NOTES[bassI % BASS_NOTES.length]; bassI++
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = semis(note) / 2
      const g = ctx.createGain(); const tn = ctx.currentTime
      g.gain.setValueAtTime(0.0001, tn)
      g.gain.exponentialRampToValueAtTime(0.22, tn + 0.05)
      g.gain.exponentialRampToValueAtTime(0.0001, tn + BEAT * 1.8)
      o.connect(g); g.connect(shaper); o.start(tn); o.stop(tn + BEAT * 2)
    }, BEAT * 2 * 1000)
    r.timers.push(bassInt)

    // 4) SHIMMER CÓSMICO — senos agudos aleatorios, pan estéreo
    function shimmer() {
      const ctx = r.ctx; if (!ctx || !R.current.started) return
      const idx = DORIAN[Math.floor(Math.random() * DORIAN.length)]
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = semis(idx + 36)
      const g = ctx.createGain(); const pan = ctx.createStereoPanner()
      pan.pan.value = Math.random() * 2 - 1
      const tn = ctx.currentTime
      g.gain.setValueAtTime(0.0001, tn)
      g.gain.exponentialRampToValueAtTime(0.04, tn + 0.3)
      g.gain.exponentialRampToValueAtTime(0.0001, tn + 2.5)
      o.connect(g); g.connect(pan); pan.connect(master); o.start(tn); o.stop(tn + 2.6)
      const next = 800 + Math.random() * 1400
      r.timers.push(setTimeout(shimmer, next))
    }
    r.timers.push(setTimeout(shimmer, 1200))

    // 5) STARDUST — ruido blanco bandpass, whooshes
    function stardust() {
      const ctx = r.ctx; if (!ctx || !R.current.started) return
      const src = ctx.createBufferSource(); src.buffer = r.noiseBuf
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2
      const g = ctx.createGain()
      const tn = ctx.currentTime
      bp.frequency.setValueAtTime(400, tn)
      bp.frequency.exponentialRampToValueAtTime(3000, tn + 1.6)
      g.gain.setValueAtTime(0.0001, tn)
      g.gain.exponentialRampToValueAtTime(0.05, tn + 0.6)
      g.gain.exponentialRampToValueAtTime(0.0001, tn + 1.8)
      src.connect(bp); bp.connect(g); g.connect(master); src.start(tn); src.stop(tn + 2)
      const next = 4000 + Math.random() * 5000
      r.timers.push(setTimeout(stardust, next))
    }
    r.timers.push(setTimeout(stardust, 3000))
  }

  function start() {
    const r = R.current
    if (r.started) return
    const ctx = ensureCtx()
    if (ctx.state === 'suspended') ctx.resume()
    r.started = true
    buildLayers()
    // fadeIn 2.5s
    const now = ctx.currentTime
    r.master.gain.cancelScheduledValues(now)
    r.master.gain.setValueAtTime(Math.max(0.0001, r.master.gain.value), now)
    r.master.gain.linearRampToValueAtTime(MAX_GAIN, now + 2.5)
  }

  function stop() {
    const r = R.current
    if (!r.ctx || !r.started) return
    const now = r.ctx.currentTime
    r.master.gain.cancelScheduledValues(now)
    r.master.gain.setValueAtTime(r.master.gain.value, now)
    r.master.gain.linearRampToValueAtTime(0, now + 2) // fadeOut 2s
    setTimeout(() => {
      r.timers.forEach((tm) => { clearInterval(tm); clearTimeout(tm) })
      r.timers = []
      r.pads.forEach((o) => { try { o.stop() } catch { /* noop */ } })
      r.pads = []
      r.started = false
    }, 2050)
  }

  // Auto-activar en el primer click/touch (política de los navegadores)
  useEffect(() => {
    const handler = () => {
      if (!R.current.started) { start(); setOn(true) }
      window.removeEventListener('pointerdown', handler)
      window.removeEventListener('touchstart', handler)
    }
    window.addEventListener('pointerdown', handler)
    window.addEventListener('touchstart', handler)
    return () => {
      window.removeEventListener('pointerdown', handler)
      window.removeEventListener('touchstart', handler)
      const r = R.current
      r.timers.forEach((tm) => { clearInterval(tm); clearTimeout(tm) })
      r.pads.forEach((o) => { try { o.stop() } catch { /* noop */ } })
      try { r.ctx && r.ctx.close() } catch { /* noop */ }
    }
  }, [])

  function toggle() {
    if (on) { stop(); setOn(false); setSfxEnabled(false) }
    else { start(); setOn(true); setSfxEnabled(true) }
  }

  return (
    <button
      onClick={toggle}
      aria-label={on ? t('soundOff') : t('soundOn')}
      title={on ? t('soundOn') : t('soundOff')}
      style={{ position: 'fixed', bottom: 80, right: 16, zIndex: 50 }}
      className="w-12 h-12 rounded-full card grid place-items-center text-xl active:scale-90 transition"
    >
      {on ? '🔊' : '🔇'}
    </button>
  )
}
