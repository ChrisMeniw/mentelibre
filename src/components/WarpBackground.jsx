import { useEffect, useRef } from 'react'

// Paso 3 — Fondo warp animado en <canvas>, detrás de todo. 9 capas.
export default function WarpBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0, cx = 0, cy = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 1.8)
    let raf = 0
    let frame = 0
    let warpSpeed = 0.12
    let targetSpeed = 0.12
    let burstUntil = 0

    let origins = []   // 5 orígenes: centro + 4 esquinas
    let stars = []
    let nebulas = []
    let planets = []
    let rings = []
    let lastRingBurst = 0

    const ORIGIN_COLORS = ['#0EA5E9', '#7C3AED', '#7C3AED', '#7C3AED', '#7C3AED']
    const NEB_COLORS = ['#7C3AED', '#0EA5E9', '#C832C8', '#10B981', '#FB6424']

    function rand(a, b) { return a + Math.random() * (b - a) }

    function makeStar() {
      const o = origins[Math.floor(Math.random() * origins.length)]
      const ang = Math.random() * Math.PI * 2
      return {
        ox: o.x, oy: o.y, ang,
        dist: rand(0, Math.max(W, H) * 0.5),
        speed: rand(0.00035, 0.0009),
        size: rand(0.6, 1.8),
        hue: o.color,
        tw: Math.random() * Math.PI * 2,
      }
    }

    function setup() {
      W = canvas.clientWidth; H = canvas.clientHeight
      cx = W / 2; cy = H / 2
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      origins = [
        { x: cx, y: cy, color: ORIGIN_COLORS[0] },
        { x: 0, y: 0, color: ORIGIN_COLORS[1] },
        { x: W, y: 0, color: ORIGIN_COLORS[2] },
        { x: 0, y: H, color: ORIGIN_COLORS[3] },
        { x: W, y: H, color: ORIGIN_COLORS[4] },
      ]

      const count = Math.min(130, Math.floor((W * H) / 11000))
      stars = Array.from({ length: count }, makeStar)

      nebulas = [
        { x: W * 0.15, y: H * 0.2, r: Math.max(W, H) * 0.4, c: NEB_COLORS[0], ph: rand(0, 6) },
        { x: W * 0.85, y: H * 0.18, r: Math.max(W, H) * 0.36, c: NEB_COLORS[1], ph: rand(0, 6) },
        { x: W * 0.2, y: H * 0.85, r: Math.max(W, H) * 0.42, c: NEB_COLORS[2], ph: rand(0, 6) },
        { x: W * 0.82, y: H * 0.82, r: Math.max(W, H) * 0.34, c: NEB_COLORS[3], ph: rand(0, 6) },
        { x: cx, y: cy, r: Math.max(W, H) * 0.5, c: NEB_COLORS[4], ph: rand(0, 6) },
      ]

      planets = [
        { x: W * 0.84, y: H * 0.16, r: Math.min(W, H) * 0.07, body: '#3B82F6', glow: '#60A5FA', rings: true, orbit: rand(0, 6) },
        { x: W * 0.14, y: H * 0.82, r: Math.min(W, H) * 0.055, body: '#7C3AED', glow: '#A855F7', rings: false, orbit: rand(0, 6) },
        { x: W * 0.86, y: H * 0.84, r: Math.min(W, H) * 0.05, body: '#10B981', glow: '#34D399', rings: false, orbit: rand(0, 6) },
      ]
      rings = []
    }

    // ---- Capas ----
    function drawBase() {
      const g = ctx.createRadialGradient(cx, cy * 0.8, 0, cx, cy, Math.max(W, H) * 0.9)
      g.addColorStop(0, '#120828')
      g.addColorStop(0.55, '#0A0418')
      g.addColorStop(1, '#04020D')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
    }

    function drawNebulas() {
      ctx.globalCompositeOperation = 'screen'
      for (const n of nebulas) {
        const t = frame * 0.0002
        const px = n.x + Math.sin(t + n.ph) * 40
        const py = n.y + Math.cos(t * 0.8 + n.ph) * 30
        const alpha = 0.10 + (Math.sin(t * 2 + n.ph) * 0.5 + 0.5) * 0.12
        const g = ctx.createRadialGradient(px, py, 0, px, py, n.r)
        g.addColorStop(0, hexA(n.c, alpha))
        g.addColorStop(1, hexA(n.c, 0))
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(px, py, n.r, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    function drawGrids() {
      const t = frame * 0.0008
      for (let oi = 0; oi < origins.length; oi++) {
        const o = origins[oi]
        const col = o.color
        ctx.save()
        ctx.translate(o.x, o.y)
        // arcos concéntricos avanzando
        for (let k = 0; k < 6; k++) {
          const prog = ((t + k / 6) % 1)
          const r = prog * Math.max(W, H) * 0.9
          const a = (0.13 - prog * 0.07)
          if (a <= 0) continue
          ctx.strokeStyle = hexA(col, a * 0.6)
          ctx.lineWidth = 1
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke()
        }
        // líneas radiales
        const spokes = 10
        ctx.strokeStyle = hexA(col, 0.07)
        for (let s = 0; s < spokes; s++) {
          const ang = (s / spokes) * Math.PI * 2
          ctx.beginPath(); ctx.moveTo(0, 0)
          ctx.lineTo(Math.cos(ang) * Math.max(W, H), Math.sin(ang) * Math.max(W, H))
          ctx.stroke()
        }
        ctx.restore()
      }
    }

    function drawPlanets() {
      for (const p of planets) {
        const t = frame * 0.0003 + p.orbit
        const px = p.x + Math.cos(t) * 14
        const py = p.y + Math.sin(t) * 10
        // glow
        const gl = ctx.createRadialGradient(px, py, 0, px, py, p.r * 2.4)
        gl.addColorStop(0, hexA(p.glow, 0.35))
        gl.addColorStop(1, hexA(p.glow, 0))
        ctx.fillStyle = gl
        ctx.beginPath(); ctx.arc(px, py, p.r * 2.4, 0, Math.PI * 2); ctx.fill()
        // anillos
        if (p.rings) {
          ctx.save(); ctx.translate(px, py); ctx.rotate(-0.5)
          ctx.strokeStyle = hexA('#93C5FD', 0.5); ctx.lineWidth = 3
          ctx.beginPath(); ctx.ellipse(0, 0, p.r * 1.9, p.r * 0.6, 0, 0, Math.PI * 2); ctx.stroke()
          ctx.restore()
        }
        // cuerpo
        const bg = ctx.createRadialGradient(px - p.r * 0.4, py - p.r * 0.4, 0, px, py, p.r)
        bg.addColorStop(0, lighten(p.body))
        bg.addColorStop(1, p.body)
        ctx.fillStyle = bg
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill()
      }
    }

    function drawStars() {
      for (const s of stars) {
        s.dist += s.speed * (1 + warpSpeed * 5) * Math.max(W, H)
        const maxd = Math.max(W, H) * 0.75
        if (s.dist > maxd) { Object.assign(s, makeStar()); s.dist = rand(0, 30) }
        const x = s.ox + Math.cos(s.ang) * s.dist
        const y = s.oy + Math.sin(s.ang) * s.dist
        const streak = warpSpeed * 26 * (s.dist / maxd)
        const x2 = s.ox + Math.cos(s.ang) * (s.dist - streak)
        const y2 = s.oy + Math.sin(s.ang) * (s.dist - streak)
        const tw = 0.6 + Math.sin(frame * 0.05 + s.tw) * 0.4
        if (warpSpeed > 0.22) {
          ctx.strokeStyle = hexA(s.hue, 0.4 * tw)
          ctx.lineWidth = s.size
          ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x, y); ctx.stroke()
        }
        ctx.fillStyle = hexA('#FFFFFF', 0.85 * tw)
        ctx.beginPath(); ctx.arc(x, y, s.size, 0, Math.PI * 2); ctx.fill()
      }
    }

    function drawRings() {
      const now = frame
      if (now - lastRingBurst > 600) {
        lastRingBurst = now
        for (const o of origins) {
          rings.push({ x: o.x, y: o.y, r: 0, life: 0, color: o.color })
          rings.push({ x: o.x, y: o.y, r: 0, life: -25, color: '#7C3AED' })
        }
      }
      ctx.globalCompositeOperation = 'screen'
      rings = rings.filter((r) => r.life < 140)
      for (const r of rings) {
        r.life += 1
        if (r.life < 0) continue
        r.r = r.life * 4.2
        const a = Math.max(0, 0.35 * (1 - r.life / 140))
        const g = ctx.createRadialGradient(r.x, r.y, r.r * 0.6, r.x, r.y, r.r)
        g.addColorStop(0, hexA('#0EA5E9', 0))
        g.addColorStop(0.8, hexA(r.color, a))
        g.addColorStop(1, hexA('#7C3AED', 0))
        ctx.strokeStyle = g
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    function drawLensFlare() {
      if (warpSpeed <= 0.4) return
      const a = (warpSpeed - 0.4) * 0.5
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.4)
      g.addColorStop(0, hexA('#BFDBFE', a))
      g.addColorStop(0.4, hexA('#A855F7', a * 0.4))
      g.addColorStop(1, hexA('#A855F7', 0))
      ctx.globalCompositeOperation = 'screen'
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(W, H) * 0.4, 0, Math.PI * 2); ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
    }

    function drawScanLine() {
      const y = (Math.sin(frame * 0.004) * 0.5 + 0.5) * H
      const g = ctx.createLinearGradient(0, y - 60, 0, y + 60)
      g.addColorStop(0, hexA('#0EA5E9', 0))
      g.addColorStop(0.5, hexA('#7C3AED', 0.05))
      g.addColorStop(1, hexA('#0EA5E9', 0))
      ctx.fillStyle = g
      ctx.fillRect(0, y - 60, W, 120)
    }

    function drawHUD() {
      ctx.strokeStyle = hexA('#A855F7', 0.35); ctx.lineWidth = 2
      const m = 18, L = 26
      const corners = [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]]
      for (const [x, y, dx, dy] of corners) {
        ctx.beginPath()
        ctx.moveTo(x, y + dy * L); ctx.lineTo(x, y); ctx.lineTo(x + dx * L, y); ctx.stroke()
      }
      // arco de velocidad centro inferior
      const by = H - 40, br = 26
      ctx.strokeStyle = hexA('#0EA5E9', 0.25); ctx.lineWidth = 4
      ctx.beginPath(); ctx.arc(cx, by, br, Math.PI * 0.85, Math.PI * 0.15, false); ctx.stroke()
      const p = Math.min(1, (warpSpeed - 0.15) / 0.65)
      ctx.strokeStyle = hexA('#A855F7', 0.8)
      ctx.beginPath(); ctx.arc(cx, by, br, Math.PI * 0.85, Math.PI * 0.85 + p * (Math.PI * 1.3), false); ctx.stroke()
    }

    function tick() {
      frame++
      // control de velocidad: ráfaga suave y ocasional (~cada 16s)
      if (frame % 1000 === 0) {
        targetSpeed = rand(0.22, 0.32) // ráfaga suave, ocasional
        burstUntil = frame + Math.floor(rand(80, 140))
      }
      if (frame > burstUntil && targetSpeed > 0.2) targetSpeed = rand(0.10, 0.15)
      warpSpeed += (targetSpeed - warpSpeed) * 0.008

      ctx.clearRect(0, 0, W, H)
      drawBase()
      drawNebulas()
      drawPlanets()
      drawStars()
      drawGrids()
      drawRings()
      drawLensFlare()
      drawScanLine()
      drawHUD()
      raf = requestAnimationFrame(tick)
    }

    function onResize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.8)
      setup()
    }

    setup()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: -10, display: 'block' }}
    />
  )
}

// ---- helpers de color ----
function hexA(hex, a) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}
function lighten(hex) {
  const h = hex.replace('#', '')
  const r = Math.min(255, parseInt(h.substring(0, 2), 16) + 70)
  const g = Math.min(255, parseInt(h.substring(2, 4), 16) + 70)
  const b = Math.min(255, parseInt(h.substring(4, 6), 16) + 70)
  return `rgb(${r},${g},${b})`
}
