import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { setSfxEnabled } from '../lib/sfx'
import { subscribeGameplay, isGameplay } from '../lib/musicBus'
import { setMusicKick } from '../lib/musicControl'

// Música REAL (mp3): "Pixelland" de Kevin MacLeod (incompetech.com), CC BY 4.0.
// Suena en la intro y los menús (arranca al primer toque por política de autoplay),
// se calla mientras jugás una ronda y vuelve al salir. Botón para silenciar.
const TARGET_VOL = 0.6

export default function AudioMusic() {
  const { t } = useLang()
  const initialOn = (() => { try { return localStorage.getItem('ml_music') !== 'off' } catch { return true } })()
  const [on, setOn] = useState(initialOn)
  const onRef = useRef(initialOn)
  const audioRef = useRef(null)
  const gameplay = useRef(isGameplay())
  const gestured = useRef(false)

  // Sin fades raros: fijamos el volumen directo y reproducimos. (iOS ignora .volume
  // y suena al nivel del sistema; en desktop fija el nivel.) Así nunca queda "sonando en mudo".
  function sync() {
    const a = audioRef.current
    if (!a) return
    const shouldPlay = gestured.current && onRef.current && !gameplay.current
    if (shouldPlay) {
      a.volume = TARGET_VOL
      const p = a.play()
      if (p && p.catch) p.catch(() => {})
    } else {
      try { a.pause() } catch { /* noop */ }
    }
  }

  useEffect(() => {
    const a = new Audio('/musica.mp3')
    a.loop = true
    a.volume = TARGET_VOL
    a.preload = 'auto'
    audioRef.current = a
    setSfxEnabled(onRef.current)

    gameplay.current = isGameplay()
    const unsub = subscribeGameplay((g) => { gameplay.current = g; sync() })
    // Arranque garantizado desde un gesto real (ej. tocar ¡Comenzar!).
    setMusicKick(() => { gestured.current = true; sync() })

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
      setMusicKick(null)
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
