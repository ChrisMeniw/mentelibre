import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { sfxPop } from '../lib/sfx'
import Universe, { universeRank } from '../components/Universe'

// Pantalla "Tu Universo": la galaxia personal que crece con cada respuesta.
export default function MyUniverse() {
  const { t, lang } = useLang()
  const { player } = usePlayer()
  const nav = useNavigate()
  const lights = player.lights || 0
  const { rank, next } = universeRank(lights, lang)
  const toNext = next ? Math.max(0, next.at - lights) : 0

  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 min-h-dvh safe-top">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => { sfxPop(); nav('/hub') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-sm min-h-touch">←</button>
        <div className="font-logo text-2xl grad-text">{t('universeTitle')}</div>
      </div>
      <p className="text-sm text-[var(--text-dim)] leading-snug">{t('universeSub')}</p>

      {/* La galaxia */}
      <div className="relative mt-4 grid place-items-center">
        <div className="rounded-full" style={{ boxShadow: '0 0 80px -10px rgba(124,58,237,0.5)' }}>
          <Universe lights={lights} size={320} animated />
        </div>
      </div>

      {/* Contador + rango */}
      <div className="card p-4 mt-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-logo text-[var(--gold)] text-glow">🌟 {lights}</span>
          <span className="text-sm text-[var(--text-dim)] font-bold">{t('universeStars')}</span>
        </div>
        <div className="mt-2 chip mx-auto" style={{ background: 'rgba(168,85,247,0.18)', borderColor: 'rgba(168,85,247,0.6)', color: '#DDD6FE' }}>
          {t('universeRankLabel')}: <span className="font-black">{rank}</span>
        </div>
        {next ? (
          <div className="mt-3">
            <div className="text-xs text-[var(--text-dim)]">{t('universeToNext').replace('{n}', toNext).replace('{rank}', next.label)}</div>
            <div className="h-2 rounded-full overflow-hidden mt-1.5" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full" style={{ width: Math.min(100, Math.round(((lights - rankFloor(lights)) / (next.at - rankFloor(lights))) * 100)) + '%', background: 'linear-gradient(90deg,var(--violet-light),var(--gold))' }} />
            </div>
          </div>
        ) : (
          <div className="mt-3 text-xs font-extrabold text-[var(--gold)]">{t('universeMax')}</div>
        )}
      </div>

      <button onClick={() => { sfxPop(); nav('/hub') }} className="btn btn-gold w-full mt-5 text-lg min-h-touch">{t('universeKeepThinking')}</button>
    </div>
  )
}

// Piso del rango actual (el "at" del hito alcanzado) para la barra de progreso.
function rankFloor(lights) {
  const ms = [0, 10, 30, 60, 120, 250]
  let f = 0
  for (const m of ms) { if (lights >= m) f = m }
  return f
}
