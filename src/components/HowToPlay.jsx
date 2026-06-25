import { useState } from 'react'
import { useLang } from '../i18n'
import { sfxPop } from '../lib/sfx'
import Zoe from './Zoe'

// Tutorial animado de 3 pasos. Solo la primera vez (flag en localStorage) o desde el botón "?".
// "Saltar" siempre visible.
export default function HowToPlay({ onClose }) {
  const { t } = useLang()
  const [i, setI] = useState(0)
  const steps = [
    { icon: '🗺️', title: t('onb1Title'), text: t('onb1Text') },
    { icon: '🎤', title: t('onb2Title'), text: t('onb2Text') },
    { icon: '⭐', title: t('onb3Title'), text: t('onb3Text') },
  ]
  const last = i === steps.length - 1
  const next = () => { sfxPop(); last ? onClose() : setI(i + 1) }
  const s = steps[i]

  return (
    <div
      className="fixed inset-0 z-[85] grid place-items-center px-5"
      style={{ background: 'rgba(8,4,20,0.88)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <div className="card p-6 max-w-sm w-full relative">
        {/* Saltar — siempre visible */}
        <button
          onClick={() => { sfxPop(); onClose() }}
          className="absolute top-3 right-3 text-xs font-extrabold text-[var(--text-dim)] px-3 py-2 rounded-full active:scale-90 transition min-h-touch"
          aria-label={t('skip')}
        >
          {t('skip')} ✕
        </button>

        <div className="text-center pt-3">
          <div className="floaty inline-block"><Zoe size={88} talking /></div>
          <div className="text-[11px] font-extrabold text-[var(--violet-light)] -mt-1">{t('zoeName')}</div>

          <div key={i} className="fade-in mt-4">
            <div className="text-4xl">{s.icon}</div>
            <h2 className="font-logo text-2xl grad-text mt-1">{s.title}</h2>
            <p className="text-[15px] font-bold text-[var(--text)] mt-2 leading-snug min-h-[88px]">{s.text}</p>
          </div>
        </div>

        {/* Puntos de progreso */}
        <div className="flex items-center justify-center gap-2 mt-3" aria-hidden="true">
          {steps.map((_, k) => (
            <span key={k} className="rounded-full transition-all" style={{
              width: k === i ? 22 : 8, height: 8,
              background: k === i ? 'linear-gradient(90deg,var(--violet-light),var(--gold))' : 'rgba(255,255,255,0.2)',
            }} />
          ))}
        </div>

        <button onClick={next} className="btn btn-gold w-full mt-5 text-lg min-h-touch" aria-label={last ? t('howToStart') : t('nextStep')}>
          {last ? t('howToStart') : t('nextStep')}
        </button>
      </div>
    </div>
  )
}
