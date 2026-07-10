import ChibiAvatar from '../ChibiAvatar'

// KIKO (6-8 · nivel 1) — pollito chibi con antena y alitas.
export default function Kiko(props) {
  return (
    <ChibiAvatar
      id="kiko" bg={['#fde68a', 'var(--gold-deep)']} eyeY={56}
      body={<g>
        <line x1="60" y1="16" x2="60" y2="7" stroke="var(--gold-deep)" strokeWidth="2.5" />
        <circle cx="60" cy="6" r="3" fill="#fb923c" />
        <path d="M51 20 Q60 9 69 20 Z" fill="var(--gold-deep)" />
        <ellipse cx="20" cy="66" rx="8" ry="13" fill="var(--gold)" />
        <ellipse cx="100" cy="66" rx="8" ry="13" fill="var(--gold)" />
        <path d="M55 64 L60 71 L65 64 Z" fill="#fb923c" />
      </g>}
      {...props}
    />
  )
}
