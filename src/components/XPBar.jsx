import { useLang } from '../i18n'
import { levelForXP, levelName, levelProgress } from '../data/levels'
import { levelTitle } from './characters/CharacterSystem'

export default function XPBar({ xp = 0, ageGroup = null }) {
  const { lang, t } = useLang()
  const pct = Math.round(levelProgress(xp) * 100)
  // Nombre de nivel por edad (Iniciado, Explorador Oscuro...) si hay ageGroup; si no, el genérico.
  const title = ageGroup ? levelTitle(ageGroup, levelForXP(xp)) : levelName(xp, lang)
  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline text-xs mb-1">
        <span className="font-extrabold text-[#F1F5F9]">
          {t('level')} {levelForXP(xp) + 1} · <span className="text-[var(--gold)]">{title}</span>
        </span>
        <span className="font-bold text-[var(--text-dim)]">{xp} XP</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="xp-fill h-full rounded-full"
          style={{ width: pct + '%', background: 'linear-gradient(90deg, var(--violet-light), var(--gold))' }}
        />
      </div>
    </div>
  )
}
