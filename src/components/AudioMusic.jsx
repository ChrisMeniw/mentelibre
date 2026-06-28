import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { setSfxEnabled } from '../lib/sfx'
import { subscribeGameplay, isGameplay } from '../lib/musicBus'
import { setMusicKick } from '../lib/musicControl'
import { setPlaybackAudioSession } from '../lib/audioUnlock'

// Música REAL (mp3) reproducida por WEB AUDIO (no HTML5 <audio>): así suena en iPhone
// AUNQUE esté el switch de silencio activado — igual que los juegos. "Pixelland" de
// Kevin MacLeod (incompetech.com), CC BY 4.0. Arranca con el primer gesto del usuario.
const TARGET_VOL = 0.5

export default function AudioMusic() {
  const { t } = useLang()
  const initialOn = (() => { try { return localStorage.getItem('ml_music') !== 'off' } catch { return true } })()
  const [on, setOn] = useState(initialOn)
  const onRef = useRef(initialOn)
  const R = useRef({ ctx: null, buffer: null, source: null, gain: null, started: false, loading: false })
  const gameplay = useRef(isGameplay())
  const gestured = useRef(false)

  const desiredGain = () => (gestured.current && onRef.current && !gameplay.current) ? TARGET_VOL : 0

  function applyGain() {
    const r = R.current
    if (!r.ctx || !r.gain) return
    const now = r.ctx.currentTime
    r.gain.gain.cancelScheduledValues(now)
    r.gain.gain.setValueAtTime(r.gain.gain.value, now)
    r.gain.gain.linearRampToValueAtTime(desiredGain(), now + 0.35)
  }

  async function ensure() {
    const r = R.current
    if (!r.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return
      r.ctx = new AC()
      setPlaybackAudioSession() // iOS: música suena aunque el switch de silencio esté activado
      r.gain = r.ctx.createGain()
      r.gain.gain.value = 0
      r.gain.connect(r.ctx.destination)
    }
    if (!r.buffer && !r.loading) {
      r.loading = true
      try {
        const res = await fetch('/musica.mp3')
        const arr = await res.arrayBuffer()
        r.buffer = await new Promise((resolve, reject) => {
          const p = r.ctx.decodeAudioData(arr, resolve, reject)
          if (p && p.then) p.then(resolve, reject) // forma con promesa (navegadores nuevos)
        })
      } catch { /* noop */ } finally { r.loading = false }
    }
  }

  async function sync() {
    const r = R.current
    if (!gestured.current) return
    await ensure()
    if (!r.ctx) return
    if (r.ctx.state === 'suspended') { try { await r.ctx.resume() } catch { /* noop */ } }
    if (!r.started && r.buffer) {
      const src = r.ctx.createBufferSource()
      src.buffer = r.buffer
      src.loop = true
      src.connect(r.gain)
      try { src.start(0) } catch { /* noop */ }
      r.source = src
      r.started = true
    }
    applyGain()
  }

  useEffect(() => {
    setSfxEnabled(onRef.current)
    // Pre-decodificar el mp3 YA (mientras se ve la intro), así al tocar ¡Comenzar!
    // la música arranca al instante en vez de esperar ~2s a que decodifique.
    ensure().catch(() => { /* noop */ })
    gameplay.current = isGameplay()
    const unsub = subscribeGameplay((g) => { gameplay.current = g; applyGain() })
    // Arranque garantizado desde el gesto real de ¡Comenzar!.
    setMusicKick(() => { gestured.current = true; sync() })

    const events = ['pointerdown', 'touchstart', 'click', 'keydown']
    const tryStart = () => { gestured.current = true; sync() }
    events.forEach((e) => window.addEventListener(e, tryStart, { passive: true }))

    const onVis = () => { const r = R.current; if (!document.hidden && r.ctx && r.ctx.state === 'suspended' && gestured.current) r.ctx.resume() }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      events.forEach((e) => window.removeEventListener(e, tryStart))
      document.removeEventListener('visibilitychange', onVis)
      unsub(); setMusicKick(null)
      const r = R.current
      try { r.source && r.source.stop() } catch { /* noop */ }
      try { r.ctx && r.ctx.close() } catch { /* noop */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
