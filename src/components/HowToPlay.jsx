import { useLang } from '../i18n'
import { sfxPop } from '../lib/sfx'

// Explica el objetivo del juego. Se muestra la primera vez y se puede reabrir con "?".
export default function HowToPlay({ onClose }) {
  const { t } = useLang()
  const steps = [
    { icon: '🗺️', text: t('howStep1') },
    { icon: '🎤', text: t('howStep2') },
    { icon: '🤖', text: t('howStep3') },
    { icon: '🪙', text: t('howStep4') },
  ]
  return (
    <div
      className="fixed inset-0 z-[85] grid place-items-center px-5"
      style={{ background: 'rgba(8,4,20,0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div className="card p-6 max-w-sm w-full bounce-in" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <img src="/foundation-logo.webp" alt="Chris Meniw Foundation" width="64" height="64"
            className="w-16 h-16 mx-auto rounded-full" style={{ width: 64, height: 64, filter: 'drop-shadow(0 6px 16px rgba(124,58,237,0.5))' }} />
          <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-dim)] mt-1 font-extrabold">Chris Meniw Foundation</div>
          <h2 className="font-logo text-2xl grad-text mt-2">{t('howToTitle')}</h2>
          <p className="text-sm font-bold text-[var(--gold)] mt-1">{t('howToObjective')}</p>
        </div>

        <div className="space-y-3 mt-5">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-11 h-11 shrink-0 rounded-2xl grid place-items-center text-2xl"
                style={{ background: 'linear-gradient(135deg,rgba(168,85,247,0.25),rgba(124,58,237,0.10))', boxShadow: 'inset 0 0 0 1px rgba(168,85,247,0.3)' }}>
                {s.icon}
              </div>
              <div className="text-sm font-bold leading-snug">{s.text}</div>
            </div>
          ))}
        </div>

        <button onClick={() => { sfxPop(); onClose() }} className="btn btn-gold w-full mt-6 text-lg">
          {t('howToStart')}
        </button>
      </div>
    </div>
  )
}
