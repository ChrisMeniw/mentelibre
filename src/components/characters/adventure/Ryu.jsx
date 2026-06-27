import AnimeAvatar from '../AnimeAvatar'

// RYU (9-11 · nivel 3) — pelo azul oscuro liso, ojos grises, crucecita en la mejilla.
export default function Ryu(props) {
  const hair = '#1e3a8a'
  return (
    <AnimeAvatar
      id="ryu" bg={['#1e40af', '#070d20']} skin="#eec5a0" eye="#cbd5e1" glow="#22d3ee"
      hairBack={<path d="M30 70 Q26 28 60 24 Q94 28 90 70 L90 56 Q90 36 60 34 Q30 36 30 56 Z" fill={hair} />}
      hairFront={<path d="M32 44 Q60 26 88 44 L88 52 L74 44 L60 50 L46 44 L32 52 Z" fill={hair} />}
      extras={<path d="M74 66 l4 4 M76 66 l-4 4" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round" />}
      {...props}
    />
  )
}
