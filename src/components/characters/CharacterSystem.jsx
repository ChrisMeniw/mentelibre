import Kiko from './chibi/Kiko'
import Lumi from './chibi/Lumi'
import Nube from './chibi/Nube'
import Rayo from './chibi/Rayo'
import Cosmo from './chibi/Cosmo'
import Kai from './adventure/Kai'
import Nova from './adventure/Nova'
import Ryu from './adventure/Ryu'
import Sora from './adventure/Sora'
import Zen from './adventure/Zen'
import Kuro from './shonen/Kuro'
import Miyako from './shonen/Miyako'
import Shin from './shonen/Shin'
import Akira from './shonen/Akira'
import Ryoken from './shonen/Ryoken'

// Personajes por GRUPO DE EDAD REAL × 5 niveles. (El spec usaba 4 grupos; la app
// tiene 3: 6-8 chibi, 9-11 anime aventura, 12-15 shonen.)
const GROUPS = {
  '6-8': [Kiko, Lumi, Nube, Rayo, Cosmo],
  '9-11': [Kai, Nova, Ryu, Sora, Zen],
  '12-15': [Kuro, Miyako, Shin, Akira, Ryoken],
}

export const CHAR_NAMES = {
  '6-8': ['Kiko', 'Lumi', 'Nube', 'Rayo', 'Cosmo'],
  '9-11': ['Kai', 'Nova', 'Ryu', 'Sora', 'Zen'],
  '12-15': ['Kuro', 'Miyako', 'Shin', 'Akira', 'Ryoken'],
}
export const LEVEL_NAMES = {
  '6-8': ['Aprendiz', 'Explorador', 'Descubridor', 'Brillante', 'Maestro del Cosmos'],
  '9-11': ['Aventurero', 'Investigador', 'Pensador', 'Héroe', 'Iluminado'],
  '12-15': ['Iniciado', 'Explorador Oscuro', 'Estratega', 'Guardián', 'Sabio Oscuro'],
}

const clamp = (i) => Math.max(0, Math.min(4, i))
const grp = (a) => GROUPS[a] || GROUPS['9-11']

export function getCharacterComp(ageGroup = '9-11', levelIdx = 0) {
  return grp(ageGroup)[clamp(levelIdx)]
}
export function characterName(ageGroup, levelIdx) {
  return (CHAR_NAMES[ageGroup] || CHAR_NAMES['9-11'])[clamp(levelIdx)]
}
export function levelTitle(ageGroup, levelIdx) {
  return (LEVEL_NAMES[ageGroup] || LEVEL_NAMES['9-11'])[clamp(levelIdx)]
}

export default function CharacterSystem({ ageGroup = '9-11', level = 0, ...props }) {
  const Comp = getCharacterComp(ageGroup, level)
  return <Comp {...props} />
}
