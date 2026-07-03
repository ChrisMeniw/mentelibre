// Paso 6 — 5 niveles de progreso
export const LEVELS = [
  { name_es: 'Aprendiz', name_pt: 'Aprendiz', min: 0,    max: 199 },
  { name_es: 'Curioso',  name_pt: 'Curioso',  min: 200,  max: 499 },
  { name_es: 'Pensador', name_pt: 'Pensador', min: 500,  max: 899 },
  { name_es: 'Crítico',  name_pt: 'Crítico',  min: 900,  max: 1399 },
  { name_es: 'Filósofo', name_pt: 'Filósofo', min: 1400, max: Infinity },
]

// El mundo "El arte de preguntar" se desbloquea al RESPONDER 20 PREGUNTAS (logro
// alcanzable en 2-3 días de juego, no una meta lejana). Los jugadores viejos que ya
// habían llegado a Filósofo (1400 XP) lo conservan.
export const ASK_UNLOCK_ANSWERS = 20
export function isAskUnlocked(player) {
  if (typeof player === 'number') return player >= 1400 // compatibilidad con llamadas viejas por XP
  return (player?.answers || 0) >= ASK_UNLOCK_ANSWERS || (player?.xp || 0) >= 1400
}

// Índice de nivel (0..4) para una cantidad de XP
export function levelForXP(xp) {
  let idx = 0
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) idx = i
  return idx
}

// Progreso 0..1 dentro del nivel actual
export function levelProgress(xp) {
  const i = levelForXP(xp)
  const lvl = LEVELS[i]
  if (lvl.max === Infinity) return 1
  return Math.min(1, (xp - lvl.min) / (lvl.max + 1 - lvl.min))
}

export function levelName(xp, lang) {
  const lvl = LEVELS[levelForXP(xp)]
  return lang === 'pt' ? lvl.name_pt : lvl.name_es
}
