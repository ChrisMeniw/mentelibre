import { useState } from 'react'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'

const MATE_NAMES = ['Sofi', 'Mateo', 'Valen', 'Tomás', 'Lucía', 'Benja']

export default function TeamTab() {
  const { t } = useLang()
  const { player, generateSchoolCode } = usePlayer()
  const [copied, setCopied] = useState(false)
  const code = generateSchoolCode(player.school)
  const mates = MATE_NAMES.map((n, i) => ({
    name: n,
    xp: Math.max(40, Math.round(player.xp * (0.35 + ((i * 13) % 55) / 100)) + 60),
  }))

  const copy = () => {
    try {
      navigator.clipboard?.writeText(code)
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    } catch { /* noop */ }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 fade-in">
        <div className="font-extrabold mb-1">🎯 {t('weeklyMission')}</div>
        <div className="text-sm text-[var(--text-dim)]">{t('weeklyMissionText')}</div>
      </div>

      <div className="card p-4 fade-in-d1">
        <div className="font-extrabold mb-2">👥 {t('classmates')}</div>
        <div className="space-y-1.5">
          {mates.map((m) => (
            <div key={m.name} className="flex justify-between text-sm">
              <span>🙂 {m.name}</span>
              <span className="text-[var(--gold)] font-bold tabular-nums">{m.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 flex items-center justify-between gap-3 fade-in-d2">
        <div>
          <div className="text-xs text-[var(--text-dim)]">{t('schoolCode')}</div>
          <div className="font-logo text-2xl tracking-[0.25em] text-[var(--violet-light)]">{code}</div>
        </div>
        <button onClick={copy} className="btn btn-ghost text-sm">{copied ? t('copied') : t('copy')}</button>
      </div>
    </div>
  )
}
