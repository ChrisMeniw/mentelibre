import { playZoeVoice } from '../lib/zoeVoice'
import { useLang } from '../i18n'

// ZOE — la guía del juego: la primera profesora IA de LATAM (creada por Chris Meniw).
// Muestra su foto real. Con `speakable`, al tocarla habla con su VOZ REAL.
export default function Zoe({ size = 64, className = '', style = {}, talking = false, speakable = false }) {
  const { t } = useLang()
  const ring = {
    width: size,
    height: size,
    boxShadow: '0 0 0 2px rgba(168,85,247,0.65), 0 0 26px -4px rgba(168,85,247,0.7)',
    ...style,
  }
  const img = (
    <img
      src="/zoe.jpg"
      alt="ZOE"
      width={size}
      height={size}
      loading="lazy"
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 28%' }}
    />
  )

  if (speakable) {
    const badge = Math.max(16, Math.round(size * 0.32))
    return (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); playZoeVoice() }}
        className={`relative rounded-full overflow-hidden shrink-0 active:scale-95 transition ${talking ? 'glow-pulse' : ''} ${className}`}
        style={ring}
        aria-label={t('zoeTapHint')}
        title={t('zoeTapHint')}
      >
        {img}
        {/* indicador de que se puede tocar para oír su voz real */}
        <span aria-hidden className="absolute bottom-0 right-0 grid place-items-center rounded-full text-[10px] leading-none"
          style={{ width: badge, height: badge, background: 'var(--violet-light)', boxShadow: '0 0 0 2px var(--bg-deep)' }}>🔊</span>
      </button>
    )
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 ${talking ? 'glow-pulse' : ''} ${className}`}
      style={ring}
      role="img"
      aria-label={t('zoeName')}
    >
      {img}
    </div>
  )
}
