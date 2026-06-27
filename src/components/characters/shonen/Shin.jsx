import AnimeAvatar from '../AnimeAvatar'

// SHIN — pelo rojo intenso de punta, ojos ámbar, tatuaje tribal en el cuello.
export default function Shin(props) {
  const hair = '#c2261d'
  const dark = '#7f140f'
  return (
    <AnimeAvatar
      id="shin" bg={['#5a1a14', '#140807']} skin="#eec09a" eye="#f59e0b" glow="#f59e0b"
      hairBack={<path d="M30 70 Q26 26 60 22 Q94 26 90 70 L90 54 Q90 34 60 32 Q30 34 30 54 Z" fill={hair} />}
      hairFront={<>
        {/* picos hacia arriba */}
        <path d="M32 40 L36 20 L44 38 L50 18 L58 38 L60 16 L68 38 L74 19 L80 38 L84 22 L88 42 L88 52 L80 41 L73 52 L66 41 L60 53 L54 41 L47 52 L40 41 L32 51 Z" fill={hair} />
        <path d="M50 18 L54 34 L58 19 Z" fill={dark} />
      </>}
      extras={<>
        {/* tatuaje tribal en el cuello */}
        <path d="M64 90 q4 4 2 9 q4 -2 5 3 M67 92 q-1 5 3 7" stroke="#1a1320" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
      </>}
      {...props}
    />
  )
}
