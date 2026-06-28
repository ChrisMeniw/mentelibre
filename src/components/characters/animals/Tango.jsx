import ChibiAvatar from '../ChibiAvatar'

// TANGO (6-8 · nivel 4) — tigrecito.
export default function Tango(props) {
  return (
    <ChibiAvatar
      id="tango" bg={['#fb923c', '#ea580c']} eyeY={60}
      body={<g>
        {/* orejas redondeadas */}
        <circle cx="30" cy="14" r="11" fill="#ea580c" />
        <circle cx="90" cy="14" r="11" fill="#ea580c" />
        <circle cx="30" cy="14" r="5" fill="#3a2a1a" />
        <circle cx="90" cy="14" r="5" fill="#3a2a1a" />
        {/* rayas */}
        <g fill="#3a2a1a">
          <path d="M60 6 q3 9 0 18 q-3 -9 0 -18Z" />
          <path d="M43 12 q5 7 4 16 q-7 -7 -4 -16Z" />
          <path d="M77 12 q-5 7 -4 16 q7 -7 4 -16Z" />
        </g>
        {/* hocico claro */}
        <ellipse cx="60" cy="75" rx="18" ry="12" fill="#ffe8d6" opacity="0.92" />
        {/* nariz */}
        <path d="M56 68 L64 68 L60 73 Z" fill="#e26d8a" />
      </g>}
      {...props}
    />
  )
}
