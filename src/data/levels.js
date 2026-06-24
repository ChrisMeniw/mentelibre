// Paso 6 — 5 niveles de progreso
export const LEVELS = [
  { name_es: 'Explorador', name_pt: 'Explorador',  min: 0,    max: 199 },
  { name_es: 'Pensador',   name_pt: 'Pensador',    min: 200,  max: 499 },
  { name_es: 'Innovador',  name_pt: 'Inovador',    min: 500,  max: 899 },
  { name_es: 'Visionario', name_pt: 'Visionário',  min: 900,  max: 1399 },
  { name_es: 'Genio',      name_pt: 'Gênio',       min: 1400, max: Infinity },
]

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
