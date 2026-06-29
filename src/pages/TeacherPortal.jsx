import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'

export default function TeacherPortal() {
  const { t, lang } = useLang()
  const { resetPlayer } = usePlayer()
  const nav = useNavigate()
  const [confirmChange, setConfirmChange] = useState(false)
  const [presenting, setPresenting] = useState(false)
  const appName = lang === 'pt' ? 'Mente Livre' : 'Mente Libre'

  const doChangeUser = () => {
    try { localStorage.removeItem('ml_seen_intro') } catch { /* noop */ }
    resetPlayer()
    nav('/')
  }

  // Modo proyector: pantalla completa para presentar a toda la clase en la tele.
  const toggleProjector = () => {
    try {
      if (document.fullscreenElement) { document.exitFullscreen?.(); setPresenting(false) }
      else { document.documentElement.requestFullscreen?.().then(() => setPresenting(true)).catch(() => { /* noop */ }) }
    } catch { /* noop */ }
  }
  const printGuide = () => { try { window.print() } catch { /* noop */ } }

  const stats = [
    { n: '+360', l: t('statChallenges') },
    { n: '5', l: t('statLevels') },
    { n: '5', l: t('statWorlds') },
    { n: '$0', l: t('statCost') },
  ]
  const guide = [t('tgMin1Label'), t('tgMin2Label'), t('tgMin3Label')].map((label, i) => ({ label, d: [t('tgMin1'), t('tgMin2'), t('tgMin3')][i] }))
  const ages = [
    { a: t('tgAge1'), d: t('tgAge1d') },
    { a: t('tgAge2'), d: t('tgAge2d') },
    { a: t('tgAge3'), d: t('tgAge3d') },
  ]
  const features = [t('tfSolo'), t('tfAula'), t('tfReto'), t('tfAsk'), t('tfOpen'), t('tfZoe'), t('tfAccess')]

  return (
    <div className="max-w-md mx-auto px-4 pt-14 pb-28 space-y-5">
      <div className="text-center fade-in">
        <div className="text-4xl">👩‍🏫</div>
        <h1 className="font-logo text-3xl mt-1 grad-text">{t('teacherTitle')}</h1>
        <p className="text-sm text-[var(--text-dim)] mt-1">{t('teacherIntro')}</p>
      </div>

      {/* Acciones rápidas: proyectar a la clase + imprimir la guía (no se imprimen) */}
      <div className="grid grid-cols-2 gap-2">
        <button onClick={toggleProjector} className="btn btn-primary text-sm min-h-touch">{presenting ? t('tgProjectorExit') : t('tgProjector')}</button>
        <button onClick={printGuide} className="btn btn-ghost text-sm min-h-touch">{t('tgPrint')}</button>
      </div>

      {/* ===== GUÍA IMPRIMIBLE (esto es lo único que sale al imprimir) ===== */}
      <div id="teacher-guide" className="space-y-5">
        <div className="print-only" style={{ marginBottom: 8, fontWeight: 800 }}>
          {appName} · {t('tgGuideForTeachers') || 'Guía para docentes'} · chrismeniwfoundation.org
        </div>

        {/* 10 minutos paso a paso */}
        <div className="card p-4 fade-in-d1">
          <div className="font-extrabold">⏱️ {t('tgGuideTitle')}</div>
          <div className="text-xs text-[var(--text-dim)] mt-0.5 mb-3">{t('tgGuideSub')}</div>
          <ol className="space-y-3">
            {guide.map((g, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full font-black text-sm" style={{ background: 'var(--violet)', color: '#fff' }}>{i + 1}</span>
                <div>
                  <div className="font-extrabold text-[var(--violet-light)] text-sm">{g.label}</div>
                  <div className="text-sm leading-snug">{g.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Qué usar según la edad */}
        <div className="card p-4">
          <div className="font-extrabold mb-3">🎯 {t('tgAgesTitle')}</div>
          <div className="space-y-2.5">
            {ages.map((g, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="chip shrink-0 text-xs font-black" style={{ minWidth: 54, justifyContent: 'center' }}>{g.a}</span>
                <div className="text-sm text-[var(--text-dim)] leading-snug">{g.d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Para el director */}
        <div className="card p-4" style={{ boxShadow: 'inset 0 0 0 1px rgba(251,191,36,0.4)' }}>
          <div className="font-extrabold mb-2">🏫 {t('tgDirectorTitle')}</div>
          <p className="text-sm leading-snug">{t('tgDirector')}</p>
        </div>
      </div>
      {/* ===== fin de la guía imprimible ===== */}

      {/* Manual completo para docentes (PDF que ya existía y no estaba enlazado) */}
      <a href="/Manual-Docente-MenteLibre.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-gold w-full text-sm text-center block min-h-touch" aria-label={t('tgTeacherManual')}>{t('tgTeacherManual')}</a>

      {/* Qué hace MenteLibre */}
      <div className="card p-4 fade-in-d2">
        <div className="font-extrabold mb-3">{t('teacherFeaturesTitle')}</div>
        <ul className="space-y-2.5">
          {features.map((f, i) => (
            <li key={i} className="text-sm leading-snug text-[var(--text)]">{f}</li>
          ))}
        </ul>
      </div>

      {/* Contacto */}
      <div className="card p-4 text-center fade-in-d3">
        <div className="text-xs text-[var(--text-dim)]">{t('contact')}</div>
        <a href="mailto:info@chrismeniwfoundation.org" className="font-extrabold text-[var(--sky)]">
          info@chrismeniwfoundation.org
        </a>
      </div>

      {/* Manuales de usuario (para los chicos) */}
      <div className="card p-3">
        <div className="text-xs font-extrabold text-[var(--text-dim)] text-center mb-2">📄 {t('manualsTitle')}</div>
        <div className="flex gap-2">
          <a href="/manual-usuario-es.pdf" target="_blank" rel="noopener noreferrer" download className="btn btn-primary flex-1 text-sm text-center block" aria-label={t('manualsTitle') + ' Español'}>{t('manualEs')}</a>
          <a href="/manual-usuario-pt.pdf" target="_blank" rel="noopener noreferrer" download className="btn btn-primary flex-1 text-sm text-center block" aria-label={t('manualsTitle') + ' Português'}>{t('manualPt')}</a>
        </div>
      </div>

      <button onClick={() => setConfirmChange(true)} className="btn btn-ghost w-full text-sm min-h-touch">🔁 {t('changeUser')}</button>
      <button onClick={() => nav('/hub')} className="btn btn-ghost w-full text-sm min-h-touch">{t('backToGame')}</button>

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
