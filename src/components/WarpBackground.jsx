import { useEffect, useRef } from 'react'

// Fondo cósmico VIVO (luz + movimiento constante para enganchar a los chicos):
// estrellas que flotan y centellean, partículas de luz de colores que derivan,
// auras que respiran y se mueven, y estrellas fugaces de vez en cuando.
// Respeta "prefers-reduced-motion" (queda quieto si el sistema lo pide).
export default function WarpBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 1.8)
    let raf = 0, frame = 0
    let stars = [], motes = [], glows = []
    let shoot = null, nextShoot = 140

    const rand = (a, b) => a + Math.random() * (b - a)
    const MOTE_COLORS = ['253,224,150', '190,140,255', '120,200,255'] // dorado · violeta · celeste

    const makeStar = () => ({
      x: Math.random(), y: Math.random(),
      size: rand(0.5, 1.8),
      tw: Math.random() * Math.PI * 2, twSpeed: rand(0.01, 0.04),
      dx: rand(-0.00012, 0.00012), dy: rand(0.00018, 0.0007),  // flotan visiblemente
      warm: Math.random() < 0.2,
    })
    const makeMote = () => ({
      x: Math.random(), y: Math.random(),
      r: rand(1.2, 3.2), c: MOTE_COLORS[Math.floor(Math.random() * MOTE_COLORS.length)],
      tw: Math.random() * Math.PI * 2, twSpeed: rand(0.01, 0.03),
      dx: rand(-0.0004, 0.0004), dy: rand(-0.0007, -0.0002),   // suben como luciérnagas
    })

    function setup() {
      W = canvas.clientWidth; H = canvas.clientHeight
      canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: Math.min(110, Math.floor((W * H) / 12000)) }, makeStar)
      motes = Array.from({ length: Math.min(18, Math.floor((W * H) / 60000) + 8) }, makeMote)
      glows = [
        { x: 0.5, y: 0.28, r: Math.max(W, H) * 0.6, c: '124,58,237', ph: rand(0, 6) },
        { x: 0.82, y: 0.82, r: Math.max(W, H) * 0.45, c: '14,165,233', ph: rand(0, 6) },
        { x: 0.16, y: 0.68, r: Math.max(W, H) * 0.4, c: '244,63,94', ph: rand(0, 6) },
      ]
    }

    function spawnShoot() {
      const fromLeft = Math.random() < 0.5
      shoot = { x: fromLeft ? -0.05 : 1.05, y: rand(0.04, 0.5),
        vx: (fromLeft ? 1 : -1) * rand(0.012, 0.02), vy: rand(0.006, 0.012),
        life: 0, max: rand(45, 75) }
    }

    function tick() {
      frame++
      ctx.clearRect(0, 0, W, H)

      // Auras que respiran y se desplazan (suman luz).
      ctx.globalCompositeOperation = 'screen'
      for (const g of glows) {
        const t = frame * 0.0008
        const a = 0.05 + (Math.sin(t + g.ph) * 0.5 + 0.5) * 0.1
        const px = (g.x + Math.sin(t * 0.5 + g.ph) * 0.02) * W
        const py = (g.y + Math.cos(t * 0.4 + g.ph) * 0.02) * H
        const grad = ctx.createRadialGradient(px, py, 0, px, py, g.r)
        grad.addColorStop(0, `rgba(${g.c},${a})`); grad.addColorStop(1, `rgba(${g.c},0)`)
        ctx.fillStyle = grad
        ctx.beginPath(); ctx.arc(px, py, g.r, 0, Math.PI * 2); ctx.fill()
      }

      // Partículas de luz (luciérnagas) que derivan y brillan.
      for (const m of motes) {
        m.tw += m.twSpeed; m.x += m.dx; m.y += m.dy
        if (m.y < -0.05) { m.y = 1.05; m.x = Math.random() }
        if (m.x < -0.05) m.x = 1.05; else if (m.x > 1.05) m.x = -0.05
        const tw = 0.4 + (Math.sin(m.tw) * 0.5 + 0.5) * 0.6
        const x = m.x * W, y = m.y * H
        ctx.fillStyle = `rgba(${m.c},${0.16 * tw})`
        ctx.beginPath(); ctx.arc(x, y, m.r * 3, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = `rgba(${m.c},${0.9 * tw})`
        ctx.beginPath(); ctx.arc(x, y, m.r, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'

      // Estrellas que flotan y centellean.
      for (const s of stars) {
        s.tw += s.twSpeed; s.x += s.dx; s.y += s.dy
        if (s.y > 1.02) { s.y = -0.02; s.x = Math.random() }
        if (s.x > 1.02) s.x = -0.02; else if (s.x < -0.02) s.x = 1.02
        const tw = 0.4 + (Math.sin(s.tw) * 0.5 + 0.5) * 0.6
        const x = s.x * W, y = s.y * H
        ctx.fillStyle = s.warm ? `rgba(253,224,150,${0.75 * tw})` : `rgba(255,255,255,${0.85 * tw})`
        ctx.beginPath(); ctx.arc(x, y, s.size, 0, Math.PI * 2); ctx.fill()
        if (s.size > 1.2) { ctx.fillStyle = `rgba(200,210,255,${0.12 * tw})`; ctx.beginPath(); ctx.arc(x, y, s.size * 2.8, 0, Math.PI * 2); ctx.fill() }
      }

      // Estrella fugaz de vez en cuando (a los chicos les encanta).
      if (!shoot) { nextShoot--; if (nextShoot <= 0) { spawnShoot(); nextShoot = Math.floor(rand(200, 460)) } }
      else {
        shoot.life++; shoot.x += shoot.vx; shoot.y += shoot.vy
        const x = shoot.x * W, y = shoot.y * H
        const tailX = x - shoot.vx * W * 8, tailY = y - shoot.vy * H * 8
        const a = Math.sin((shoot.life / shoot.max) * Math.PI)
        const grad = ctx.createLinearGradient(tailX, tailY, x, y)
        grad.addColorStop(0, 'rgba(255,255,255,0)'); grad.addColorStop(1, `rgba(255,245,220,${0.9 * a})`)
        ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.lineCap = 'round'
        ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(x, y); ctx.stroke()
        ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill()
        if (shoot.life > shoot.max || shoot.x < -0.12 || shoot.x > 1.12) shoot = null
      }

      if (!reduceMotion && !hidden) raf = requestAnimationFrame(tick)
    }

    const reduceMotion = typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false

    function onResize() { dpr = Math.min(window.devicePixelRatio || 1, 1.8); setup(); if (reduceMotion) tick() }

    let hidden = false
    setup()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', onResize)
    // Pausa el canvas cuando la pestaña/app queda oculta (ahorra batería y CPU en gama baja).
    const onVis = () => {
      hidden = document.hidden
      cancelAnimationFrame(raf)
      if (!hidden && !reduceMotion) raf = requestAnimationFrame(tick)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis) }
  }, [])

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -10, overflow: 'hidden' }}>
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
