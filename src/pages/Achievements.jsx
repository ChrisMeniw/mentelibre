import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { BADGES } from '../data/badges'
import { sfxPop } from '../lib/sfx'
import BadgeGrid from '../components/BadgeGrid'

export default function Achievements() {
  const { t } = useLang()
  const { player } = usePlayer()
  const nav = useNavigate()
  const count = player.unlockedBadges?.length || 0
  return (
    <div className="max-w-md mx-auto px-4 pt-14 pb-28 space-y-4">
      <div className="flex items-center">
        <button onClick={() => { sfxPop(); nav('/hub') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-base min-h-touch">🏠</button>
      </div>
      <div className="text-center fade-in">
        <div className="text-4xl">🏅</div>
        <h1 className="font-logo text-3xl mt-1 grad-text">{t('badgesTitle')}</h1>
        <p className="text-sm text-[var(--text-dim)]">{t('badgesSub')} · {count}/{BADGES.length}</p>
      </div>
      <BadgeGrid unlocked={player.unlockedBadges || []} />
    </div>
  )
}
