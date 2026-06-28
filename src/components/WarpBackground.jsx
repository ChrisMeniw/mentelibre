import { useEffect, useRef } from 'react'

// Fondo cósmico CALMO y premium: una capa de estrellas que respiran y derivan
// suavemente sobre la imagen de galaxia (bg-cosmos). Sin planetas de dibujito,
// sin HUD ni líneas de escaneo: el lujo está en la sobriedad. Canvas transparente
// para que se vea la galaxia de fondo (definida en el <body>).
export default function WarpBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 1.8)
    let raf = 0
    let frame = 0
    let stars = []
    let glows = []

    const rand = (a, b) => a + Math.random() * (b - a)

    function makeStar() {
      return {
        x: Math.random(), y: Math.random(),           // posición relativa (0..1)
        size: rand(0.5, 1.7),
        tw: Math.random() * Math.PI * 2,               // fase de centelleo
        twSpeed: rand(0.006, 0.022),
        drift: rand(0.000015, 0.00006),                // deriva vertical lentísima
        warm: Math.random() < 0.18,                    // unas pocas estrellas cálidas
      }
    }

    function setup() {
      W = canvas.clientWidth; H = canvas.clientHeight
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(90, Math.floor((W * H) / 16000))
      stars = Array.from({ length: count }, makeStar)
      // Dos auras violetas muy tenues que respiran (refuerzan la profundidad).
      glows = [
        { x: 0.5, y: 0.30, r: Math.max(W, H) * 0.55, c: '124,58,237', ph: rand(0, 6) },
        { x: 0.82, y: 0.80, r: Math.max(W, H) * 0.40, c: '14,165,233', ph: rand(0, 6) },
      ]
    }

    function tick() {
      frame++
      ctx.clearRect(0, 0, W, H)

      // Auras suaves (blend screen, alpha muy bajo).
      ctx.globalCompositeOperation = 'screen'
      for (const g of glows) {
        const t = frame * 0.0006
        const a = 0.05 + (Math.sin(t + g.ph) * 0.5 + 0.5) * 0.05
        const px = g.x * W, py = g.y * H
        const grad = ctx.createRadialGradient(px, py, 0, px, py, g.r)
        grad.addColorStop(0, `rgba(${g.c},${a})`)
        grad.addColorStop(1, `rgba(${g.c},0)`)
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.arc(px, py, g.r, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'

      // Estrellas que centellean y derivan apenas.
      for (const s of stars) {
        s.tw += s.twSpeed
        s.y += s.drift
        if (s.y > 1.02) { s.y = -0.02; s.x = Math.random() }
        const tw = 0.45 + (Math.sin(s.tw) * 0.5 + 0.5) * 0.55
        const x = s.x * W, y = s.y * H
        if (s.warm) ctx.fillStyle = `rgba(253,224,150,${0.7 * tw})`
        else ctx.fillStyle = `rgba(255,255,255,${0.8 * tw})`
        ctx.beginPath(); ctx.arc(x, y, s.size, 0, Math.PI * 2); ctx.fill()
        // halo sutil en las más grandes
        if (s.size > 1.2) {
          ctx.fillStyle = `rgba(200,210,255,${0.10 * tw})`
          ctx.beginPath(); ctx.arc(x, y, s.size * 2.6, 0, Math.PI * 2); ctx.fill()
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(tick)
    }

    const reduceMotion = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false

    function onResize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.8)
      setup()
      if (reduceMotion) tick()
    }

    setup()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden' }}>
      {/* Galaxia (Canva) en una capa fija real — evita el bug de background-attachment:fixed en iOS.
          Encima, un velo oscuro para asegurar legibilidad del texto. */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "linear-gradient(180deg, rgba(10,6,23,0.72) 0%, rgba(9,5,20,0.85) 55%, rgba(7,4,16,0.94) 100%), url('/bg-cosmos.png')",
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center top',
        backgroundRepeat: 'no-repeat, no-repeat',
      }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
