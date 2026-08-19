import { useState } from 'react'
import { useLang, pickLang, tri } from '../i18n'
import { POWERS } from '../data/powers'
import { sfxPop, sfxCoins, sfxStarsFanfare } from '../lib/sfx'

// 🎁 COFRE SORPRESA al terminar la ronda — recompensa VARIABLE (el gancho de
// Duolingo/Brawl Stars): nunca sabés qué te toca, y mientras mejor pensaste,
// mejor es el cofre. Bronce < Plata < ORO. Da monedas y, con suerte, un PODER.
const TIERS = {
  bronze: { emoji: '🎁', name_es: 'Cofre de Bronce', name_pt: 'Baú de Bronze', name_en: 'Bronze Chest', color: '#CD7F32', coins: [4, 8],  powerChance: 0.15 },
  silver: { emoji: '🎁', name_es: 'Cofre de Plata',  name_pt: 'Baú de Prata',  name_en: 'Silver Chest', color: '#C0C4CC', coins: [10, 16], powerChance: 0.35 },
  gold:   { emoji: '🎁', name_es: 'Cofre de ORO',    name_pt: 'Baú de OURO',   name_en: 'GOLD Chest',   color: 'var(--gold)', coins: [18, 30], powerChance: 1 },
}

export function chestTierFor(totalStars, maxStars) {
  const pct = maxStars > 0 ? totalStars / maxStars : 0
  return pct >= 0.72 ? 'gold' : pct >= 0.4 ? 'silver' : 'bronze'
}

export default function ChestReward({ tier = 'bronze', onClaim }) {
  const { lang } = useLang()
  const T = TIERS[tier] || TIERS.bronze
  const [state, setState] = useState('closed') // closed | open
  const [prize, setPrize] = useState(null)

  const open = () => {
    if (state !== 'closed') return
    sfxPop()
    // Botín al azar: monedas según el nivel del cofre + chance de un poder.
    const [lo, hi] = T.coins
    const coins = lo + Math.floor(Math.random() * (hi - lo + 1))
    const power = Math.random() < T.powerChance ? POWERS[Math.floor(Math.random() * POWERS.length)] : null
    const p = { coins, power }
    setPrize(p)
    setState('open')
    setTimeout(() => sfxCoins(), 240)
    if (power) setTimeout(() => sfxStarsFanfare(), 480)
    if (onClaim) onClaim(p)
  }

  return (
    <div className="mt-4 rounded-2xl p-4 text-center"
      style={{ background: `linear-gradient(180deg, ${T.color}1f, rgba(255,255,255,0.03))`, border: `1px solid ${T.color}66` }}>
      <div className="text-[11px] font-extrabold uppercase tracking-[0.18em]" style={{ color: T.color }}>
        {pickLang(T, lang, 'name_')}
      </div>

      {state === 'closed' ? (
        <button onClick={open} className="mt-1 active:scale-90 transition" aria-label={tri(lang, 'Abrir cofre', 'Abrir baú', 'Open chest')}>
          <span className="block text-6xl chest-wiggle" style={{ filter: `drop-shadow(0 10px 22px ${T.color}aa)` }}>{T.emoji}</span>
          <span className="mt-1 inline-block rounded-full px-4 py-1 text-[12px] font-black animate-pulse"
            style={{ background: `linear-gradient(135deg, ${T.color}, ${T.color}aa)`, color: '#1a0b2e' }}>
            {tri(lang, '👆 ¡Tócalo para abrirlo!', '👆 Toque para abrir!', '👆 Tap to open it!')}
          </span>
        </button>
      ) : (
        <div className="bounce-in">
          <div className="text-4xl">🎉</div>
          <div className="mt-1 flex items-center justify-center gap-3 flex-wrap">
            <span className="chip text-lg" style={{ background: 'rgba(251,191,36,0.18)', borderColor: 'rgba(251,191,36,0.55)' }}>
              <span className="coin-spin">🪙</span> <span className="text-[var(--gold)] font-black">+{prize.coins}</span>
            </span>
            {prize.power && (
              <span className="chip text-sm font-black" style={{ background: 'rgba(168,85,247,0.18)', borderColor: 'rgba(168,85,247,0.55)' }}>
                {prize.power.emoji} +1 {pickLang(prize.power, lang, 'name_')}
              </span>
            )}
          </div>
          {!prize.power && (
            <div className="text-[11px] text-[var(--text-dim)] mt-2">
              {tri(lang, 'Los cofres de ORO siempre traen un poder ⚡ ¡Piensa en grande!', 'Baús de OURO sempre trazem um poder ⚡ Pense em grande!', 'GOLD chests always bring a power ⚡ Think big!')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
