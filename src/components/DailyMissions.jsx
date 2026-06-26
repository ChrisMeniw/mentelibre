import { useState } from 'react'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { currentDaily, dailyComplete, dailyMissions, DAILY_BONUS } from '../data/missions'
import { sfxPop, sfxComplete, sfxCoins } from '../lib/sfx'

export default function DailyMissions() {
  const { t } = useLang()
  const { player, claimDaily } = usePlayer()
  const [burst, setBurst] = useState(false)

  const d = currentDaily(player)
  const missions = dailyMissions(t)
  const allDone = dailyComplete(d)

  const claim = () => {
    const got = claimDaily(DAILY_BONUS)
    if (got > 0) { sfxComplete(); setTimeout(() => sfxCoins(), 350); setBurst(true); setTimeout(() => setBurst(false), 1200) }
    else sfxPop()
  }

  return (
    <div className="card p-4 relative overflow-hidden" aria-label={t('dailyTitle')}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="font-extrabold flex items-center gap-1.5">📅 {t('dailyTitle')}</div>
        <div className="chip text-[11px]" style={{ background: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.4)' }}>
          🪙 <span className="text-[var(--gold)] font-black">+{DAILY_BONUS}</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {missions.map((m) => {
          const val = Math.min(d[m.key], m.target)
          const done = val >= m.target
          const pct = Math.round((val / m.target) * 100)
          return (
            <div key={m.key} className="flex items-center gap-2.5">
              <div className="w-8 h-8 shrink-0 rounded-xl grid place-items-center text-base"
                style={{ background: done ? 'linear-gradient(135deg,#34D399,#10B981)' : 'rgba(255,255,255,0.06)', boxShadow: done ? '0 0 14px -4px #10B981' : 'none' }}>
                {done ? '✓' : m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className={'font-bold ' + (done ? 'text-[var(--emerald)]' : 'text-[var(--text)]')}>{m.label}</span>
                  <span className="text-[var(--text-dim)] tabular-nums">{val}/{m.target}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: pct + '%', background: done ? 'linear-gradient(90deg,#34D399,#10B981)' : 'linear-gradient(90deg,var(--violet-light),var(--gold))' }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cofre / premio */}
      <div className="mt-3">
        {d.claimed ? (
          <div className="text-center text-xs font-bold text-[var(--emerald)] py-2">{t('rewardClaimed')} · {t('comeTomorrow')}</div>
        ) : allDone ? (
          <button onClick={claim} className={'btn btn-gold w-full text-sm min-h-touch ' + (burst ? 'wiggle' : 'glow-pulse')} aria-label={t('claimReward')}>
            🎁 {t('claimReward')}
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-dim)] py-1.5">
            <span className="text-xl" style={{ filter: 'grayscale(0.7) opacity(0.7)' }}>🎁</span>
            <span>{t('comeTomorrow')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
