import { useLang } from '../i18n'

export default function SchoolBanner({ school, team, teamXP = 0 }) {
  const { t } = useLang()
  if (!school) return null
  return (
    <div className="card px-4 py-2.5 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="font-extrabold truncate">🏫 {school}</div>
        <div className="text-xs text-[var(--text-dim)]">{team}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] uppercase tracking-wide text-[var(--text-dim)]">{t('teamXP')}</div>
        <div className="font-extrabold text-[var(--gold)] tabular-nums">{teamXP.toLocaleString()}</div>
      </div>
    </div>
  )
}
