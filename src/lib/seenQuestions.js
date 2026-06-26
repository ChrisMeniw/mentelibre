// Recuerda qué preguntas ya salieron (por mundo + edad) para NO repetirlas
// al pasar de ronda. Cuando se agota el banco, reinicia el ciclo.
const KEY = 'ml_seen_q_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function save(d) {
  try { localStorage.setItem(KEY, JSON.stringify(d)) } catch { /* noop */ }
}
const keyOf = (worldId, ageGroup) => `${worldId}|${ageGroup}`

export function getSeen(worldId, ageGroup) {
  return load()[keyOf(worldId, ageGroup)] || []
}

export function addSeen(worldId, ageGroup, questions) {
  const d = load()
  const k = keyOf(worldId, ageGroup)
  const set = new Set(d[k] || [])
  questions.forEach((q) => set.add(q.es))
  d[k] = [...set]
  save(d)
}

export function resetSeen(worldId, ageGroup) {
  const d = load()
  d[keyOf(worldId, ageGroup)] = []
  save(d)
}
