import { useEffect, useRef, useState } from 'react'
import { stopSpeak } from '../lib/speak'

// Reconocimiento de voz del navegador (Web Speech API). Gratis, sin API key.
// Funciona en Chrome, Edge y Safari (iOS 14.5+) — perfecto para que los chicos hablen.
//
// ARREGLO "sale dos veces": antes acumulábamos los resultados con += a través de los
// eventos, y en iPhone/iPad Safari los resultados finales se RE-ENTREGAN → el texto se
// duplicaba. Ahora reconstruimos el texto COMPLETO desde e.results en cada evento (sin
// estado acumulado) y, por seguridad, colapsamos el eco si el navegador igual lo dobla.

const isIOS = typeof navigator !== 'undefined' &&
  (/iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

// Si el texto entero quedó repetido dos veces seguidas ("hola cómo estás hola cómo estás"),
// lo colapsamos a una sola vez. Solo actúa cuando la repetición es EXACTA y larga (8+ chars).
function collapseEcho(s) {
  const t = String(s || '').replace(/\s+/g, ' ').trim()
  const m = t.match(/^(.{8,}?)\s+\1$/i)
  return m ? m[1] : t
}

// Une los tramos FINALES saltando cualquier tramo idéntico al anterior (el navegador,
// sobre todo iOS/Safari, re-entrega el mismo final y eso metía texto de más).
function joinFinals(parts) {
  const out = []
  for (const p of parts) {
    const seg = String(p || '').replace(/\s+/g, ' ').trim()
    if (!seg) continue
    if (out.length && out[out.length - 1].toLowerCase() === seg.toLowerCase()) continue
    out.push(seg)
  }
  return out.join(' ')
}

export function useSpeech(lang = 'es-AR') {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const recRef = useRef(null)
  const onResultRef = useRef(null)

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }
    const rec = new SR()
    rec.lang = lang
    // En iOS `continuous` está roto (repite resultados): una frase por toque es más fiable.
    rec.continuous = !isIOS
    rec.interimResults = true
    rec.onresult = (e) => {
      // Separa FINALES de INTERIM. Al campo va SOLO lo finalizado (dedup + colapso de eco):
      // los interim son predicciones especulativas que suelen agregar palabras de más.
      // El interim se pasa aparte como vista previa; al finalizar, su final lo reemplaza,
      // así el texto guardado nunca queda más largo que lo hablado.
      const finals = [], interim = []
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]
        ;(r.isFinal ? finals : interim).push(r[0].transcript)
      }
      const committed = collapseEcho(joinFinals(finals))
      const preview = interim.join(' ').replace(/\s+/g, ' ').trim()
      if (onResultRef.current) onResultRef.current(committed, preview)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    return () => { try { rec.stop() } catch { /* noop */ } }
  }, [lang])

  const start = (onResult) => {
    const rec = recRef.current
    if (!rec) return
    stopSpeak() // que el micrófono NO capture la voz de ZOE (eco/basura en la respuesta)
    onResultRef.current = onResult
    try { rec.start(); setListening(true) } catch { /* ya estaba activo */ }
  }

  const stop = () => {
    try { recRef.current && recRef.current.stop() } catch { /* noop */ }
    setListening(false)
  }

  return { listening, supported, start, stop }
}
