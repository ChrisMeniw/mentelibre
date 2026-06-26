import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'

export default function TeacherPortal() {
  const { t, lang } = useLang()
  const { resetPlayer } = usePlayer()
  const nav = useNavigate()
  const [confirmChange, setConfirmChange] = useState(false)
  const appName = lang === 'pt' ? 'Mente Livre' : 'Mente Libre'
  const doChangeUser = () => {
    try { localStorage.removeItem('ml_seen_intro') } catch { /* noop */ }
    resetPlayer()
    nav('/')
  }

  const stats = [
    { n: '20', l: t('statChallenges') },
    { n: '3', l: t('statLevels') },
    { n: '4', l: t('statWorlds') },
    { n: '$0', l: t('statCost') },
  ]
  const steps = [
    { title: t('cStep1Title'), d: t('cStep1') },
    { title: t('cStep2Title'), d: t('cStep2') },
    { title: t('cStep3Title'), d: t('cStep3') },
  ]

  return (
    <div className="max-w-md mx-auto px-4 pt-14 pb-28 space-y-5">
      <div className="text-center fade-in">
        <div className="text-4xl">👩‍🏫</div>
        <h1 className="font-logo text-3xl mt-1 grad-text">{t('teacherTitle')}</h1>
        <p className="text-sm text-[var(--text-dim)] mt-1">{t('teacherIntro')}</p>
      </div>

      <div className="grid grid-cols-4 gap-2 fade-in-d1">
        {stats.map((s, i) => (
          <div key={i} className="card p-3 text-center">
            <div className="font-logo text-xl text-[var(--gold)]">{s.n}</div>
            <div className="text-[10px] text-[var(--text-dim)] leading-tight mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="card p-4 fade-in-d2">
        <div className="font-extrabold mb-3">{t('classroomTitle')}</div>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i}>
              <div className="font-extrabold text-[var(--violet-light)]">{s.title}</div>
              <div className="text-sm text-[var(--text-dim)]">{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 text-center fade-in-d3">
        <div className="text-xs text-[var(--text-dim)]">{t('contact')}</div>
        <a href="mailto:info@chrismeniwfoundation.org" className="font-extrabold text-[var(--sky)]">
          info@chrismeniwfoundation.org
        </a>
      </div>

      <div className="card p-3">
        <div className="text-xs font-extrabold text-[var(--text-dim)] text-center mb-2">📄 {t('manualsTitle')}</div>
        <div className="flex gap-2">
          <a href="/manual-usuario-es.pdf" target="_blank" rel="noopener noreferrer" download className="btn btn-primary flex-1 text-sm text-center block" aria-label={t('manualsTitle') + ' Español'}>{t('manualEs')}</a>
          <a href="/manual-usuario-pt.pdf" target="_blank" rel="noopener noreferrer" download className="btn btn-primary flex-1 text-sm text-center block" aria-label={t('manualsTitle') + ' Português'}>{t('manualPt')}</a>
        </div>
      </div>
      <button onClick={() => setConfirmChange(true)} className="btn btn-ghost w-full text-sm">🔁 {t('changeUser')}</button>
      <button onClick={() => nav('/hub')} className="btn btn-ghost w-full text-sm">{t('backToGame')}</button>

      {confirmChange && (
        <div className="fixed inset-0 z-[85] grid place-items-center px-6" style={{ background: 'rgba(8,4,20,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setConfirmChange(false)}>
          <div className="card p-6 max-w-xs w-full bounce-in text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl">🔁</div>
            <h2 className="font-logo text-xl grad-text mt-1">{t('changeUser')}</h2>
            <p className="text-sm text-[var(--text-dim)] mt-2 leading-snug">{t('changeUserMsg')}</p>
            <button onClick={doChangeUser} className="btn btn-gold w-full mt-5">{t('changeUserYes')}</button>
            <button onClick={() => setConfirmChange(false)} className="btn btn-ghost w-full mt-2 text-sm">{t('cancel')}</button>
          </div>
        </div>
      )}

      <footer className="text-center text-xs text-[var(--text-dim)] pt-2 leading-relaxed">
        {appName} · Chris Meniw Foundation ·{' '}
        <a className="text-[var(--violet-light)]" href="https://www.chrismeniwfoundation.org" target="_blank" rel="noopener noreferrer">
          www.chrismeniwfoundation.org
        </a>
      </footer>
    </div>
  )
}
