import { useLang } from '../i18n'

// Branding fijo en TODA pantalla, sin scroll: logo + "Impulsado por Fundación Chris Meniw".
export default function FoundationBadge() {
  const { t } = useLang()
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 pointer-events-none safe-bottom"
      aria-label={`${t('poweredBy')} Fundación Chris Meniw`}
    >
      <div
        className="flex items-center justify-center gap-1.5 pt-3 pb-1 text-[10px] font-bold text-[var(--text-dim)]"
        style={{ background: 'linear-gradient(0deg, rgba(8,4,20,0.92) 40%, transparent)' }}
      >
        <img src="/foundation-logo.webp" alt="" width="15" height="15" className="rounded-full" style={{ width: 15, height: 15 }} />
        <span>
          {t('poweredBy')} <span className="text-[var(--violet-light)]">Fundación Chris Meniw</span>
        </span>
      </div>
    </div>
  )
}
