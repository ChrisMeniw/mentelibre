import { useEffect } from 'react'
import { usePlayer } from './usePlayer'

// Marca el día de hoy como jugado y actualiza la racha de días seguidos.
// Se llama una vez al entrar al Hub.
export function useStreak() {
  const { touchStreak } = usePlayer()
  useEffect(() => { touchStreak() }, [touchStreak])
}
