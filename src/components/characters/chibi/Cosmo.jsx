import ChibiAvatar from '../ChibiAvatar'

// COSMO (6-8 · nivel 5) — planetita chibi con anillo y estrellitas.
export default function Cosmo(props) {
  return (
    <ChibiAvatar
      id="cosmo" bg={['#4c1d95', '#0d0820']} eyeY={58}
      idleClass="char-aura-strong"
      body={<g>
        <ellipse cx="60" cy="62" rx="42" ry="13" fill="none" stroke="#fcd34d" strokeWidth="3" opacity="0.85" />
        <circle cx="60" cy="58" r="30" fill="#8b5cf6" />
        <circle cx="49" cy="49" r="4" fill="#a78bfa" opacity="0.55" />
        <circle cx="70" cy="64" r="3" fill="#a78bfa" opacity="0.45" />
        <path d="M16 30 l1.2 3.4 l3.4 1.2 l-3.4 1.2 l-1.2 3.4 l-1.2 -3.4 l-3.4 -1.2 l3.4 -1.2 Z" fill="#fcd34d" />
        <circle cx="100" cy="40" r="1.6" fill="#fff" />
      </g>}
      {...props}
    />
  )
}
