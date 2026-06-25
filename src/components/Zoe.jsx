// ZOE — la guía del juego (personaje agéntico de Chris Meniw). Avatar SVG simple y liviano.
export default function Zoe({ size = 64, className = '', style = {}, talking = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={style}
      role="img"
      aria-label="ZOE, tu guía"
    >
      <defs>
        <radialGradient id="zoeBody" cx="35%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#B79CFF" />
          <stop offset="55%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </radialGradient>
        <linearGradient id="zoeVisor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      {/* antena */}
      <line x1="32" y1="5" x2="32" y2="14" stroke="#B79CFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="4.5" r="3.2" fill="#FBBF24">
        {talking && <animate attributeName="r" values="3.2;4;3.2" dur="0.6s" repeatCount="indefinite" />}
      </circle>
      {/* cabeza */}
      <rect x="9" y="14" width="46" height="40" rx="17" fill="url(#zoeBody)" />
      <rect x="9" y="14" width="46" height="40" rx="17" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      {/* visor */}
      <rect x="15" y="22" width="34" height="20" rx="10" fill="url(#zoeVisor)" />
      {/* ojos */}
      <circle cx="26" cy="32" r="3.6" fill="#fff" />
      <circle cx="38" cy="32" r="3.6" fill="#fff" />
      <circle cx="26.9" cy="32.6" r="1.6" fill="#0F0A1E" />
      <circle cx="38.9" cy="32.6" r="1.6" fill="#0F0A1E" />
      {/* sonrisa */}
      <path d="M26 46 Q32 51 38 46" stroke="#FBBF24" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* mejillas */}
      <circle cx="18" cy="44" r="2.6" fill="#F472B6" opacity="0.55" />
      <circle cx="46" cy="44" r="2.6" fill="#F472B6" opacity="0.55" />
    </svg>
  )
}
