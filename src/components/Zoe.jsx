// ZOE — la guía del juego: la primera profesora IA de LATAM (creada por Chris Meniw).
// Muestra su foto real en un círculo con aro brillante.
export default function Zoe({ size = 64, className = '', style = {}, talking = false }) {
  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 ${talking ? 'glow-pulse' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: '0 0 0 2px rgba(168,85,247,0.65), 0 0 26px -4px rgba(168,85,247,0.7)',
        ...style,
      }}
      role="img"
      aria-label="ZOE, tu guía"
    >
      <img
        src="/zoe.jpg"
        alt="ZOE"
        width={size}
        height={size}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 28%' }}
      />
    </div>
  )
}
