import AnimeAvatar from '../AnimeAvatar'

// SORA (9-11 · nivel 4) — pelo rojo corto revuelto, ojos dorados, cicatriz en la ceja.
export default function Sora(props) {
  const hair = '#ea580c'
  return (
    <AnimeAvatar
      id="sora" bg={['#b91c1c', '#1a0606']} skin="#f0c19a" eye="#fbbf24" glow="#fbbf24"
      hairBack={<path d="M30 68 Q26 27 60 23 Q94 27 90 68 L90 54 Q90 35 60 33 Q30 35 30 54 Z" fill={hair} />}
      hairFront={<path d="M32 42 Q42 27 49 38 Q55 26 61 38 Q68 27 78 37 Q84 30 88 43 L88 50 L79 42 L71 50 L63 42 L55 50 L47 42 L39 50 L32 49 Z" fill={hair} />}
      extras={<path d="M44 45 L54 49" stroke="#9a3412" strokeWidth="1.6" strokeLinecap="round" />}
      {...props}
    />
  )
}
