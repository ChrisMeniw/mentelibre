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
    { to: '/logros', icon: '🏅', label: t('navBadges') },
    { to: '/docentes', icon: '👩‍🏫', label: t('navTeacher') },
  ]
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 safe-bottom pointer-events-none">
      <div className="mx-auto max-w-md m-2 card flex justify-around py-1.5 pointer-events-auto">
        {items.map((it) => {
          const active = loc.pathname === it.to
          return (
            <button
              key={it.to}
              onClick={() => nav(it.to)}
              className="flex flex-col items-center gap-0.5 px-5 py-1.5 active:scale-90 transition"
              style={{ color: active ? 'var(--gold)' : 'var(--text-dim)' }}
            >
              <span className="text-xl">{it.icon}</span>
              <span className="text-[10px] font-extrabold">{it.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
