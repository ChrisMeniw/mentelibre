import AnimeAvatar from '../AnimeAvatar'

// NOVA (9-11 · nivel 2) — pelo lila con coletas dobles, ojos violetas, libreta.
export default function Nova(props) {
  const hair = '#c084fc'
  const dark = '#a855f7'
  return (
    <AnimeAvatar
      id="nova" bg={['#7c3aed', '#1a0f33']} skin="#f6cdab" eye="#a78bfa" glow="#f0abfc"
      hairBack={<>
        <path d="M32 70 Q28 28 60 24 Q92 28 88 70 L88 54 Q88 36 60 34 Q32 36 32 54 Z" fill={hair} />
        {/* coletas */}
        <ellipse cx="26" cy="66" rx="9" ry="16" fill={hair} /><ellipse cx="94" cy="66" rx="9" ry="16" fill={hair} />
        <circle cx="26" cy="50" r="4" fill={dark} /><circle cx="94" cy="50" r="4" fill={dark} />
      </>}
      hairFront={<path d="M33 42 Q60 26 87 42 L87 50 Q74 44 60 46 Q46 44 33 50 Z" fill={hair} />}
      extras={<rect x="68" y="88" width="16" height="20" rx="2" fill="#fdf2f8" stroke={dark} strokeWidth="1.5" transform="rotate(-8 76 98)" />}
      {...props}
    />
  )
}
