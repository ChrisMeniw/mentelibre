import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { WORLDS } from '../data/challenges'
import { isAskUnlocked, ASK_UNLOCK_XP } from '../data/levels'
import { avatarByEmoji } from '../components/AvatarPicker'
import { petById } from '../data/shop'
import { sfxPop } from '../lib/sfx'

const NODES_PER_WORLD = 5

// Posición serpenteante: desfase horizontal según el índice (zig-zag tipo Candy Crush).
const OFFSETS = [0, 58, 84, 58, 0, -58, -84, -58]
function offsetFor(i) { return OFFSETS[i % OFFSETS.length] }

export default function AdventureMap() {
  const { t, lang } = useLang()
  const { player } = usePlayer()
  const nav = useNavigate()
  const av = avatarByEmoji(player.avatar)
  const pet = petById(player.pet)
  const activeRef = useRef(null) // referencia al nivel activo (sin auto-scroll: dejamos ver el inicio primero)

  // Niveles hechos por mundo (tope 5).
  const doneByWorld = WORLDS.map((w) => Math.min(player.completed?.[w.id] || 0, NODES_PER_WORLD))
  // Primer nivel sin completar, en orden de lectura = el nivel ACTIVO.
  let activeW = -1, activeN = -1
  for (let wi = 0; wi < WORLDS.length && activeW < 0; wi++) {
    for (let ni = 0; ni < NODES_PER_WORLD; ni++) {
      if (ni >= doneByWorld[wi]) { activeW = wi; activeN = ni; break }
    }
  }

  const go = (worldId) => { sfxPop(); nav(`/ronda/${worldId}`) }
  const shake = (e) => {
    sfxPop()
    const el = e.currentTarget
    el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle')
  }

  let globalIndex = 0 // recorre los 20 niveles en orden

  return (
    <div className="relative">
      {/* Botón directo: entra al nivel ACTUAL al toque (sin recorrer el mapa) */}
      {activeW >= 0 && (
        <button onClick={() => go(WORLDS[activeW].id)} aria-label={t('continueCta')}
          className="btn btn-gold w-full text-lg min-h-touch mb-5 glow-pulse">
          ▶ {t('continueCta')}
        </button>
      )}
      {/* línea central del camino */}
      <div className="absolute left-1/2 top-2 bottom-2 -translate-x-1/2 w-1 rounded-full"
        style={{ background: 'repeating-linear-gradient(180deg, rgba(255,255,255,0.18) 0 8px, transparent 8px 18px)' }} />

      <div className="relative space-y-5 py-2">
        {WORLDS.map((w, wi) => {
          const wColor = w.color
          const wName = lang === 'pt' ? w.name_pt : w.name_es
          const worldDone = doneByWorld[wi]
          const worldComplete = worldDone >= NODES_PER_WORLD

          return (
            <div key={w.id} className="relative space-y-5">
              {/* Banner del bioma */}
              <div className="relative z-10 mx-auto w-fit px-4 py-1.5 rounded-full chip text-sm font-extrabold pop-in"
                style={{ background: `linear-gradient(135deg, ${wColor}33, ${wColor}11)`, borderColor: `${wColor}66`, boxShadow: `0 0 22px -6px ${wColor}` }}>
                <span className="text-lg mr-1">{w.emoji}</span> {wName}
              </div>

              {Array.from({ length: NODES_PER_WORLD }, (_, ni) => {
                const g = globalIndex++
                const state = ni < doneByWorld[wi]
                  ? 'done'
                  : (wi === activeW && ni === activeN ? 'active' : 'locked')
                const off = offsetFor(g)
                const isActive = state === 'active'

                return (
                  <div key={ni} className="relative flex justify-center" style={{ minHeight: 76 }}>
                    <div className="relative" style={{ transform: `translateX(${off}px)` }} ref={isActive ? activeRef : null}>
                      {/* Avatar parado sobre el nivel activo */}
                      {isActive && (
                        <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-20 flex items-end gap-0.5 pointer-events-none">
                          <div className="mascot-happy text-4xl" style={{ filter: `drop-shadow(0 6px 10px ${wColor}99)` }}>{player.avatar}</div>
                          {pet && <span className="text-xl floaty">{pet.emoji}</span>}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={state === 'locked' ? shake : () => go(w.id)}
                        aria-label={`${wName} ${ni + 1}`}
                        className={'relative grid place-items-center rounded-full jelly-tap ' + (isActive ? 'glow-pulse' : '')}
                        style={{
                          width: isActive ? 76 : 62,
                          height: isActive ? 76 : 62,
                          background: state === 'locked'
                            ? 'radial-gradient(circle at 35% 30%, #2A2440, #141022)'
                            : `radial-gradient(circle at 35% 28%, ${wColor}, ${wColor}88)`,
                          boxShadow: state === 'locked'
                            ? 'inset 0 -5px 12px rgba(0,0,0,0.5), inset 0 4px 8px rgba(255,255,255,0.06)'
                            : `inset 0 -6px 14px rgba(0,0,0,0.32), inset 0 5px 12px rgba(255,255,255,0.3), 0 10px 24px -8px ${wColor}`,
                          opacity: state === 'locked' ? 0.6 : 1,
                        }}
                      >
                        <span className="text-2xl" style={{ filter: state === 'locked' ? 'grayscale(1)' : 'none' }}>
                          {state === 'locked' ? '🔒' : w.emoji}
                        </span>
                        {/* badge de completado */}
                        {state === 'done' && (
                          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full grid place-items-center text-xs font-black"
                            style={{ background: 'linear-gradient(135deg,#FCD34D,var(--gold))', color: '#3B2A04', boxShadow: '0 4px 10px -3px rgba(251,191,36,0.8)' }}>✓</span>
                        )}
                        {/* número del nivel */}
                        {state !== 'locked' && (
                          <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full grid place-items-center text-[10px] font-black"
                            style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}>{ni + 1}</span>
                        )}
                      </button>

                      {/* etiqueta JUGAR en el nivel activo */}
                      {isActive && (
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 z-20 whitespace-nowrap px-3 py-0.5 rounded-full text-[11px] font-black floaty"
                          style={{ background: 'linear-gradient(135deg,#FFE08A,var(--gold))', color: '#3B2A04', boxShadow: '0 6px 16px -6px rgba(251,191,36,0.9)' }}>
                          {t('playNow')}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Cofre al final del bioma */}
              <div className="relative flex justify-center" style={{ minHeight: 64 }}>
                <div className="relative grid place-items-center rounded-2xl"
                  style={{
                    width: 64, height: 56,
                    background: worldComplete ? `linear-gradient(135deg, ${wColor}55, ${wColor}22)` : 'rgba(255,255,255,0.05)',
                    boxShadow: worldComplete ? `0 0 26px -4px ${wColor}` : 'none',
                    border: `1px solid ${worldComplete ? wColor : 'rgba(255,255,255,0.12)'}`,
                  }}>
                  <span className={'text-3xl ' + (worldComplete ? 'floaty' : '')} style={{ filter: worldComplete ? 'none' : 'grayscale(0.7) opacity(0.7)' }}>
                    {worldComplete ? '🏆' : '🎁'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {/* PINÁCULO: El arte de preguntar — se desbloquea en Filósofo (1400 XP) */}
        {(() => {
          const unlocked = isAskUnlocked(player.xp)
          return (
            <div className="relative space-y-3">
              <div className="relative z-10 mx-auto w-fit px-4 py-1.5 rounded-full chip text-sm font-extrabold pop-in"
                style={{ background: 'linear-gradient(135deg,#8B5CF633,#FBBF2411)', borderColor: '#8B5CF688', boxShadow: '0 0 24px -6px #8B5CF6' }}>
                <span className="text-lg mr-1">🦉</span> {t('modeAskTitle')}
              </div>
              <div className="relative flex justify-center" style={{ minHeight: 84 }}>
                <button
                  type="button"
                  onClick={unlocked ? () => { sfxPop(); nav('/preguntar') } : shake}
                  aria-label={t('modeAskTitle')}
                  className={'relative grid place-items-center rounded-full active:scale-90 transition ' + (unlocked ? 'glow-pulse' : '')}
                  style={{
                    width: 84, height: 84,
                    background: unlocked
                      ? 'radial-gradient(circle at 35% 28%, #A78BFA, #7C3AED)'
                      : 'radial-gradient(circle at 35% 30%, #2A2440, #141022)',
                    boxShadow: unlocked
                      ? 'inset 0 -6px 14px rgba(0,0,0,0.32), inset 0 5px 12px rgba(255,255,255,0.3), 0 0 30px -4px #8B5CF6'
                      : 'inset 0 -5px 12px rgba(0,0,0,0.5)',
                    opacity: unlocked ? 1 : 0.65,
                  }}>
                  <span className="text-3xl" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>{unlocked ? '🦉' : '🔒'}</span>
                </button>
              </div>
              {!unlocked && (
                <div className="text-center">
                  <div className="text-[11px] text-[var(--text-dim)] font-bold">{t('askLockedHint')}</div>
                  <div className="text-[11px] font-black text-[var(--violet-light)] mt-1">🔒 {t('xpToUnlock').replace('{n}', Math.max(0, ASK_UNLOCK_XP - player.xp))}</div>
                  <div className="mx-auto mt-1 h-1.5 w-36 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full" style={{ width: Math.min(100, Math.round((player.xp / ASK_UNLOCK_XP) * 100)) + '%', background: 'linear-gradient(90deg,#8B5CF6,#FBBF24)' }} />
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* Meta final */}
        <div className="text-center pt-1 pb-4">
          <div className="text-3xl floaty">🏁</div>
          <div className="text-xs text-[var(--text-dim)] font-bold mt-1">{t('mapGoal')}</div>
        </div>
      </div>
    </div>
  )
}
