import { usePlayer } from '../hooks/usePlayer'
import { useLang } from '../i18n'

// Racha de días seguidos: una llama 🔥 con el número. Engancha como Duolingo.
// A partir de 3 días late para llamar la atención.
export default function StreakBadge({ size = 'md' }) {
  const { player } = usePlayer()
  const { t } = useLang()
  const n = player.streak || 0
  if (n < 1) return null
  const big = size === 'lg'
  return (
    <div
      className={'inline-flex items-center gap-1.5 rounded-full font-black ' + (big ? 'px-4 py-2 text-base ' : 'px-3 py-1 text-sm ') + (n >= 3 ? 'jelly-idle' : '')}
      style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.28), rgba(244,63,94,0.22))', border: '1px solid rgba(251,146,60,0.65)', color: '#FB923C' }}
      title={t('streakDays').replace('{n}', n)}
    >
      <span className={big ? 'text-2xl' : 'text-lg'} aria-hidden>🔥</span>
      <span>{n}</span>
      <span className="text-[10px] font-extrabold text-[var(--text-dim)] uppercase tracking-wide">{t('streakLabel')}</span>
    </div>
  )
}
