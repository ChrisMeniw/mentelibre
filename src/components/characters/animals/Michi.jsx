import ChibiAvatar from '../ChibiAvatar'

// MICHI (6-8 · nivel 1) — gatito tierno.
export default function Michi(props) {
  return (
    <ChibiAvatar
      id="michi" bg={['#ffe1c2', '#f6a05b']} eyeY={60}
      body={<g>
        {/* orejas */}
        <path d="M30 18 L22 -2 L48 14 Z" fill="#f6a05b" stroke="#e8884a" strokeWidth="1.5" />
        <path d="M90 18 L98 -2 L72 14 Z" fill="#f6a05b" stroke="#e8884a" strokeWidth="1.5" />
        <path d="M33 13 L28 2 L43 12 Z" fill="#ffc9a0" />
        <path d="M87 13 L92 2 L77 12 Z" fill="#ffc9a0" />
        {/* nariz */}
        <path d="M56 67 L64 67 L60 72 Z" fill="#e26d8a" />
        {/* bigotes */}
        <g stroke="#c98a5a" strokeWidth="1.4" strokeLinecap="round" opacity="0.9">
          <line x1="28" y1="65" x2="45" y2="67" /><line x1="28" y1="72" x2="45" y2="72" />
          <line x1="92" y1="65" x2="75" y2="67" /><line x1="92" y1="72" x2="75" y2="72" />
        </g>
      </g>}
      {...props}
    />
  )
}
