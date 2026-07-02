import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { isAskUnlocked } from '../data/levels'
import { sfxPop } from '../lib/sfx'
import ModeIcon from '../components/ModeIcon'
import StreakBadge from '../components/StreakBadge'
import LogoHero from '../components/LogoHero'

// Tarjeta de modo: vidrio neutro + ficha de ícono con acento. Jerarquía clara —
// una sola tarjeta primaria (dorada) sobresale; el resto, calmo y consistente.
function ModeCard({ iconName, title, desc, accent, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      className="group w-full card p-3.5 flex items-center gap-3.5 text-left jelly-tap min-h-touch"
      style={primary ? { boxShadow: `0 0 0 1.5px ${accent}77, 0 16px 34px -16px ${accent}, 0 18px 50px -24px rgba(0,0,0,0.85)` } : undefined}
    >
      <span className={'shrink-0 w-12 h-12 rounded-2xl grid place-items-center' + (primary ? ' jelly-idle' : '')}
        style={{
          background: primary
            ? `linear-gradient(140deg, ${accent}, #E59409)`
            : `linear-gradient(140deg, ${accent}2e, ${accent}10)`,
          border: `1px solid ${accent}${primary ? 'cc' : '40'}`,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22)${primary ? `, 0 8px 20px -10px ${accent}` : ''}`,
        }}>
        <ModeIcon name={iconName} accent={primary ? '#3B2A04' : accent} size={26} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-extrabold text-[15px] leading-tight">{title}</span>
        <span className="block text-[11.5px] text-[var(--text-dim)] leading-snug mt-0.5">{desc}</span>
      </span>
      <span className="shrink-0 text-[var(--text-dim)] text-lg transition-transform group-active:translate-x-0.5">›</span>
    </button>
  )
}

// Página de inicio pública: bienvenida + elegir modo. Lo primero que ve cualquiera.
export default function Home() {
  const { t } = useLang()
  const { hasProfile, player } = usePlayer()
  const nav = useNavigate()
  const askUnlocked = isAskUnlocked(player.xp)

  const play = () => {
    sfxPop()
    nav(hasProfile ? '/hub' : '/empezar')
  }

  return (
    <div className="mx-auto max-w-md px-5 pt-12 pb-32 min-h-dvh flex flex-col items-center justify-start text-center safe-top">
      <LogoHero />
      <p className="text-sm text-[var(--text-dim)] mt-2 max-w-xs leading-relaxed fade-in-d2">{t('homeSub')}</p>

      {hasProfile && (player.streak || 0) >= 1 && (
        <div className="mt-3 fade-in-d2"><StreakBadge size="lg" /></div>
      )}

      {/* Elige cómo jugar — 3 modos bien diferenciados */}
      <div className="w-full mt-6 fade-in-d3">
        <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--text-dim)] mb-2 text-center">{t('chooseHowToPlay')}</div>
        <div className="space-y-2.5">
          <ModeCard iconName="solo" accent="#FBBF24" primary
            title={hasProfile ? t('continueCta') : t('modeSoloTitle')} desc={t('modeSoloDesc')}
            onClick={play} />
          <ModeCard iconName="group" accent="#A855F7"
            title={t('modeGroupTitle')} desc={t('modeGroupDesc')}
            onClick={() => { sfxPop(); nav('/competencia') }} />
          <ModeCard iconName="ranking" accent="#38BDF8"
            title={t('modeRankingTitle')} desc={t('modeRankingDesc')}
            onClick={() => { sfxPop(); nav('/aula', { state: { view: 'board' } }) }} />
          <ModeCard iconName={askUnlocked ? 'ask' : 'lock'} accent="#C084FC"
            title={t('modeAskTitle')} desc={askUnlocked ? t('modeAskDesc') : t('askLockedHint')}
            onClick={() => { sfxPop(); if (askUnlocked) nav('/preguntar') }} />
          <ModeCard iconName="daily" accent="#FB7185"
            title={t('modeDailyTitle')} desc={t('modeDailyDesc')}
            onClick={() => { sfxPop(); nav('/reto') }} />
        </div>
      </div>

      <button onClick={() => { sfxPop(); nav('/como-funciona') }} className="btn btn-ghost w-full text-sm min-h-touch mt-4 fade-in-d3"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(168,85,247,0.4)' }} aria-label={t('hiwNav')}>
        ❓ {t('hiwTitle')}
      </button>
      <div className="flex gap-2 w-full mt-2 fade-in-d3">
        <button onClick={() => { sfxPop(); nav('/mision') }} className="btn btn-ghost flex-1 text-sm min-h-touch" aria-label={t('ourMission')}>
          {t('ourMission')}
        </button>
        <button onClick={() => { sfxPop(); nav('/docentes') }} className="btn btn-ghost flex-1 text-sm min-h-touch" aria-label={t('forTeachers')}>
          {t('forTeachers')}
        </button>
      </div>

      <div className="text-[10px] text-[var(--text-dim)] opacity-70 mt-6 leading-snug max-w-xs mx-auto fade-in-d3">{t('legalReg')}</div>
      <div className="text-[9px] text-[var(--text-dim)] opacity-50 mt-2 leading-snug max-w-xs mx-auto">
        Música: “Pixelland” — Kevin MacLeod (incompetech.com), CC BY 4.0
      </div>
    </div>
  )
}
