import { useEffect } from 'react'
import Mascot from './Mascot'
import { useLang } from '../i18n'

const COLORS = ['#7C3AED', '#A855F7', '#FBBF24', '#10B981', '#F43F5E', '#0EA5E9', '#FB6424']

function ConfettiBurst() {
  const pieces = Array.from({ length: 70 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    dur: 1.8 + Math.random() * 1.6,
    color: COLORS[i % COLORS.length],
    size: 7 + Math.random() * 7,
  }))
  return (
    <>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: p.left + '%',
            width: p.size,
            height: p.size * 1.5,
            background: p.color,
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
          }}
        />
      ))}
    </>
  )
}

// Estrellas que estallan detrás de la mascota
function StarBurst() {
  const stars = Array.from({ length: 10 }, (_, i) => ({
    ang: (i / 10) * Math.PI * 2,
    d: 70 + (i % 3) * 22,
    delay: (i % 5) * 0.04,
    color: COLORS[i % COLORS.length],
  }))
  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className="star-burst text-xl"
          style={{
            '--dx': `${Math.cos(s.ang) * s.d}px`,
            '--dy': `${Math.sin(s.ang) * s.d}px`,
            animationDelay: `${s.delay}s`,
            color: s.color,
          }}
        >
          ⭐
        </span>
      ))}
    </>
  )
}

export default function Celebration({ xp, coins = 0, stars = 0, leveledUp, levelName, avatar, color, onClose }) {
  const { t } = useLang()
  const thinkMsg = stars >= 3 ? t('think3') : stars === 2 ? t('think2') : t('think1')

  useEffect(() => {
    const tm = setTimeout(onClose, leveledUp ? 4600 : 3200)
    return () => clearTimeout(tm)
  }, [leveledUp, onClose])

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center px-6"
      style={{ background: 'rgba(8,4,20,0.82)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <ConfettiBurst />
      <div
        className="card p-7 text-center max-w-xs w-full bounce-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative grid place-items-center mb-2 h-28">
          <StarBurst />
          <div className="relative z-10">
            <Mascot emoji={avatar} color={color} mood="celebrate" size={104} />
          </div>
        </div>

        {/* Estrellas según cuánto pensó — premia al que mejor piensa */}
        {stars > 0 && (
          <div className="flex items-center justify-center gap-1 mb-1">
            {[1, 2, 3].map((s) => (
              <span key={s} className="text-3xl count-pop" style={{ animationDelay: `${0.15 + s * 0.12}s`, filter: s <= stars ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
            ))}
          </div>
        )}
        {stars > 0 && <div className="text-sm font-extrabold text-[var(--violet-light)] mb-1">{thinkMsg}</div>}

        {leveledUp ? (
          <>
            <div className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--gold)]">
              {t('newLevel')}
            </div>
            <div className="font-logo text-3xl mt-1 grad-text leading-tight">{levelName}</div>
          </>
        ) : (
          <div className="font-logo text-2xl grad-text">{t('greatJob')}</div>
        )}

        <div className="count-pop mt-3 flex items-center justify-center gap-3">
          <span className="text-3xl font-logo text-[var(--gold)] text-glow">+{xp} XP</span>
          {coins > 0 && (
            <span className="chip text-lg" style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.25),rgba(251,191,36,0.08))', borderColor: 'rgba(251,191,36,0.6)' }}>
              🪙 <span className="text-[var(--gold)] font-black">+{coins}</span>
            </span>
          )}
        </div>

        <button onClick={onClose} className="btn btn-gold w-full mt-5 text-lg">
          {t('continueBtn')}
        </button>
      </div>
    </div>
  )
}
