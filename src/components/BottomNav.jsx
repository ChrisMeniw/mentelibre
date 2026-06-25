import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../i18n'

export default function BottomNav() {
  const { t } = useLang()
  const nav = useNavigate()
  const loc = useLocation()
  // No mostrar en el onboarding ni dentro de un desafío.
  if (loc.pathname === '/' || loc.pathname.startsWith('/desafio')) return null
  const items = [
    { to: '/hub', icon: '🏠', label: t('navHome') },
    { to: '/tienda', icon: '🛒', label: t('navShop') },
    { to: '/logros', icon: '🏅', label: t('navBadges') },
    { to: '/docentes', icon: '👩‍🏫', label: t('navTeacher') },
  ]
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 safe-bottom pointer-events-none">
      <div className="mx-auto max-w-md m-2 mb-7 card flex justify-around py-1.5 pointer-events-auto">
        {items.map((it) => {
          const active = loc.pathname === it.to
          return (
            <button
              key={it.to}
              onClick={() => { nav(it.to); window.scrollTo({ top: 0, behavior: 'instant' }) }}
              className="relative flex flex-col items-center gap-0.5 px-3.5 py-1.5 active:scale-90 transition"
              style={{ color: active ? 'var(--gold)' : 'var(--text-dim)' }}
            >
              {active && (
                <span
                  className="absolute inset-0 m-auto w-11 h-9 rounded-full -z-0"
                  style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.22), transparent 70%)' }}
                />
              )}
              <span className="text-xl relative">{it.icon}</span>
              <span className="text-[10px] font-extrabold relative">{it.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
