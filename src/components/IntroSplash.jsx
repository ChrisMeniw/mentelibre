import { useLang } from '../i18n'

// INTRO cinematográfica (siempre al abrir): video de fondo (ojo IA + código) +
// logo + título + saludo de ZOE + "¡Comenzar!". El toque arranca la música.
export default function IntroSplash({ onClose }) {
  const { t, lang } = useLang()
  const appName = lang === 'pt' ? 'Mente Livre' : 'Mente Libre'
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" onClick={onClose} role="dialog" aria-label={appName}>
      {/* Video cinematográfico de fondo */}
      <video
        autoPlay muted loop playsInline aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(1.15) contrast(1.05)' }}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      {/* Capa oscura para que el texto se lea bien */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 38%, rgba(10,6,23,0.30), rgba(10,6,23,0.93) 76%)' }} />

      <div className="relative z-10 h-full grid place-items-center px-6 text-center safe-top">
        <div className="flex flex-col items-center">
          <img
            src="/foundation-logo.webp"
            alt="Chris Meniw Foundation"
            width="84" height="84"
            className="rounded-full floaty fade-in"
            style={{ width: 84, height: 84, filter: 'drop-shadow(0 8px 24px rgba(124,58,237,0.7))' }}
          />
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/70 mt-2 font-extrabold fade-in">Chris Meniw Foundation</div>
          <h1 className="font-logo text-7xl grad-text leading-none mt-3 fade-in-d1" style={{ textShadow: '0 6px 30px rgba(124,58,237,0.6)' }}>{appName}</h1>
          <div className="text-[var(--gold)] font-extrabold mt-3 text-glow fade-in-d1">✨ {t('tagline')}</div>

          <div className="text-base font-bold text-white mt-6 max-w-xs leading-snug fade-in-d2">{t('homeWelcome')}</div>

          <button
            onClick={onClose}
            className="btn btn-gold mt-7 text-lg px-12 min-h-touch glow-pulse fade-in-d3"
            aria-label={t('introStart')}
          >
            {t('introStart')}
          </button>
          <div className="text-[10px] text-white/60 mt-3 fade-in-d3">{t('introTapHint')}</div>
        </div>
      </div>
    </div>
  )
}
