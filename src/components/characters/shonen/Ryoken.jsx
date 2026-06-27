import AnimeAvatar from '../AnimeAvatar'

// RYOKEN — pelo plateado largo, ojos violetas con pupila vertical, aura violeta.
export default function Ryoken(props) {
  const hair = '#d6d8e0'
  const mood = props.mood || 'idle'
  const iy = mood === 'sad' ? 60 : mood === 'thinking' ? 53 : 57 // sigue al iris de la base
  return (
    <AnimeAvatar
      id="ryoken" bg={['#3b2a66', '#0d0820']} skin="#eccaa8" eye="#a855f7" glow="#a855f7"
      idleClass="char-aura-strong"
      hairBack={<path d="M24 120 Q20 26 60 20 Q100 26 96 120 L96 60 Q96 34 60 32 Q24 34 24 60 Z" fill={hair} />}
      hairFront={<>
        <path d="M33 40 Q60 24 87 40 L87 52 L78 42 L70 53 L60 44 L50 53 L42 42 L33 52 Z" fill={hair} />
        <path d="M58 26 L60 54 L62 26 Z" fill="#b9bcc8" />
      </>}
      extras={<>
        {/* pupilas verticales (sobre el iris) */}
        <rect x="47.2" y={iy - 3.4} width="1.6" height="6.8" rx="0.8" fill="#1a0f24" />
        <rect x="71.2" y={iy - 3.4} width="1.6" height="6.8" rx="0.8" fill="#1a0f24" />
      </>}
      {...props}
    />
  )
}
