import { useEffect, useRef, useState } from 'react'

// Reloj de la PARTIDA (tiempo total del juego, distinto al de cada pregunta).
// Cuenta hacia atrás mientras `running` sea true; al llegar a 0 dispara onEnd UNA vez.
// reset() vuelve a poner el total (para "Jugar otra vez").
export function mmss(s) {
  s = Math.max(0, Math.floor(s))
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0')
}

export function useMatchClock(total, running, onEnd) {
  const [left, setLeft] = useState(total)
  const onEndRef = useRef(onEnd)
  onEndRef.current = onEnd
  const firedRef = useRef(false)

  useEffect(() => {
    if (!running) return
    if (left <= 0) {
      if (!firedRef.current) { firedRef.current = true; onEndRef.current && onEndRef.current() }
      return
    }
    const id = setTimeout(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearTimeout(id)
  }, [left, running])

  const reset = () => { firedRef.current = false; setLeft(total) }
  return { left, reset }
}
