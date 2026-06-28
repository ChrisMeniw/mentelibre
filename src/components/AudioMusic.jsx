import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { setSfxEnabled } from '../lib/sfx'
import { subscribeGameplay, isGameplay } from '../lib/musicBus'

// Música REAL (mp3): "Pixelland" de Kevin MacLeod (incompetech.com), CC BY 4.0.
// Suena en la intro y los menús (arranca al primer toque por política de autoplay),
// se calla mientras jugás una ronda y vuelve al salir. Botón para silenciar.
const TARGET_VOL = 0.5

export default function AudioMusic() {
  const { t } = useLang()
  const initialOn = (() => { try { return localStorage.getItem('ml_music') !== 'off' } catch { return true } })()
  const [on, setOn] = useState(initialOn)
  const onRef = useRef(initialOn)
  const audioRef = useRef(null)
  const gameplay = useRef(isGameplay())
  const gestured = useRef(false)
  const rafRef = useRef(0)

  function fadeTo(target) {
    cancelAnimationFrame(rafRef.current)
    const step = () => {
      const a = audioRef.current
      if (!a) return
      const d = target - a.volume
      if (Math.abs(d) < 0.02) { a.volume = Math.max(0, Math.min(1, target)); return }
      a.volume = Math.max(0, Math.min(1, a.volume + d * 0.1))
      rafRef.current = requestAnimationFrame(step)
    }
    step()
  }

  function sync() {
    const a = audioRef.current
    if (!a) return
    const shouldPlay = gestured.current && onRef.current && !gameplay.current
    if (shouldPlay) { a.play().then(() => fadeTo(TARGET_VOL)).catch(() => {}) }
    else { fadeTo(0); setTimeout(() => { const x = audioRef.current; if (x && !(gestured.current && onRef.current && !gameplay.current)) x.pause() }, 320) }
  }

  useEffect(() => {
    const a = new Audio('/musica.mp3')
    a.loop = true
    a.volume = 0
    a.preload = 'auto'
    audioRef.current = a
    setSfxEnabled(onRef.current)

    gameplay.current = isGameplay()
    const unsub = subscribeGameplay((g) => { gameplay.current = g; sync() })

    const events = ['pointerdown', 'touchstart', 'click', 'keydown']
    const tryStart = () => {
      gestured.current = true
      sync()
      const x = audioRef.current
      if (x && !x.paused) events.forEach((e) => window.removeEventListener(e, tryStart))
    }
    events.forEach((e) => window.addEventListener(e, tryStart, { passive: true }))

    const onVis = () => { const x = audioRef.current; if (!document.hidden && gestured.current && onRef.current && !gameplay.current && x && x.paused) sync() }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      events.forEach((e) => window.removeEventListener(e, tryStart))
      document.removeEventListener('visibilitychange', onVis)
      unsub()
      cancelAnimationFrame(rafRef.current)
      const x = audioRef.current; if (x) { x.pause(); audioRef.current = null }
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
