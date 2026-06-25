import { useEffect, useRef, useState } from 'react'

// Reconocimiento de voz del navegador (Web Speech API). Gratis, sin API key.
// Funciona en Chrome, Edge y Safari (iOS 14.5+) — perfecto para que los chicos hablen.
export function useSpeech(lang = 'es-AR') {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const recRef = useRef(null)
  const onResultRef = useRef(null)
  const finalRef = useRef('')

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }
    const rec = new SR()
    rec.lang = lang
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const tr = e.results[i]
        if (tr.isFinal) finalRef.current += tr[0].transcript + ' '
        else interim += tr[0].transcript
      }
      if (onResultRef.current) onResultRef.current(finalRef.current + interim)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    return () => { try { rec.stop() } catch { /* noop */ } }
  }, [lang])

  const start = (onResult) => {
    const rec = recRef.current
    if (!rec) return
    finalRef.current = ''
    onResultRef.current = onResult
    try { rec.start(); setListening(true) } catch { /* ya estaba activo */ }
  }

  const stop = () => {
    try { recRef.current && recRef.current.stop() } catch { /* noop */ }
    setListening(false)
  }

  return { listening, supported, start, stop }
}
