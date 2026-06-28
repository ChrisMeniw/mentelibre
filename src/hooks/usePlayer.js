import { createContext, useContext, useState, useEffect, useCallback, createElement } from 'react'
import { BADGES } from '../data/badges'
import { levelForXP } from '../data/levels'
import { WORLDS } from '../data/challenges'
import { currentDaily, dailyComplete } from '../data/missions'

// Paso 7 — Estado central del jugador (persistido en localStorage).
const STORAGE_KEY = 'ml_player_v1'

const DEFAULT = {
  name: '', avatar: '🥷', avatarName: 'Sombra', ageGroup: '6-8',
  school: '', team: '',
  xp: 0, level: 0, streak: 0, lastPlayed: null, coins: 0,
  lights: 0, // estrellas encendidas en "Tu Universo" (1 por cada estrella de pensamiento)
  completed: {}, unlockedBadges: [], aiInteractions: 0,
  owned: [], pet: '', frame: '',
  daily: { date: '', rounds: 0, stars: 0, answers: 0, claimed: false },
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) }
  } catch { /* noop */ }
  return { ...DEFAULT }
}

function badgeState(p) {
  const totalCompleted = Object.values(p.completed || {}).reduce((a, b) => a + b, 0)
  return {
    totalCompleted,
    streak: p.streak,
    aiInteractions: p.aiInteractions,
    level: p.level,
    worldCompleted: (id) => p.completed?.[id] || 0,
    allWorldsAtLeastOne: () => WORLDS.every((w) => (p.completed?.[w.id] || 0) >= 1),
  }
}

function recomputeBadges(p) {
  const st = badgeState(p)
  return BADGES.filter((b) => b.check(st)).map((b) => b.id)
}

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(player)) } catch { /* noop */ }
  }, [player])

  const saveProfile = useCallback((name, avatar, avatarName, ageGroup, school, team) => {
    setPlayer((p) => {
      const next = { ...p, name, avatar, avatarName, ageGroup, school, team }
      return { ...next, unlockedBadges: recomputeBadges(next) }
    })
  }, [])

  // Marca hoy como jugado y actualiza la racha (días seguidos).
  const touchStreak = useCallback(() => {
    setPlayer((p) => {
      const today = new Date().toDateString()
      if (p.lastPlayed === today) return p
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const streak = p.lastPlayed === yesterday ? (p.streak || 0) + 1 : 1
      const next = { ...p, streak, lastPlayed: today }
      return { ...next, unlockedBadges: recomputeBadges(next) }
    })
  }, [])

  const addXP = useCallback((amount) => {
    setPlayer((p) => {
      const xp = Math.max(0, p.xp + amount)
      const level = levelForXP(xp)
      const next = { ...p, xp, level }
      return { ...next, unlockedBadges: recomputeBadges(next) }
    })
  }, [])

  const completeChallenge = useCallback((worldId) => {
    setPlayer((p) => {
      const completed = { ...(p.completed || {}), [worldId]: (p.completed?.[worldId] || 0) + 1 }
      const next = { ...p, completed }
      return { ...next, unlockedBadges: recomputeBadges(next) }
    })
  }, [])

  const addCoins = useCallback((amount) => {
    setPlayer((p) => ({ ...p, coins: Math.max(0, (p.coins || 0) + amount) }))
  }, [])

  // Enciende N estrellas en "Tu Universo" (1 por cada estrella de pensamiento ganada).
  const addLights = useCallback((n) => {
    setPlayer((p) => ({ ...p, lights: (p.lights || 0) + Math.max(0, n || 0) }))
  }, [])

  // Suma progreso a la misión diaria (resetea solo si cambió el día).
  const trackDaily = useCallback((delta) => {
    setPlayer((p) => {
      const d = currentDaily(p)
      return { ...p, daily: {
        ...d,
        rounds: d.rounds + (delta.rounds || 0),
        stars: d.stars + (delta.stars || 0),
        answers: d.answers + (delta.answers || 0),
      } }
    })
  }, [])

  // Reclama el premio diario (monedas) si las 3 misiones están completas. Devuelve el bono o 0.
  const claimDaily = useCallback((bonus) => {
    let given = 0
    setPlayer((p) => {
      const d = currentDaily(p)
      if (d.claimed || !dailyComplete(d)) return { ...p, daily: d }
      given = bonus
      return { ...p, coins: (p.coins || 0) + bonus, daily: { ...d, claimed: true } }
    })
    return given
  }, [])

  // Compra un ítem si alcanzan las monedas y no lo tiene. Devuelve true/false.
  const buyItem = useCallback((id, price) => {
    let ok = false
    setPlayer((p) => {
      const owned = p.owned || []
      if (owned.includes(id) || (p.coins || 0) < price) return p
      ok = true
      return { ...p, coins: p.coins - price, owned: [...owned, id] }
    })
    return ok
  }, [])

  // Equipa un ítem comprado: slot 'avatar' | 'pet' | 'frame'.
  const equip = useCallback((slot, value, avatarName) => {
    setPlayer((p) => {
      if (slot === 'avatar') return { ...p, avatar: value, avatarName: avatarName || p.avatarName }
      if (slot === 'pet') return { ...p, pet: value }
      if (slot === 'frame') return { ...p, frame: value }
      return p
    })
  }, [])

  const incrementAI = useCallback(() => {
    setPlayer((p) => {
      const next = { ...p, aiInteractions: (p.aiInteractions || 0) + 1 }
      return { ...next, unlockedBadges: recomputeBadges(next) }
    })
  }, [])

  const checkBadges = useCallback(() => {
    setPlayer((p) => ({ ...p, unlockedBadges: recomputeBadges(p) }))
  }, [])

  // Simula el XP del equipo de la escuela (jugador + ~compañeros).
  const getSchoolXP = useCallback(() => player.xp * 8 + 320, [player.xp])

  // Código único de 6 caracteres, determinista a partir del nombre/escuela.
  const generateSchoolCode = useCallback((name) => {
    const base = (name || player.school || 'MENTELIBRE').toUpperCase()
    let hash = 5381
    for (let i = 0; i < base.length; i++) hash = ((hash << 5) + hash + base.charCodeAt(i)) >>> 0
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      hash = (hash * 1103515245 + 12345) >>> 0
      // Usar los bits ALTOS: los bits bajos de un LCG son débiles (daban siempre "AAAAAA").
      code += chars[(hash >>> 17) % chars.length]
    }
    return code
  }, [player.school])

  const resetPlayer = useCallback(() => setPlayer({ ...DEFAULT }), [])

  const value = {
    player,
    hasProfile: !!player.name,
    saveProfile, touchStreak, addXP, completeChallenge, addCoins, addLights, buyItem, equip,
    trackDaily, claimDaily,
    incrementAI, checkBadges, getSchoolXP, generateSchoolCode, resetPlayer,
  }
  return createElement(PlayerContext.Provider, { value }, children)
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer debe usarse dentro de <PlayerProvider>')
  return ctx
}
