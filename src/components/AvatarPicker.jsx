import { PREMIUM_AVATARS } from '../data/shop'

// Paso 8 — 7 personajes tipo "skins" (estilo Fortnite, no animales)
export const AVATARS = [
  { emoji: '🥷', name: 'Sombra', color: '#6D28D9' },
  { emoji: '🤖', name: 'Robo', color: '#0EA5E9' },
  { emoji: '👽', name: 'Nova', color: '#22C55E' },
  { emoji: '🦸', name: 'Titán', color: '#2563EB' },
  { emoji: '🦹', name: 'Vórtex', color: '#A21CAF' },
  { emoji: '🧑‍🚀', name: 'Cosmo', color: '#1E3A5F' },
  { emoji: '🧙', name: 'Magnus', color: '#F59E0B' },
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
