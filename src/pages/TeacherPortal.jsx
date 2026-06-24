import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'

export default function TeacherPortal() {
  const { t, lang } = useLang()
  const nav = useNavigate()
  const appName = lang === 'pt' ? 'MenteLivre' : 'MenteLibre'

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
        <h1 className="font-logo text-2xl mt-1">{t('teacherTitle')}</h1>
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
        <a href="mailto:fundacion@chrismeniw.com" className="font-extrabold text-[var(--sky)]">
          fundacion@chrismeniw.com
        </a>
      </div>

      <button onClick={() => nav('/hub')} className="btn btn-ghost w-full text-sm">{t('backToGame')}</button>

      <footer className="text-center text-xs text-[var(--text-dim)] pt-2 leading-relaxed">
        {appName} · Fundación Chris Meniw ·{' '}
        <a className="text-[var(--violet-light)]" href="https://www.chrismeniw.com" target="_blank" rel="noopener noreferrer">
          www.chrismeniw.com
        </a>
      </footer>
    </div>
  )
}
