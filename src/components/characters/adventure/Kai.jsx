import AnimeAvatar from '../AnimeAvatar'

// KAI (9-11 · nivel 1) — pelo castaño desordenado, ojos celestes, correa de mochila.
export default function Kai(props) {
  const hair = '#8a5a3c'
  return (
    <AnimeAvatar
      id="kai" bg={['#2f6bdf', '#0b2350'] } skin="#f2c9a6" eye="#38bdf8" glow="#fb923c"
      hairBack={<path d="M30 68 Q26 28 60 24 Q94 28 90 68 L90 54 Q90 36 60 34 Q30 36 30 54 Z" fill={hair} />}
      hairFront={<path d="M32 42 Q42 26 50 37 Q56 25 62 37 Q70 26 80 37 Q85 30 88 44 L88 50 L80 43 L72 50 L64 43 L56 50 L48 43 L40 50 L32 49 Z" fill={hair} />}
      extras={<path d="M44 90 L44 120 M44 95 q14 -5 30 1" stroke="#fb923c" strokeWidth="3.5" fill="none" strokeLinecap="round" />}
      {...props}
    />
  )
}
