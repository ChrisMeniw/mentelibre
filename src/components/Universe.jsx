import { useEffect, useRef } from 'react'

// "Tu Universo": cada estrella de pensamiento se enciende como una estrella real
// y se acomoda con el ángulo áureo, formando una galaxia espiral que CRECE con tu
// forma de pensar. Cuanto más pensás, más grande y brillante tu universo.
export default function Universe({ lights = 0, size = 320, animated = true }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr; canvas.height = size * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const cx = size / 2, cy = size / 2
    const N = Math.max(0, Math.floor(lights))
    const GOLD = 2.39996323 // ángulo áureo (radianes)
    const spacing = (size * 0.46) / Math.sqrt(Math.max(N, 8)) // llena el círculo sin desbordar
    const reduce = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
    let raf = 0, t = 0

    const colorFor = (f) => (f < 0.34 ? [255, 220, 130] : f < 0.67 ? [190, 140, 255] : [120, 200, 255])

    function draw() {
      ctx.clearRect(0, 0, size, size)

      // Glow central que crece con las luces.
      const glowR = Math.min(size * 0.5, size * 0.14 + Math.sqrt(N) * spacing * 0.55)
      const gi = Math.min(0.55, 0.14 + N * 0.004)
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(glowR, 1))
      g.addColorStop(0, `rgba(196,150,255,${gi})`)
      g.addColorStop(0.5, `rgba(124,58,237,${gi * 0.45})`)
      g.addColorStop(1, 'rgba(124,58,237,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(glowR, 1), 0, Math.PI * 2); ctx.fill()

      const rot = animated && !reduce ? t * 0.00018 : 0

      // Líneas tenues entre estrellas vecinas (constelación viva).
      ctx.lineWidth = 1
      let prev = null
      for (let i = 0; i < N; i++) {
        const a = i * GOLD + rot
        const r = Math.sqrt(i + 0.5) * spacing
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r
        if (prev) { ctx.strokeStyle = 'rgba(168,140,255,0.09)'; ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(x, y); ctx.stroke() }
        prev = { x, y }
      }

      // Estrellas.
      for (let i = 0; i < N; i++) {
        const a = i * GOLD + rot
        const r = Math.sqrt(i + 0.5) * spacing
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r
        const [cr, cg, cb] = colorFor(i / Math.max(N, 1))
        const tw = animated && !reduce ? 0.55 + 0.45 * Math.sin(t * 0.05 + i * 0.7) : 0.85
        const sz = 1 + (i % 6 === 0 ? 1.5 : 0.5)
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.12 * tw})`
        ctx.beginPath(); ctx.arc(x, y, sz * 2.6, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${tw})`
        ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2); ctx.fill()
      }

      // Estrella-corazón en el centro.
      ctx.fillStyle = 'rgba(255,242,205,0.95)'
      ctx.beginPath(); ctx.arc(cx, cy, 2.6, 0, Math.PI * 2); ctx.fill()

      if (animated && !reduce && !hidden) { t++; raf = requestAnimationFrame(draw) }
    }

    let hidden = false
    draw()
    // Pausa la galaxia cuando la app queda oculta (ahorra batería en gama baja).
    const onVis = () => {
      hidden = document.hidden
      cancelAnimationFrame(raf)
      if (!hidden && animated && !reduce) raf = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis) }
  }, [lights, size, animated])

  return <canvas ref={ref} aria-hidden="true" style={{ width: size, height: size, display: 'block' }} />
}

// Hitos del universo: el "rango" sube a medida que encendés más estrellas.
export const UNIVERSE_MILESTONES = [
  { at: 0, es: 'Primera chispa', pt: 'Primeira faísca' },
  { at: 10, es: 'Constelación', pt: 'Constelação' },
  { at: 30, es: 'Nebulosa', pt: 'Nebulosa' },
  { at: 60, es: 'Galaxia', pt: 'Galáxia' },
  { at: 120, es: 'Supernova', pt: 'Supernova' },
  { at: 250, es: 'Universo entero', pt: 'Universo inteiro' },
]
export function universeRank(lights, lang = 'es') {
  let cur = UNIVERSE_MILESTONES[0], next = null
  for (let i = 0; i < UNIVERSE_MILESTONES.length; i++) {
    if (lights >= UNIVERSE_MILESTONES[i].at) cur = UNIVERSE_MILESTONES[i]
    else { next = UNIVERSE_MILESTONES[i]; break }
  }
  return { rank: lang === 'pt' ? cur.pt : cur.es, next: next ? { ...next, label: lang === 'pt' ? next.pt : next.es } : null }
}
