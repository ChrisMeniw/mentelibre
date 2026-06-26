import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { sfxPop } from '../lib/sfx'
import Zoe from '../components/Zoe'

// Página de inicio pública: bienvenida + botón JUGAR. Lo primero que ve cualquiera.
export default function Home() {
  const { t, lang } = useLang()
  const { hasProfile } = usePlayer()
  const nav = useNavigate()
  const appName = lang === 'pt' ? 'MenteLivre' : 'MenteLibre'

  const play = () => {
    sfxPop()
    nav(hasProfile ? '/hub' : '/empezar')
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-12 pb-32 min-h-dvh flex flex-col items-center justify-center text-center safe-top">
      <img
        src="/foundation-logo.webp"
        alt="Chris Meniw Foundation"
        width="110"
        height="110"
        className="mx-auto rounded-full floaty fade-in"
        style={{ width: 110, height: 110, filter: 'drop-shadow(0 12px 30px rgba(124,58,237,0.55))' }}
      />
      <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-dim)] mt-2.5 font-extrabold fade-in">
        Chris Meniw Foundation
      </div>

      <h1 className="font-logo text-6xl grad-text leading-none mt-4 fade-in-d1">{appName}</h1>
      <div className="text-[var(--gold)] font-extrabold mt-3 text-glow fade-in-d1">✨ {t('tagline')}</div>
      <p className="text-sm text-[var(--text-dim)] mt-3 max-w-xs leading-relaxed fade-in-d2">{t('homeSub')}</p>

      {/* ZOE da la bienvenida */}
      <div className="card px-4 py-3 mt-6 flex items-center gap-3 w-full fade-in-d2" style={{ borderColor: 'rgba(168,85,247,0.4)' }}>
        <div className="shrink-0"><Zoe size={52} talking /></div>
        <div className="text-left text-sm font-bold leading-snug">{t('homeWelcome')}</div>
      </div>

      {/* CTA principal */}
      <button onClick={play} className="btn btn-gold w-full mt-6 text-xl py-4 min-h-touch fade-in-d3 glow-pulse"
        aria-label={hasProfile ? t('continueCta') : t('playCta')}>
        {hasProfile ? t('continueCta') : t('playCta')}
      </button>

      <button onClick={() => { sfxPop(); nav('/docentes') }} className="btn btn-ghost w-full mt-3 text-sm min-h-touch fade-in-d3"
        aria-label={t('forTeachers')}>
        {t('forTeachers')}
      </button>
    </div>
  )
}
