import { useEffect } from 'react'
import { sfxPop } from '../lib/sfx'

// Sonido GLOBAL + EXPLOSIÓN DE CHISPAS al tocar cualquier botón/enlace (estilo Roblox):
// ningún botón queda mudo ni sin efecto. El anti-doble de sfxPop evita repetir el sonido.
const SPARK_COLORS = ['#FBBF24', '#A855F7', '#38BDF8', '#F43F5E', '#34D399', '#ffffff']

function spawnSparks(x, y) {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const N = 7
    for (let i = 0; i < N; i++) {
      const ang = (Math.PI * 2 * i) / N + Math.random() * 0.6
      const dist = 22 + Math.random() * 24
      const s = document.createElement('span')
      s.className = 'tap-spark'
      s.style.cssText =
        `left:${x}px;top:${y}px;background:${SPARK_COLORS[i % SPARK_COLORS.length]};` +
        `--tx:${(Math.cos(ang) * dist).toFixed(1)}px;--ty:${(Math.sin(ang) * dist).toFixed(1)}px;`
      document.body.appendChild(s)
      setTimeout(() => s.remove(), 620)
    }
  } catch { /* noop */ }
}

export default function TapSound() {
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target && e.target.closest && e.target.closest('button, a, [role="button"], input[type="submit"], label')
      if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return
      sfxPop()
      const x = e.clientX || (el.getBoundingClientRect().left + el.offsetWidth / 2)
      const y = e.clientY || (el.getBoundingClientRect().top + el.offsetHeight / 2)
      spawnSparks(x, y)
    }
    document.addEventListener('click', onClick, true) // captura: corre siempre
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
