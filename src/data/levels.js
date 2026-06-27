// Paso 6 — 5 niveles de progreso
export const LEVELS = [
  { name_es: 'Aprendiz', name_pt: 'Aprendiz', min: 0,    max: 199 },
  { name_es: 'Curioso',  name_pt: 'Curioso',  min: 200,  max: 499 },
  { name_es: 'Pensador', name_pt: 'Pensador', min: 500,  max: 899 },
  { name_es: 'Crítico',  name_pt: 'Crítico',  min: 900,  max: 1399 },
  { name_es: 'Filósofo', name_pt: 'Filósofo', min: 1400, max: Infinity },
]

// El mundo "El arte de preguntar" se desbloquea al llegar a Filósofo (1400 XP).
export const ASK_UNLOCK_XP = 1400
export function isAskUnlocked(xp) { return (xp || 0) >= ASK_UNLOCK_XP }

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
