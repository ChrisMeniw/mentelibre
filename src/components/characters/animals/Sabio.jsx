import ChibiAvatar from '../ChibiAvatar'

// SABIO (6-8 · nivel 5) — búho sabio.
export default function Sabio(props) {
  return (
    <ChibiAvatar
      id="sabio" bg={['#a78bfa', '#7c3aed']} eyeY={56}
      body={<g>
        {/* penachos (orejas de pluma) */}
        <path d="M34 12 L26 -6 L48 8 Z" fill="#7c3aed" />
        <path d="M86 12 L94 -6 L72 8 Z" fill="#7c3aed" />
        {/* discos grandes de los ojos */}
        <circle cx="48" cy="56" r="15" fill="#ede9fe" opacity="0.55" />
        <circle cx="72" cy="56" r="15" fill="#ede9fe" opacity="0.55" />
        {/* cejas sabias */}
        <path d="M37 43 Q48 38 58 45" stroke="#5b21b6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M62 45 Q72 38 83 43" stroke="#5b21b6" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* pico */}
        <path d="M55 64 L65 64 L60 73 Z" fill="#f59e0b" />
        {/* plumitas del pecho */}
        <path d="M48 86 q12 8 24 0" stroke="#ede9fe" strokeWidth="2" fill="none" opacity="0.5" />
      </g>}
      {...props}
    />
  )
}
