import ChibiAvatar from '../ChibiAvatar'

// NUBE (6-8 · nivel 3) — nubecita chibi.
export default function Nube(props) {
  return (
    <ChibiAvatar
      id="nube" bg={['#a5b4fc', '#4f46e5']} eyeY={62}
      body={<g>
        <rect x="36" y="60" width="48" height="22" rx="11" fill="#fff" />
        <circle cx="44" cy="62" r="15" fill="#fff" />
        <circle cx="60" cy="54" r="20" fill="#fff" />
        <circle cx="78" cy="62" r="14" fill="#fff" />
        <path d="M30 70 Q60 90 90 70" stroke="#c7d2fe" strokeWidth="2" fill="none" opacity="0.7" />
      </g>}
      {...props}
    />
  )
}
