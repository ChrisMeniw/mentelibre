import { useLang } from '../i18n'
import Zoe from './Zoe'

// Pantalla de INTRO del juego (siempre al abrir). Logo + ZOE + título + "¡Comenzar!".
// El toque en "Comenzar" arranca la música (gesto que el navegador necesita).
export default function IntroSplash({ onClose }) {
  const { t, lang } = useLang()
  const appName = lang === 'pt' ? 'Mente Livre' : 'Mente Libre'
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center px-6 text-center safe-top"
      style={{ background: 'radial-gradient(circle at 50% 28%, #1c1142, #0a0617 72%)' }}
      onClick={onClose}
      role="dialog"
      aria-label={appName}
    >
      <div className="flex flex-col items-center">
        <img
          src="/foundation-logo.webp"
          alt="Chris Meniw Foundation"
          width="118" height="118"
          className="rounded-full floaty fade-in"
          style={{ width: 118, height: 118, filter: 'drop-shadow(0 12px 34px rgba(124,58,237,0.6))' }}
        />
        <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-dim)] mt-3 font-extrabold fade-in">Chris Meniw Foundation</div>
        <h1 className="font-logo text-6xl grad-text leading-none mt-3 fade-in-d1">{appName}</h1>
        <div className="text-[var(--gold)] font-extrabold mt-3 text-glow fade-in-d1">✨ {t('tagline')}</div>

        <div className="mt-7 fade-in-d2"><Zoe size={88} talking /></div>
        <div className="text-sm font-bold mt-3 max-w-xs leading-snug fade-in-d2">{t('homeWelcome')}</div>

        <button
          onClick={onClose}
          className="btn btn-gold mt-8 text-lg px-12 min-h-touch glow-pulse fade-in-d3"
          aria-label={t('introStart')}
        >
          {t('introStart')}
        </button>
        <div className="text-[10px] text-[var(--text-dim)] mt-3 fade-in-d3">{t('introTapHint')}</div>
      </div>
    </div>
  )
}
