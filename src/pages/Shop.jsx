import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { PREMIUM_AVATARS, PETS, FRAMES } from '../data/shop'
import { POWERS } from '../data/powers'
import { sfxPop, sfxCorrect, sfxSparkle } from '../lib/sfx'

function CoinPrice({ n }) {
  return <span className="inline-flex items-center gap-1 font-black text-[var(--gold)]">🪙 {n}</span>
}

export default function Shop() {
  const { t, lang } = useLang()
  const { player, buyItem, equip, addCoins, addPower } = usePlayer()
  const nav = useNavigate()
  const [cat, setCat] = useState('powers')
  const [toast, setToast] = useState('')

  const owned = player.owned || []
  const cats = [
    { id: 'powers', icon: '⚡', label: lang === 'pt' ? 'Poderes' : 'Poderes' },
    { id: 'avatars', icon: '🧑‍🚀', label: t('catAvatars') },
    { id: 'pets', icon: '🐾', label: t('catPets') },
    { id: 'frames', icon: '✨', label: t('catFrames') },
  ]

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 1600) }

  const tryBuy = (id, price, onBought, el) => {
    if ((player.coins || 0) < price) {
      sfxPop(); flash(t('notEnough'))
      if (el) { el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle') }
      return
    }
    if (buyItem(id, price)) { sfxSparkle(); onBought(); flash(t('boughtToast')) }
  }

  // ⚡ Los poderes son CONSUMIBLES: se pueden comprar todas las veces que quieras.
  const tryBuyPower = (pw, el) => {
    if ((player.coins || 0) < pw.price) {
      sfxPop(); flash(t('notEnough'))
      if (el) { el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle') }
      return
    }
    addCoins(-pw.price); addPower(pw.id, 1); sfxSparkle(); flash(t('boughtToast'))
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-14 pb-28 space-y-4">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] card px-4 py-2 font-extrabold pop-in" style={{ borderColor: 'rgba(251,191,36,0.5)' }}>
          {toast}
        </div>
      )}

      {/* Encabezado */}
      <div className="flex items-center justify-between fade-in">
        <button onClick={() => { sfxPop(); nav('/hub') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-sm min-h-touch">←</button>
        <div className="text-center">
          <h1 className="font-logo text-2xl grad-text leading-none">🛒 {t('shopTitle')}</h1>
        </div>
        <div className="chip" style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.22),rgba(251,191,36,0.08))', borderColor: 'rgba(251,191,36,0.5)' }}>
          🪙 <span className="text-[var(--gold)] font-black">{player.coins || 0}</span>
        </div>
      </div>
      <p className="text-center text-xs text-[var(--text-dim)] -mt-2">{t('shopSub')}</p>

      {/* Categorías */}
      <div className="card flex p-1 gap-1">
        {cats.map((c) => (
          <button key={c.id} onClick={() => { sfxPop(); setCat(c.id) }} aria-pressed={cat === c.id} className="flex-1 btn text-sm py-2 min-h-touch"
            style={cat === c.id
              ? { background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff' }
              : { background: 'transparent', color: 'var(--text-dim)' }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* ⚡ PODERES — consumibles que se usan DURANTE la ronda (estrategia) */}
      {cat === 'powers' && (
        <div className="space-y-3 fade-in">
          <p className="text-center text-[12px] text-[var(--text-dim)] leading-snug">
            {lang === 'pt' ? 'Use durante a rodada: toque no poder acima da pergunta. Também saem dos baús! 🎁' : 'Se usan durante la ronda: toca el poder arriba de la pregunta. ¡También salen de los cofres! 🎁'}
          </p>
          {POWERS.map((pw) => {
            const count = player.powers?.[pw.id] || 0
            return (
              <div key={pw.id} className="card p-3.5 flex items-center gap-3.5 lift">
                <div className="shrink-0 w-14 h-14 rounded-2xl grid place-items-center text-3xl"
                  style={{ background: 'linear-gradient(140deg, rgba(168,85,247,0.28), rgba(124,58,237,0.10))', border: '1px solid rgba(168,85,247,0.45)' }}>
                  {pw.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-[15px] leading-tight">{lang === 'pt' ? pw.name_pt : pw.name_es}</div>
                  <div className="text-[11.5px] text-[var(--text-dim)] leading-snug mt-0.5">{lang === 'pt' ? pw.desc_pt : pw.desc_es}</div>
                  <div className="text-[11px] font-black text-[var(--violet-light)] mt-1">{lang === 'pt' ? 'Você tem' : 'Tienes'}: ×{count}</div>
                </div>
                <button onClick={(e) => tryBuyPower(pw, e.currentTarget)} className="btn btn-ghost shrink-0 text-xs py-2 px-3">
                  <CoinPrice n={pw.price} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* AVATARES */}
      {cat === 'avatars' && (
        <div className="grid grid-cols-2 gap-3 fade-in">
          {PREMIUM_AVATARS.map((a) => {
            const has = owned.includes(a.id)
            const equipped = player.avatar === a.emoji
            return (
              <div key={a.id} className="card p-3 flex flex-col items-center gap-2 lift">
                <div className="w-16 h-16 rounded-full grid place-items-center text-3xl floaty"
                  style={{ background: `radial-gradient(circle at 35% 28%, ${a.color}, ${a.color}88)`, boxShadow: `0 8px 20px -8px ${a.color}, inset 0 4px 10px rgba(255,255,255,0.25)` }}>
                  {a.emoji}
                </div>
                <div className="font-extrabold text-sm">{a.name}</div>
                {equipped ? (
                  <button disabled className="btn btn-gold w-full text-xs py-2 opacity-90">{t('equippedBtn')}</button>
                ) : has ? (
                  <button onClick={() => { sfxCorrect(); equip('avatar', a.emoji, a.name); flash(t('equippedToast')) }} className="btn btn-primary w-full text-xs py-2">{t('equipBtn')}</button>
                ) : (
                  <button onClick={(e) => tryBuy(a.id, a.price, () => equip('avatar', a.emoji, a.name), e.currentTarget)}
                    className="btn btn-ghost w-full text-xs py-2"><CoinPrice n={a.price} /></button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* MASCOTAS */}
      {cat === 'pets' && (
        <div className="grid grid-cols-2 gap-3 fade-in">
          {PETS.map((p) => {
            const has = owned.includes(p.id)
            const equipped = player.pet === p.id
            return (
              <div key={p.id} className="card p-3 flex flex-col items-center gap-2 lift">
                <div className="text-5xl floaty">{p.emoji}</div>
                <div className="font-extrabold text-sm">{p.name}</div>
                {equipped ? (
                  <button onClick={() => { sfxPop(); equip('pet', '') }} className="btn btn-gold w-full text-xs py-2">{t('equippedBtn')}</button>
                ) : has ? (
                  <button onClick={() => { sfxCorrect(); equip('pet', p.id); flash(t('equippedToast')) }} className="btn btn-primary w-full text-xs py-2">{t('equipBtn')}</button>
                ) : (
                  <button onClick={(e) => tryBuy(p.id, p.price, () => equip('pet', p.id), e.currentTarget)}
                    className="btn btn-ghost w-full text-xs py-2"><CoinPrice n={p.price} /></button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* MARCOS */}
      {cat === 'frames' && (
        <div className="grid grid-cols-2 gap-3 fade-in">
          {FRAMES.map((f) => {
            const has = owned.includes(f.id)
            const equipped = player.frame === f.id
            return (
              <div key={f.id} className="card p-3 flex flex-col items-center gap-2 lift">
                <div className="w-16 h-16 rounded-full grid place-items-center p-1" style={{ background: f.ring, boxShadow: `0 0 22px -4px ${f.glow}` }}>
                  <div className="w-full h-full rounded-full grid place-items-center text-2xl" style={{ background: 'var(--bg-deep)' }}>
                    {player.avatar}
                  </div>
                </div>
                <div className="font-extrabold text-sm">{f.name}</div>
                {equipped ? (
                  <button onClick={() => { sfxPop(); equip('frame', '') }} className="btn btn-gold w-full text-xs py-2">{t('equippedBtn')}</button>
                ) : has ? (
                  <button onClick={() => { sfxCorrect(); equip('frame', f.id); flash(t('equippedToast')) }} className="btn btn-primary w-full text-xs py-2">{t('equipBtn')}</button>
                ) : (
                  <button onClick={(e) => tryBuy(f.id, f.price, () => equip('frame', f.id), e.currentTarget)}
                    className="btn btn-ghost w-full text-xs py-2"><CoinPrice n={f.price} /></button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
