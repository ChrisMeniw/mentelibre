import AnimeAvatar from '../AnimeAvatar'

// KURO — pelo negro con mechón blanco al frente, ojos grises, hoodie, chispa azul.
export default function Kuro(props) {
  const hair = '#16181f'
  return (
    <AnimeAvatar
      id="kuro" bg={['#243352', '#0a0f1c']} skin="#ecc4a0" eye="#cbd5e1" glow="#3b82f6"
      hairBack={<path d="M30 72 Q26 26 60 22 Q94 26 90 72 L90 56 Q90 34 60 32 Q30 34 30 56 Z" fill={hair} />}
      hairFront={<>
        <path d="M33 38 Q60 23 87 38 L87 51 L79 40 L73 52 L66 41 L60 53 L54 41 L47 52 L41 40 L33 51 Z" fill={hair} />
        <path d="M55 28 L60 53 L65 31 Z" fill="#f3f4f6" />
      </>}
      extras={<>
        <path d="M42 92 L52 101 L60 95 L68 101 L78 92 L81 120 L39 120 Z" fill="#1b2433" />
        <path d="M90 46 l-6 9 l5 1 l-6 9" stroke="#60a5fa" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9" />
      </>}
      {...props}
    />
  )
}
