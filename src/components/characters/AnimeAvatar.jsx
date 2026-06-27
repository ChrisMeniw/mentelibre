// Base paramétrica para los personajes anime (SVG inline, sin imágenes externas).
// Cada personaje pasa su paleta + pelo (atrás/adelante) + extras. Las expresiones
// (ojos, cejas, boca) cambian con `mood`. Respeta prefers-reduced-motion.
const reduce = () =>
  typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Posición de iris y forma de cejas/boca según el estado de ánimo.
function expression(mood) {
  switch (mood) {
    case 'happy':    return { iy: 56, browL: 'M42 47 L54 44', browR: 'M66 44 L78 47', mouth: 'M52 73 Q60 81 68 73', open: false, wide: 1 }
    case 'thinking': return { iy: 53, browL: 'M42 47 L54 45', browR: 'M66 42 L78 46', mouth: 'M54 74 L66 74', open: false, wide: 0.95 }
    case 'excited':  return { iy: 55, browL: 'M42 44 L54 42', browR: 'M66 42 L78 44', mouth: 'M55 72 Q60 80 65 72 Q60 76 55 72', open: true, wide: 1.12 }
    case 'sad':      return { iy: 60, browL: 'M42 45 L54 48', browR: 'M66 48 L78 45', mouth: 'M52 76 Q60 70 68 76', open: false, wide: 0.92 }
    default:         return { iy: 57, browL: 'M42 46 L54 45', browR: 'M66 45 L78 46', mouth: 'M53 74 Q60 78 67 74', open: false, wide: 1 } // idle/neutral
  }
}

export default function AnimeAvatar({
  size = 96, mood = 'idle', animated = true, idleClass = '',
  bg = ['#1f2937', '#0b1220'], skin = '#f1c9a5', eye = '#9ca3af',
  hairBack = null, hairFront = null, extras = null, glow = null, id = 'c',
}) {
  const live = animated && !reduce()
  const e = expression(mood)
  const eyeRx = 6.2 * e.wide
  const eyeRy = 8.2

  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Personaje"
      className={live ? (idleClass || 'char-idle') : ''} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id={`bg-${id}`} cx="50%" cy="38%" r="75%">
          <stop offset="0%" stopColor={bg[0]} />
          <stop offset="100%" stopColor={bg[1]} />
        </radialGradient>
        <clipPath id={`clip-${id}`}><circle cx="60" cy="60" r="56" /></clipPath>
      </defs>

      {glow && live && <circle cx="60" cy="60" r="57" fill="none" stroke={glow} strokeWidth="3" opacity="0.5" className="char-aura" />}
      <circle cx="60" cy="60" r="56" fill={`url(#bg-${id})`} />

      <g clipPath={`url(#clip-${id})`}>
        {hairBack}
        {/* cuello + hombros (ropa, queda detrás de la cara) */}
        <path d="M40 96 Q60 84 80 96 L84 120 L36 120 Z" fill="#11151f" opacity="0.9" />
        <rect x="55" y="84" width="10" height="9" rx="4" fill={skin} />
        {/* cara */}
        <ellipse cx="60" cy="60" rx="24" ry="28" fill={skin} />
        <path d="M37 60 q-3 2 0 6" fill={skin} /><path d="M83 60 q3 2 0 6" fill={skin} />
        {/* ojos */}
        <g>
          <ellipse cx="48" cy="58" rx={eyeRx} ry={eyeRy} fill="#fff" />
          <ellipse cx="72" cy="58" rx={eyeRx} ry={eyeRy} fill="#fff" />
          <circle cx="48" cy={e.iy} r="4.4" fill={eye} />
          <circle cx="72" cy={e.iy} r="4.4" fill={eye} />
          <circle cx="48" cy={e.iy} r="2" fill="#0b0b12" />
          <circle cx="72" cy={e.iy} r="2" fill="#0b0b12" />
          <circle cx="46.6" cy={e.iy - 1.6} r="1.4" fill="#fff" />
          <circle cx="70.6" cy={e.iy - 1.6} r="1.4" fill="#fff" />
          {/* párpado superior */}
          <path d="M41 53 Q48 49 55 53" stroke="#3a2a22" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M65 53 Q72 49 79 53" stroke="#3a2a22" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
        {/* cejas */}
        <path d={e.browL} stroke="#2a1d16" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d={e.browR} stroke="#2a1d16" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* nariz */}
        <path d="M59 64 q1 2 2 0" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* boca */}
        {e.open
          ? <path d={e.mouth} fill="#7a3b3b" stroke="#5a2a2a" strokeWidth="1" />
          : <path d={e.mouth} stroke="#7a3b3b" strokeWidth="2" fill="none" strokeLinecap="round" />}
        {/* mejillas (excited) */}
        {mood === 'excited' && <><circle cx="44" cy="68" r="3" fill="#ff8da3" opacity="0.5" /><circle cx="76" cy="68" r="3" fill="#ff8da3" opacity="0.5" /></>}
        {/* lágrima (sad) */}
        {mood === 'sad' && live && <circle cx="72" cy="66" r="2" fill="#7dd3fc" className="char-tear" />}

        {hairFront}
        {extras}
      </g>

      <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" />
    </svg>
  )
}
