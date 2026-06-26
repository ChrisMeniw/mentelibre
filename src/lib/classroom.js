// Puntajes del Modo Aula — guardados en el dispositivo (la pantalla del aula).
// Ranking interno: grupos de la clase compitiendo en la misma tablet/compu.
const KEY = 'ml_classroom_v1'

export function loadScores() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

export function saveScore(entry) {
  const list = loadScores()
  list.push(entry)
  list.sort((a, b) => b.score - a.score)
  const top = list.slice(0, 200)
  try { localStorage.setItem(KEY, JSON.stringify(top)) } catch { /* noop */ }
  return top
}

// Ranking de escuelas: mejor puntaje de cada escuela (sumado por grupos no, mejor grupo).
export function schoolRanking(scores) {
  const by = {}
  for (const s of scores) {
    const k = (s.school || '—').trim()
    if (!by[k] || s.score > by[k].best) by[k] = { school: k, best: s.score, groups: 0, total: 0 }
  }
  // contar grupos y total por escuela
  const agg = {}
  for (const s of scores) {
    const k = (s.school || '—').trim()
    if (!agg[k]) agg[k] = { school: k, best: 0, groups: 0, total: 0 }
    agg[k].best = Math.max(agg[k].best, s.score)
    agg[k].groups += 1
    agg[k].total += s.score
  }
  return Object.values(agg).sort((a, b) => b.best - a.best)
}
