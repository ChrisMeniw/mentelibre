import ChibiAvatar from '../ChibiAvatar'

// LUMI (6-8 · nivel 2) — estrellita chibi.
export default function Lumi(props) {
  return (
    <ChibiAvatar
      id="lumi" bg={['#bae6fd', '#2563eb']} eyeY={58}
      body={<g>
        <path d="M60 14 L70 46 L104 46 L77 66 L87 100 L60 80 L33 100 L43 66 L16 46 L50 46 Z"
          fill="#fde047" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="100" cy="26" r="2" fill="#fff" /><circle cx="22" cy="92" r="2" fill="#fff" />
      </g>}
      {...props}
    />
  )
}
