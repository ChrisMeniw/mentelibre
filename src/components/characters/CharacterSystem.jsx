import Kuro from './shonen/Kuro'
import Miyako from './shonen/Miyako'
import Shin from './shonen/Shin'
import Akira from './shonen/Akira'
import Ryoken from './shonen/Ryoken'

// Personajes por GRUPO DE EDAD REAL del juego (6-8, 9-11, 12-15) × 5 niveles.
// Grupo C del spec (shonen, "13-15") → bucket real 12-15. Los grupos 6-8 (chibi)
// y 9-11 (anime aventura) se construyen en commits siguientes; por ahora caen al
// shonen como respaldo para no romper.
const SHONEN = [Kuro, Miyako, Shin, Akira, Ryoken]

const GROUPS = {
  '6-8': SHONEN,   // TODO: chibi (Kiko, Lumi, Nube, Rayo, Cosmo)
  '9-11': SHONEN,  // TODO: anime aventura (Kai, Nova, Ryu, Sora, Zen)
  '12-15': SHONEN,
}

// Nombres de personaje y de nivel por grupo (spec). Por ahora, los del shonen.
export const CHAR_NAMES = {
  '12-15': ['Kuro', 'Miyako', 'Shin', 'Akira', 'Ryoken'],
}
export const LEVEL_NAMES = {
  '12-15': ['Iniciado', 'Explorador Oscuro', 'Estratega', 'Guardián', 'Sabio Oscuro'],
}

export function getCharacterComp(ageGroup = '12-15', levelIdx = 0) {
  const g = GROUPS[ageGroup] || GROUPS['12-15']
  return g[Math.max(0, Math.min(4, levelIdx))]
}
export function characterName(ageGroup, levelIdx) {
  return (CHAR_NAMES[ageGroup] || CHAR_NAMES['12-15'])[Math.max(0, Math.min(4, levelIdx))]
}
export function levelTitle(ageGroup, levelIdx) {
  return (LEVEL_NAMES[ageGroup] || LEVEL_NAMES['12-15'])[Math.max(0, Math.min(4, levelIdx))]
}

export default function CharacterSystem({ ageGroup = '12-15', level = 0, ...props }) {
  const Comp = getCharacterComp(ageGroup, level)
  return <Comp {...props} />
}
