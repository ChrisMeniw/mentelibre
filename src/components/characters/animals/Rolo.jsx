import ChibiAvatar from '../ChibiAvatar'

// ROLO (6-8 · nivel 2) — zorrito.
export default function Rolo(props) {
  return (
    <ChibiAvatar
      id="rolo" bg={['#fbbf24', '#ea7a2e']} eyeY={58}
      body={<g>
        {/* orejas puntiagudas con punta oscura */}
        <path d="M28 16 L18 -8 L50 12 Z" fill="#ea7a2e" />
        <path d="M92 16 L102 -8 L70 12 Z" fill="#ea7a2e" />
        <path d="M25 0 L18 -8 L33 7 Z" fill="#5b3a1a" />
        <path d="M95 0 L102 -8 L87 7 Z" fill="#5b3a1a" />
        {/* hocico blanco */}
        <ellipse cx="60" cy="75" rx="20" ry="14" fill="#fff7ed" opacity="0.95" />
        {/* nariz */}
        <ellipse cx="60" cy="69" rx="4" ry="3" fill="#3a2a1a" />
      </g>}
      {...props}
    />
  )
}
