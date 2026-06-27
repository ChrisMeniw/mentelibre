import AnimeAvatar from '../AnimeAvatar'

// MIYAKO — pelo castaño con puntas violeta, ojos turquesa, auriculares al cuello.
export default function Miyako(props) {
  const hair = '#6b4a35'
  const tip = '#a855f7'
  return (
    <AnimeAvatar
      id="miyako" bg={['#4a3b66', '#16101f']} skin="#f1c9a5" eye="#2dd4bf" glow="#a855f7"
      hairBack={<>
        <path d="M28 86 Q24 28 60 22 Q96 28 92 86 L92 60 Q92 36 60 32 Q28 36 28 60 Z" fill={hair} />
        <path d="M28 70 L26 92 L36 90 L34 70 Z" fill={tip} />
        <path d="M92 70 L94 92 L84 90 L86 70 Z" fill={tip} />
      </>}
      hairFront={<>
        <path d="M33 38 Q60 24 87 38 L87 50 L80 42 L74 51 L68 43 L60 52 L52 43 L46 51 L40 42 L33 50 Z" fill={hair} />
        <path d="M33 47 L33 52 L40 50 Z" fill={tip} /><path d="M87 47 L87 52 L80 50 Z" fill={tip} />
      </>}
      extras={<>
        {/* auriculares colgando del cuello */}
        <path d="M36 84 Q60 102 84 84" stroke="#0f1620" strokeWidth="4" fill="none" />
        <rect x="30" y="80" width="11" height="14" rx="4" fill="#111827" stroke="#2dd4bf" strokeWidth="1.5" />
        <rect x="79" y="80" width="11" height="14" rx="4" fill="#111827" stroke="#2dd4bf" strokeWidth="1.5" />
      </>}
      {...props}
    />
  )
}
