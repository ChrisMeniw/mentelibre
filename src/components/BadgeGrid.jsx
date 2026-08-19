import { useLang, pickLang } from '../i18n'
import { BADGES } from '../data/badges'

export default function BadgeGrid({ unlocked = [] }) {
  const { lang, t } = useLang()
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {BADGES.map((b) => {
        const has = unlocked.includes(b.id)
        return (
          <div key={b.id} className={'card p-3 text-center fade-in ' + (has ? '' : 'opacity-60')}>
            <div className="text-3xl mb-1" style={{ filter: has ? 'none' : 'grayscale(1)' }}>
              {has ? b.emoji : '🔒'}
            </div>
            <div className="font-extrabold text-[13px] leading-tight">
              {pickLang(b, lang, 'name_')}
            </div>
            <div className="text-[11px] text-[var(--text-dim)] mt-1 leading-snug">
              {has ? pickLang(b, lang, 'desc_') : t('locked')}
            </div>
          </div>
        )
      })}
    </div>
  )
}
