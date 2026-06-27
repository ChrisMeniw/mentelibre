import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { sfxPop } from '../lib/sfx'
import Zoe from '../components/Zoe'

// Tarjeta de modo: ícono + título + descripción, con color propio. Deja clarísimo
// si entrás a jugar solo, a la competencia de grupos o al ranking de escuelas.
function ModeCard({ icon, title, desc, accent, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className="w-full card p-3.5 flex items-center gap-3 text-left active:scale-[0.98] transition min-h-touch"
      style={{
        borderColor: `${accent}66`,
        boxShadow: primary ? `0 0 0 1px ${accent}66, 0 12px 28px -12px ${accent}` : undefined,
        background: `linear-gradient(135deg, ${accent}1f, rgba(255,255,255,0.02))`,
      }}
    >
      <span className="shrink-0 w-12 h-12 rounded-2xl grid place-items-center text-2xl"
        style={{ background: `${accent}26`, border: `1px solid ${accent}55` }}>{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block font-extrabold text-[15px] leading-tight">{title}</span>
        <span className="block text-[11px] text-[var(--text-dim)] leading-snug mt-0.5">{desc}</span>
      </span>
      <span className="shrink-0 text-[var(--text-dim)] text-xl">›</span>
    </button>
  )
}

// Página de inicio pública: bienvenida + elegir modo. Lo primero que ve cualquiera.
export default function Home() {
  const { t, lang } = useLang()
  const { hasProfile } = usePlayer()
  const nav = useNavigate()
  const appName = lang === 'pt' ? 'Mente Livre' : 'Mente Libre'

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

      {/* Elige cómo jugar — 3 modos bien diferenciados */}
      <div className="w-full mt-6 fade-in-d3">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-2 text-center">{t('chooseHowToPlay')}</div>
        <div className="space-y-2.5">
          <ModeCard icon="🎮" accent="#FBBF24" primary
            title={hasProfile ? t('continueCta') : t('modeSoloTitle')} desc={t('modeSoloDesc')}
            onClick={play} />
          <ModeCard icon="⚔️" accent="#A855F7"
            title={t('modeGroupTitle')} desc={t('modeGroupDesc')}
            onClick={() => { sfxPop(); nav('/aula') }} />
          <ModeCard icon="🏆" accent="#10B981"
            title={t('modeRankingTitle')} desc={t('modeRankingDesc')}
            onClick={() => { sfxPop(); nav('/aula', { state: { view: 'board' } }) }} />
          <ModeCard icon="🦉" accent="#8B5CF6"
            title={t('modeAskTitle')} desc={t('modeAskDesc')}
            onClick={() => { sfxPop(); nav('/preguntar') }} />
          <ModeCard icon="🔥" accent="#FB7185"
            title={t('modeDailyTitle')} desc={t('modeDailyDesc')}
            onClick={() => { sfxPop(); nav('/reto') }} />
        </div>
      </div>

      <div className="flex gap-2 w-full mt-4 fade-in-d3">
        <button onClick={() => { sfxPop(); nav('/mision') }} className="btn btn-ghost flex-1 text-sm min-h-touch" aria-label={t('ourMission')}>
          {t('ourMission')}
        </button>
        <button onClick={() => { sfxPop(); nav('/docentes') }} className="btn btn-ghost flex-1 text-sm min-h-touch" aria-label={t('forTeachers')}>
          {t('forTeachers')}
        </button>
      </div>

      <div className="text-[10px] text-[var(--text-dim)] opacity-70 mt-6 leading-snug max-w-xs mx-auto fade-in-d3">{t('legalReg')}</div>
    </div>
  )
}
