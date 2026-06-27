// Reto Diario: UNA pregunta del día, igual para todos, que rota cada día.
// Determinística por fecha → todos los chicos del mundo ven la misma hoy.
import { WORLDS, getQuestions } from '../data/challenges'

const STORE = 'ml_daily_reto' // { date, stars } del reto ya resuelto

// Clave de fecha local YYYY-MM-DD (horario del dispositivo).
export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Fecha legible para mostrar/compartir (DD/MM/AAAA).
export function prettyDate(d = new Date()) {
  const day = String(d.getDate()).padStart(2, '0')
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${m}/${d.getFullYear()}`
}

// Hash FNV-1a → entero estable a partir de un texto.
function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

// Pregunta del día para una edad. Misma para todos ese día; cambia cada día.
export function dailyQuestion(ageGroup = '9-11', dateKey = todayKey()) {
  const all = []
  for (const w of WORLDS) {
    for (const q of getQuestions(w.id, ageGroup)) {
      all.push({ ...q, world: w.id, color: w.color, emoji: w.emoji })
    }
  }
  if (!all.length) return null
  const idx = hashStr(`${dateKey}|${ageGroup}`) % all.length
  return all[idx]
}

// ¿Ya resolvió el reto de hoy? Devuelve {done, stars} o {done:false}.
export function dailyStatus(dateKey = todayKey()) {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE) || 'null')
    if (raw && raw.date === dateKey) return { done: true, stars: raw.stars || 0 }
  } catch { /* noop */ }
  return { done: false, stars: 0 }
}

export function markDailyDone(stars, dateKey = todayKey()) {
  try { localStorage.setItem(STORE, JSON.stringify({ date: dateKey, stars })) } catch { /* noop */ }
}
