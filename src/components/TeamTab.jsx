import { useState } from 'react'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { avatarByEmoji } from './AvatarPicker'

export default function TeamTab() {
  const { t } = useLang()
  const { player, generateSchoolCode } = usePlayer()
  const [copied, setCopied] = useState(false)
  const code = generateSchoolCode(player.school)
  const av = avatarByEmoji(player.avatar)

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

      {/* Tu progreso real (sin nombres inventados) */}
      <div className="card p-4 fade-in-d1">
        <div className="font-extrabold mb-2">👥 {t('classmates')}</div>
        <div className="flex items-center justify-between rounded-2xl px-3 py-2" style={{ background: 'rgba(251,191,36,0.10)' }}>
          <span className="flex items-center gap-2 font-bold">
            <span className="text-xl">{player.avatar}</span> {player.name || t('you')} ⭐
          </span>
          <span className="text-[var(--gold)] font-extrabold tabular-nums">{(player.xp || 0).toLocaleString()} XP</span>
        </div>
        <div className="text-xs text-[var(--text-dim)] mt-3 text-center">{t('noMatesYet')}</div>
      </div>

      {/* Invitar a la clase con el código */}
      <div className="card p-4 fade-in-d2 text-center">
        <div className="font-extrabold mb-1">📨 {t('inviteTitle')}</div>
        <div className="text-xs text-[var(--text-dim)] mb-3">{t('inviteText')}</div>
        <div className="font-logo text-3xl tracking-[0.25em] text-[var(--violet-light)] mb-3">{code}</div>
        <button onClick={copy} className="btn btn-primary w-full text-sm">{copied ? t('copied') : t('copyCode')}</button>
      </div>
    </div>
  )
}
