// Misiones diarias — se renuevan cada día. Motor de retención.
export const DAILY_TARGETS = { rounds: 1, answers: 8, stars: 12 }
export const DAILY_BONUS = 20 // monedas al completar las 3

export function todayKey() {
  return new Date().toDateString() // fecha local del dispositivo
}

export function freshDaily() {
  return { date: todayKey(), rounds: 0, stars: 0, answers: 0, claimed: false }
}

// Devuelve el progreso diario vigente (si es de otro día, arranca de cero).
export function currentDaily(player) {
  const d = player && player.daily
  return d && d.date === todayKey() ? d : freshDaily()
}

export function dailyComplete(d) {
  return d.rounds >= DAILY_TARGETS.rounds && d.answers >= DAILY_TARGETS.answers && d.stars >= DAILY_TARGETS.stars
}

// Definición de las 3 misiones (con textos traducidos).
export function dailyMissions(t) {
  return [
    { key: 'rounds', icon: '🎯', label: t('missionRounds'), target: DAILY_TARGETS.rounds },
    { key: 'answers', icon: '💬', label: t('missionAnswers'), target: DAILY_TARGETS.answers },
    { key: 'stars', icon: '⭐', label: t('missionStars'), target: DAILY_TARGETS.stars },
  ]
}
