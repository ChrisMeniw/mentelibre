import AnimeAvatar from '../AnimeAvatar'

// AKIRA — pelo blanco corto asimétrico que cubre el ojo derecho, ojo izquierdo rojo.
export default function Akira(props) {
  const hair = '#eef0f3'
  return (
    <AnimeAvatar
      id="akira" bg={['#3a1320', '#0b0710']} skin="#f0c6a4" eye="#ef4444" glow="#ef4444"
      idleClass="char-sway"
      hairBack={<path d="M30 70 Q26 26 60 22 Q94 26 90 70 L90 54 Q90 34 60 32 Q30 34 30 54 Z" fill={hair} />}
      hairFront={<>
        <path d="M33 38 Q60 24 87 38 L87 50 L80 42 L73 51 L66 42 L58 50 L50 42 L43 50 L37 43 L33 49 Z" fill={hair} />
        {/* mechón asimétrico que cae sobre el ojo derecho */}
        <path d="M62 30 Q86 30 88 42 Q90 62 78 70 Q70 74 66 60 Q72 56 70 46 Q68 38 62 38 Z" fill={hair} />
      </>}
      {...props}
    />
  )
}
