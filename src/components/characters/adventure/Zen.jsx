import AnimeAvatar from '../AnimeAvatar'

// ZEN (9-11 · nivel 5) — pelo plateado, ojos violetas profundos, aura serena.
export default function Zen(props) {
  const hair = '#e5e7eb'
  return (
    <AnimeAvatar
      id="zen" bg={['#5b4b8a', '#120c24']} skin="#eecaa6" eye="#7c3aed" glow="#c4b5fd"
      idleClass="char-aura-strong"
      hairBack={<path d="M28 96 Q24 27 60 22 Q96 27 92 96 L92 58 Q92 35 60 33 Q28 35 28 58 Z" fill={hair} />}
      hairFront={<path d="M33 42 Q60 26 87 42 L87 51 L73 44 L60 49 L47 44 L33 51 Z" fill={hair} />}
      {...props}
    />
  )
}
