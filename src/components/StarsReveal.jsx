import { useEffect, useRef, useState } from 'react'
import { sfxStar1, sfxStar2, sfxStar3, sfxStarsFanfare, sfxXp } from '../lib/sfx'

// EFECTO 1 — las estrellas aparecen UNA POR UNA, con su "ding", partículas en la
// tercera y un destello dorado para ⭐⭐⭐. Respeta prefers-reduced-motion: muestra
// todo de una pero igual con los sonidos.
const SOUNDS = [sfxStar1, sfxStar2, sfxStar3]
const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const PARTICLES = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2
  return { tx: Math.cos(a) * 46, ty: Math.sin(a) * 46, delay: (i % 3) * 0.04 }
})

export default function StarsReveal({ stars = 0, size = 'text-3xl', xp = null }) {
  const [revealed, setRevealed] = useState(0)
  const [burst, setBurst] = useState(false)
  const [flash, setFlash] = useState(false)
  const [showXp, setShowXp] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    const n = Math.max(0, Math.min(5, stars))
    const snd = (i) => SOUNDS[Math.min(i, SOUNDS.length - 1)] // 4ª y 5ª reusan el "ding" más alto
    const t = []
    const push = (fn, ms) => t.push(setTimeout(fn, ms))

    if (reduceMotion()) {
      setRevealed(n)
      for (let i = 0; i < n; i++) push(() => snd(i) && snd(i)(), i * 60) // sin animación, con sonido
      if (n >= 4) push(() => sfxStarsFanfare(), 220) // festejo grande recién en 4-5★
      if (xp != null) setShowXp(true)
      timers.current = t
      return () => t.forEach(clearTimeout)
    }

    const base = 100
    for (let i = 0; i < n; i++) {
      push(() => { setRevealed(i + 1); snd(i) && snd(i)() }, base + i * 350)
    }
    const lastAt = base + (n - 1) * 350
    if (n >= 4) { // MUY BIEN: partículas + destello dorado + fanfarria en la última estrella
      push(() => setBurst(true), lastAt)
      push(() => { setFlash(true); sfxStarsFanfare() }, lastAt + 100)
      push(() => setFlash(false), lastAt + 520)
    }
    if (xp != null) {
      push(() => { setShowXp(true); sfxXp() }, base + n * 350 + 300)
    }
    timers.current = t
    return () => t.forEach(clearTimeout)
  }, [stars, xp])

  return (
    <div className="relative inline-flex flex-col items-center">
      {flash && <span className="screen-flash-gold" aria-hidden />}
      <div className="flex items-center justify-center gap-0.5" aria-label={`${stars} de 5 estrellas`}>
        {[1, 2, 3, 4, 5].map((s) => {
          const earned = s <= stars
          const visible = earned ? s <= revealed : true
          return (
            <span key={s} className="relative inline-block">
              <span
                className={size + ' inline-block ' + (earned && s <= revealed ? 'star-pop' : '')}
                style={{ opacity: visible ? 1 : 0, filter: earned ? 'none' : 'grayscale(1) opacity(0.25)' }}
              >⭐</span>
              {s === Math.min(5, stars) && burst && PARTICLES.map((p, i) => (
                <span key={i} className="star-particle" aria-hidden
                  style={{ '--tx': p.tx + 'px', '--ty': p.ty + 'px', animationDelay: p.delay + 's' }} />
              ))}
            </span>
          )
        })}
      </div>
      {xp != null && showXp && <span className="xp-float" aria-hidden>+{xp} XP</span>}
    </div>
  )
}
