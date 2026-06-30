import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { sfxPop } from '../lib/sfx'

const SECTIONS = [
  { h: 'missionH1', p: 'missionP1', color: '#7C3AED', icon: '🧠' },
  { h: 'missionH2', p: 'missionP2', color: '#0EA5E9', icon: '🌟' },
  { h: 'missionH5', p: 'missionP5', color: '#8B5CF6', icon: '🦉' },
  { h: 'missionH3', p: 'missionP3', color: '#10B981', icon: '🏫' },
  { h: 'missionH4', p: 'missionP4', color: '#FBBF24', icon: '👩‍🏫' },
]

export default function Mission() {
  const { t } = useLang()
  const { hasProfile } = usePlayer()
  const nav = useNavigate()

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 safe-top">
      <button onClick={() => { sfxPop(); nav('/') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-sm min-h-touch mb-3">←</button>

      {/* Hero con la foto real de ZOE */}
      <div className="text-center fade-in">
        <img
          src="/zoe-portal-v9.webp"
          alt="ZOE"
          width="128"
          height="128"
          className="mx-auto rounded-full object-cover floaty"
          style={{ width: 128, height: 128, objectPosition: 'center 28%', boxShadow: '0 0 0 3px rgba(168,85,247,0.7), 0 12px 34px -6px rgba(168,85,247,0.7)' }}
        />
        <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--violet-light)] mt-2 font-extrabold">{t('zoeRole')}</div>
        <h1 className="font-logo text-3xl mt-2 grad-text leading-tight">{t('missionTitle')}</h1>
      </div>

      {/* Secciones */}
      <div className="space-y-3 mt-6">
        {SECTIONS.map((s, i) => (
          <div key={i} className={'card p-4 fade-in-d' + Math.min(i + 1, 3)} style={{ boxShadow: `inset 0 0 0 1px ${s.color}33` }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-8 h-8 shrink-0 rounded-xl grid place-items-center text-lg"
                style={{ background: `${s.color}22`, boxShadow: `inset 0 0 0 1px ${s.color}55` }}>{s.icon}</span>
              <h2 className="font-extrabold text-[15px]" style={{ color: s.color }}>{t(s.h)}</h2>
            </div>
            <p className="text-sm text-[var(--text)] leading-relaxed">{t(s.p)}</p>
          </div>
        ))}
      </div>

      {/* Call to action a las ESCUELAS */}
      <div className="card p-5 mt-6 text-center" style={{ background: 'linear-gradient(180deg, rgba(251,191,36,0.14), rgba(124,58,237,0.08))', boxShadow: 'inset 0 0 0 1px rgba(251,191,36,0.4)' }}>
        <div className="text-3xl">🏫</div>
        <h2 className="font-logo text-xl grad-text mt-1 leading-tight">{t('schoolCtaTitle')}</h2>
        <p className="text-sm text-[var(--text-dim)] mt-2 leading-snug">{t('schoolCtaText')}</p>
        <a href="mailto:info@chrismeniwfoundation.org?subject=Mente%20Libre%20en%20mi%20escuela" className="btn btn-gold w-full mt-3 text-base min-h-touch block text-center" aria-label={t('schoolCtaBtn')}>{t('schoolCtaBtn')}</a>
        <div className="text-xs text-[var(--sky)] font-bold mt-2">info@chrismeniwfoundation.org</div>
      </div>

      {/* CTA jugar */}
      <div className="space-y-2.5 mt-4">
        <button onClick={() => { sfxPop(); nav(hasProfile ? '/hub' : '/empezar') }} className="btn btn-primary w-full text-lg min-h-touch"
          aria-label={hasProfile ? t('continueCta') : t('playCta')}>
          {hasProfile ? t('continueCta') : t('playCta')}
        </button>
        <button onClick={() => { sfxPop(); nav('/docentes') }} className="btn btn-ghost w-full text-sm min-h-touch" aria-label={t('forTeachers')}>
          {t('forTeachers')}
        </button>
      </div>

      <footer className="text-center pt-5 leading-relaxed">
        <div className="text-xs text-[var(--text-dim)]">
          Chris Meniw Foundation ·{' '}
          <a className="text-[var(--violet-light)]" href="https://www.chrismeniwfoundation.org" target="_blank" rel="noopener noreferrer">www.chrismeniwfoundation.org</a>
        </div>
        <div className="text-[10px] text-[var(--text-dim)] opacity-70 mt-2 leading-snug">{t('legalReg')}</div>
      </footer>
    </div>
  )
}
