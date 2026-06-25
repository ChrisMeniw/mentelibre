import { useEffect, useState } from 'react'

// Compañero animado que reacciona y habla. Sube la diversión para los chicos.
// mood: 'idle' | 'thinking' | 'happy' | 'celebrate'
const SPARK_COLORS = ['#FBBF24', '#A855F7', '#10B981', '#0EA5E9', '#F43F5E']

export default function Mascot({ emoji = '🐬', color = '#7C3AED', name = '', mood = 'idle', message = '', size = 76 }) {
  const [sparks, setSparks] = useState([])

  useEffect(() => {
    if (mood === 'happy' || mood === 'celebrate') {
      const n = mood === 'celebrate' ? 16 : 8
      const arr = Array.from({ length: n }, (_, i) => ({
        id: i + '-' + mood + '-' + (i * 7),
        ang: (i / n) * Math.PI * 2 + (i % 2 ? 0.4 : 0),
        d: 30 + (i % 5) * 9,
        delay: (i % 4) * 0.05,
        color: SPARK_COLORS[i % SPARK_COLORS.length],
      }))
      setSparks(arr)
      const tm = setTimeout(() => setSparks([]), 950)
      return () => clearTimeout(tm)
    }
  }, [mood])

  const moodClass = {
    idle: 'mascot-idle',
    thinking: 'mascot-thinking',
    happy: 'mascot-happy',
    celebrate: 'mascot-celebrate',
  }[mood] || 'mascot-idle'

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {/* anillo de glow pulsante */}
        <span
          className="absolute inset-0 rounded-full pulse-ring"
          style={{ boxShadow: `0 0 0 2px ${color}55, 0 0 34px -2px ${color}` }}
        />
        {/* chispas al festejar */}
        {sparks.map((s) => (
          <span
            key={s.id}
            className="spark"
            style={{
              '--dx': `${Math.cos(s.ang) * s.d}px`,
              '--dy': `${Math.sin(s.ang) * s.d}px`,
              animationDelay: `${s.delay}s`,
              background: s.color,
            }}
          />
        ))}
        {/* cuerpo de la mascota */}
        <div
          className={`absolute inset-0 rounded-full grid place-items-center ${moodClass}`}
          style={{
            background: `radial-gradient(circle at 35% 28%, ${color}, ${color}88)`,
            fontSize: size * 0.5,
            boxShadow: 'inset 0 -7px 16px rgba(0,0,0,0.32), inset 0 5px 12px rgba(255,255,255,0.28)',
          }}
        >
          {emoji}
        </div>
        {mood === 'thinking' && (
          <span className="absolute -top-1 -right-1 text-base mascot-bubble">💭</span>
        )}
      </div>

      {message && (
        <div
          className="relative flex-1 card px-3.5 py-2.5 text-sm font-bold leading-snug pop-in speech"
          style={{ borderColor: `${color}55` }}
        >
          {name && <span className="text-[var(--violet-light)] font-extrabold">{name}: </span>}
          {message}
        </div>
      )}
    </div>
  )
}
