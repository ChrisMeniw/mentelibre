import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { setSfxEnabled } from '../lib/sfx'
import { subscribeGameplay, isGameplay } from '../lib/musicBus'
import { setMusicKick } from '../lib/musicControl'
import { setPlaybackAudioSession } from '../lib/audioUnlock'

// Música REAL en STREAMING (HTML5 <audio>): NO necesita "decodificar" el archivo
// (a diferencia de Web Audio), así que evita el fallo de decodeAudioData que dejaba
// la música muda en iPhone aunque los efectos sí sonaran. Con audioSession='playback'
// suena aunque el switch de silencio esté activado. "Pixelland" — Kevin MacLeod, CC BY 4.0.
const TARGET_VOL = 0.36

export default function AudioMusic() {
  const { t } = useLang()
  const initialOn = (() => { try { return localStorage.getItem('ml_music') !== 'off' } catch { return true } })()
  const [on, setOn] = useState(initialOn)
  const onRef = useRef(initialOn)
  const audioRef = useRef(null)
  const gameplay = useRef(isGameplay())
  const gestured = useRef(false)

  const shouldPlay = () => gestured.current && onRef.current && !gameplay.current

  // SINCRÓNICO dentro del gesto: arranca o pausa el <audio> según corresponda.
  function apply() {
    const a = audioRef.current
    if (!a) return
    setPlaybackAudioSession() // iOS: ignora el switch de silencio
    if (shouldPlay()) {
      a.volume = TARGET_VOL // iOS ignora volume y suena al nivel del sistema; en desktop fija el nivel
      const p = a.play()
      if (p && p.catch) p.catch(() => { /* navegador pidió otro gesto: se reintenta en el próximo toque */ })
    } else {
      try { a.pause() } catch { /* noop */ }
    }
  }

  useEffect(() => {
    const a = new Audio('/musica.mp3')
    a.loop = true
    a.preload = 'auto'
    a.volume = TARGET_VOL
    audioRef.current = a
    setSfxEnabled(onRef.current)

    gameplay.current = isGameplay()
    const unsub = subscribeGameplay((g) => { gameplay.current = g; apply() })
    // Arranque garantizado desde el gesto real de ¡Comenzar!.
    setMusicKick(() => { gestured.current = true; apply() })

    const events = ['pointerdown', 'touchstart', 'click', 'keydown']
    const tryStart = () => { gestured.current = true; apply() }
    events.forEach((e) => window.addEventListener(e, tryStart, { passive: true }))

    const onVis = () => { if (!document.hidden && shouldPlay()) apply() }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      events.forEach((e) => window.removeEventListener(e, tryStart))
      document.removeEventListener('visibilitychange', onVis)
      unsub(); setMusicKick(null)
      const a = audioRef.current; if (a) { a.pause(); audioRef.current = null }
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
    apply()
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
