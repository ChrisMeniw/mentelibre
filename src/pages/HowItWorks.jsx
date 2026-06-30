import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { sfxPop } from '../lib/sfx'
import ModeIcon from '../components/ModeIcon'
import LogoHero from '../components/LogoHero'

// Página pública que EXPLICA el juego: qué es, cómo se juega, qué lo hace especial y qué
// entrena. Pensada para que cualquier visitante (padre, maestro, escuela) lo entienda rápido.
const MODES = [
  { icon: 'solo', accent: '#FBBF24', t: 'modeSoloTitle', d: 'modeSoloDesc' },
  { icon: 'group', accent: '#A855F7', t: 'modeGroupTitle', d: 'modeGroupDesc' },
  { icon: 'ask', accent: '#C084FC', t: 'modeAskTitle', d: 'modeAskDesc' },
  { icon: 'daily', accent: '#FB7185', t: 'modeDailyTitle', d: 'modeDailyDesc' },
]
const SPECIAL = ['hiwSpecial1', 'hiwSpecial2', 'hiwSpecial3', 'hiwSpecial4', 'hiwSpecial5']
const SKILLS = [
  { e: '🧠', k: 'hiwSkill1' },
  { e: '💡', k: 'hiwSkill2' },
  { e: '❓', k: 'hiwSkill3' },
  { e: '🗣️', k: 'hiwSkill4' },
]

export default function HowItWorks() {
  const { t } = useLang()
  const { hasProfile } = usePlayer()
  const nav = useNavigate()

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 safe-top">
      <button onClick={() => { sfxPop(); nav('/') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-sm min-h-touch mb-3">←</button>

      {/* Hero — logo de marca fundido con el fondo */}
      <LogoHero px={1} pullTop={0} showTagline={false} />
      <div className="text-center">
        <h1 className="font-logo text-2xl mt-1 grad-text leading-tight">{t('hiwTitle')}</h1>
        <p className="text-sm text-[var(--text-dim)] mt-2 leading-relaxed">{t('hiwSub')}</p>
      </div>

      {/* De qué se trata */}
      <div className="card p-4 mt-6 fade-in-d1" style={{ boxShadow: 'inset 0 0 0 1px rgba(124,58,237,0.33)' }}>
        <h2 className="font-extrabold text-[15px] text-[var(--violet-light)] mb-1.5">💜 {t('hiwWhatTitle')}</h2>
        <p className="text-sm leading-relaxed">{t('hiwWhatText')}</p>
      </div>

      {/* Cómo se juega — los modos */}
      <div className="mt-6 fade-in-d1">
        <h2 className="font-logo text-xl grad-text text-center mb-3">🎮 {t('hiwPlayTitle')}</h2>
        <div className="space-y-2.5">
          {MODES.map((m) => (
            <div key={m.icon} className="card p-3.5 flex items-center gap-3.5">
              <span className="shrink-0 w-12 h-12 rounded-2xl grid place-items-center"
                style={{ background: `linear-gradient(140deg, ${m.accent}2e, ${m.accent}10)`, border: `1px solid ${m.accent}40` }}>
                <ModeIcon name={m.icon} accent={m.accent} size={26} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-extrabold text-[15px] leading-tight">{t(m.t)}</span>
                <span className="block text-[12px] text-[var(--text-dim)] leading-snug mt-0.5">{t(m.d)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quién es ZOE */}
      <div className="card p-4 mt-6 flex items-start gap-3 fade-in-d2" style={{ boxShadow: 'inset 0 0 0 1px rgba(168,85,247,0.33)' }}>
        <img src="/zoe.jpg" alt="ZOE" width="52" height="52"
          className="shrink-0 rounded-full object-cover" style={{ width: 52, height: 52, objectPosition: 'center 28%', boxShadow: '0 0 0 2px rgba(168,85,247,0.7)' }} />
        <div>
          <h2 className="font-extrabold text-[15px] text-[var(--violet-light)] mb-1">🦉 {t('hiwZoeTitle')}</h2>
          <p className="text-sm leading-relaxed">{t('hiwZoeText')}</p>
        </div>
      </div>

      {/* Qué lo hace especial */}
      <div className="card p-4 mt-4 fade-in-d2" style={{ boxShadow: 'inset 0 0 0 1px rgba(251,191,36,0.33)' }}>
        <h2 className="font-extrabold text-[15px] text-[var(--gold)] mb-2.5">✨ {t('hiwSpecialTitle')}</h2>
        <ul className="space-y-2">
          {SPECIAL.map((k) => (
            <li key={k} className="flex items-start gap-2 text-sm leading-snug">
              <span className="shrink-0 text-[var(--gold)]">✅</span>
              <span>{t(k)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Qué entrena */}
      <div className="card p-4 mt-4 fade-in-d3">
        <h2 className="font-extrabold text-[15px] text-[var(--sky)] mb-2.5">🚀 {t('hiwSkillsTitle')}</h2>
        <div className="grid grid-cols-2 gap-2">
          {SKILLS.map((s) => (
            <div key={s.k} className="rounded-2xl px-3 py-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-xl shrink-0" aria-hidden>{s.e}</span>
              <span className="text-[12.5px] font-bold leading-tight">{t(s.k)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="card p-5 mt-6 text-center fade-in-d3" style={{ background: 'linear-gradient(180deg, rgba(251,191,36,0.14), rgba(124,58,237,0.08))', boxShadow: 'inset 0 0 0 1px rgba(251,191,36,0.4)' }}>
        <h2 className="font-logo text-xl grad-text leading-tight">{t('hiwStartTitle')}</h2>
        <button onClick={() => { sfxPop(); nav(hasProfile ? '/hub' : '/empezar') }} className="btn btn-gold w-full mt-3 text-lg min-h-touch"
          aria-label={hasProfile ? t('continueCta') : t('playCta')}>
          {hasProfile ? t('continueCta') : t('playCta')}
        </button>
        <div className="flex gap-2 mt-2">
          <button onClick={() => { sfxPop(); nav('/mision') }} className="btn btn-ghost flex-1 text-sm min-h-touch" aria-label={t('ourMission')}>{t('ourMission')}</button>
          <button onClick={() => { sfxPop(); nav('/docentes') }} className="btn btn-ghost flex-1 text-sm min-h-touch" aria-label={t('forTeachers')}>{t('forTeachers')}</button>
        </div>
      </div>

      <footer className="text-center pt-5 leading-relaxed">
        <div className="text-xs text-[var(--text-dim)]">
          Chris Meniw Foundation ·{' '}
          <a className="text-[var(--violet-light)]" href="https://www.chrismeniwfoundation.org" target="_blank" rel="noopener noreferrer">www.chrismeniwfoundation.org</a>
        </div>
      </footer>
    </div>
  )
}
