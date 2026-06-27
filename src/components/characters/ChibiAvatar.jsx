// Base para los personajes chibi (6-8): un objeto/criatura con carita kawaii.
// Cada personaje pasa su "body" (la forma) + colores. Ojos enormes, cachetes, sonrisa.
const reduce = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function mouth(mood) {
  switch (mood) {
    case 'happy':    return { d: 'M53 73 Q60 82 67 73', open: false }
    case 'excited':  return { d: 'M55 72 Q60 81 65 72 Q60 77 55 72', open: true }
    case 'thinking': return { d: 'M56 74 L64 74', open: false }
    case 'sad':      return { d: 'M54 76 Q60 71 66 76', open: false }
    default:         return { d: 'M55 73 Q60 78 65 73', open: false }
  }
}

export default function ChibiAvatar({
  size = 96, mood = 'idle', animated = true, idleClass = '',
  bg = ['#fde68a', '#f59e0b'], id = 'ch', body = null, eyeY = 60,
}) {
  const live = animated && !reduce()
  const m = mouth(mood)
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Personaje"
      className={live ? (idleClass || 'char-idle') : ''} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={`cb-${id}`} cx="50%" cy="40%" r="72%">
          <stop offset="0%" stopColor={bg[0]} /><stop offset="100%" stopColor={bg[1]} />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill={`url(#cb-${id})`} />
      {body}
      {/* ojos enormes */}
      <ellipse cx="48" cy={eyeY} rx="7.5" ry="9.5" fill="#2b2b35" />
      <ellipse cx="72" cy={eyeY} rx="7.5" ry="9.5" fill="#2b2b35" />
      <circle cx="50.5" cy={eyeY - 3} r="2.6" fill="#fff" />
      <circle cx="74.5" cy={eyeY - 3} r="2.6" fill="#fff" />
      <circle cx="45.5" cy={eyeY + 3} r="1.3" fill="#fff" opacity="0.8" />
      <circle cx="69.5" cy={eyeY + 3} r="1.3" fill="#fff" opacity="0.8" />
      {/* cachetes */}
      <circle cx="39" cy={eyeY + 8} r="4.2" fill="#ff9eb1" opacity="0.6" />
      <circle cx="81" cy={eyeY + 8} r="4.2" fill="#ff9eb1" opacity="0.6" />
      {/* boca */}
      {m.open
        ? <path d={m.d} fill="#c1486a" />
        : <path d={m.d} stroke="#7a4a3a" strokeWidth="2" fill="none" strokeLinecap="round" />}
      <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" />
    </svg>
  )
}
