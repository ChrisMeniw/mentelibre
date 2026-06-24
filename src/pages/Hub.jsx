import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { useStreak } from '../hooks/useStreak'
import { WORLDS } from '../data/challenges'
import { avatarByEmoji } from '../components/AvatarPicker'
import XPBar from '../components/XPBar'
import WorldCard from '../components/WorldCard'
import SchoolBanner from '../components/SchoolBanner'
import RankingTable from '../components/RankingTable'
import TeamTab from '../components/TeamTab'

function PlayerHeader() {
  const { player } = usePlayer()
  const { t } = useLang()
  const av = avatarByEmoji(player.avatar)
  return (
    <div className="card p-4 fade-in">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center shrink-0">
          <div
            className="w-14 h-14 rounded-full grid place-items-center text-3xl"
            style={{ background: av.color, boxShadow: `0 0 0 2px rgba(255,255,255,0.22), 0 0 24px -4px ${av.color}` }}
          >
            {player.avatar}
          </div>
          <span className="text-[10px] font-extrabold text-[var(--violet-light)] mt-0.5">{player.avatarName}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold truncate text-lg">{player.name || '—'}</div>
          <div className="mt-1"><XPBar xp={player.xp} /></div>
        </div>
        <div className="text-center shrink-0">
          <div className="text-2xl">🔥</div>
          <div className="text-xs font-extrabold">{player.streak} {player.streak === 1 ? t('day') : t('days')}</div>
        </div>
      </div>
    </div>
  )
}

export default function Hub() {
  useStreak()
  const { t } = useLang()
  const { player, getSchoolXP } = usePlayer()
  const nav = useNavigate()
  const [tab, setTab] = useState('play')

  const tabs = [
    { id: 'play', icon: '🎮', label: t('tabPlay') },
    { id: 'team', icon: '👥', label: t('tabTeam') },
    { id: 'ranking', icon: '🏆', label: t('tabRanking') },
  ]

  return (
    <div className="max-w-md mx-auto px-4 pt-14 pb-28 space-y-4">
      <SchoolBanner school={player.school} team={player.team} teamXP={getSchoolXP()} />
      <PlayerHeader />

      <div className="card flex p-1 gap-1">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className="flex-1 btn text-sm py-2"
            style={tab === tb.id
              ? { background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff', boxShadow: '0 8px 22px -10px rgba(124,58,237,0.9), inset 0 1px 0 rgba(255,255,255,0.3)' }
              : { background: 'transparent', color: 'var(--text-dim)' }}
          >
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>

      {tab === 'play' && (
        <div className="fade-in">
          <div className="text-sm text-[var(--text-dim)] mb-2">{t('chooseWorld')}</div>
          <div className="grid grid-cols-2 gap-3">
            {WORLDS.map((w) => (
              <WorldCard
                key={w.id}
                world={w}
                completed={player.completed?.[w.id] || 0}
                onClick={() => nav(`/desafio/${w.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {tab === 'team' && <TeamTab />}

      {tab === 'ranking' && (
        <div className="fade-in">
          <div className="text-sm text-[var(--text-dim)] mb-2">🏆 {t('rankingTitle')}</div>
          <RankingTable yourSchool={player.school} yourXP={getSchoolXP()} />
        </div>
      )}
    </div>
  )
}
