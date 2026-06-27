import ChibiAvatar from '../ChibiAvatar'

// RAYO (6-8 · nivel 4) — rayito chibi (carita redonda con cresta de rayo).
export default function Rayo(props) {
  return (
    <ChibiAvatar
      id="rayo" bg={['#fcd34d', '#d97706']} eyeY={60}
      idleClass="char-aura-strong"
      body={<g>
        <path d="M58 8 L45 30 L57 30 L51 46 L75 22 L62 22 L70 8 Z" fill="#fffbeb" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="24" cy="52" r="2" fill="#fffbeb" /><circle cx="96" cy="56" r="2.5" fill="#fffbeb" />
      </g>}
      {...props}
    />
  )
}
