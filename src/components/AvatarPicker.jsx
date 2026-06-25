import { PREMIUM_AVATARS } from '../data/shop'

// Paso 8 — 7 personajes
export const AVATARS = [
  { emoji: '🐬', name: 'Emmeline', color: '#0EA5E9' },
  { emoji: '👨‍🚀', name: 'Orion', color: '#1E3A5F' },
  { emoji: '🦁', name: 'Leo', color: '#F59E0B' },
  { emoji: '🦊', name: 'Zara', color: '#F97316' },
  { emoji: '🐧', name: 'Polo', color: '#64748B' },
  { emoji: '🦋', name: 'Luma', color: '#A855F7' },
  { emoji: '🐉', name: 'Drako', color: '#10B981' },
]

export function avatarByEmoji(e) {
  return AVATARS.find((a) => a.emoji === e)
    || PREMIUM_AVATARS.find((a) => a.emoji === e)
    || AVATARS[0]
}

export default function AvatarPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
      {AVATARS.map((a) => {
        const sel = value === a.emoji
        return (
          <button
            key={a.emoji}
            type="button"
            onClick={() => onChange(a)}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition"
          >
            <div
              className="w-16 h-16 rounded-full grid place-items-center text-3xl transition"
              style={{
                background: a.color,
                boxShadow: sel
                  ? '0 0 0 3px var(--gold), 0 10px 24px -8px rgba(251,191,36,0.6)'
                  : '0 6px 16px -10px rgba(0,0,0,0.8)',
                transform: sel ? 'scale(1.06)' : 'none',
              }}
            >
              {a.emoji}
            </div>
            <span
              className="text-[11px] font-extrabold px-2 py-0.5 rounded-full"
              style={
                sel
                  ? { background: 'linear-gradient(135deg,#FCD34D,var(--gold))', color: '#3B2A04' }
                  : { color: 'var(--text-dim)' }
              }
            >
              {a.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
