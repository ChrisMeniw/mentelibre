import { useEffect } from 'react'
import { sfxPop } from '../lib/sfx'

// Sonido GLOBAL al tocar cualquier botón/enlace. Así NINGÚN botón queda mudo,
// incluso los que no llaman a sfxPop por su cuenta. El anti-doble de sfxPop evita
// que suene dos veces cuando el botón ya tenía su propio sonido.
export default function TapSound() {
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target && e.target.closest && e.target.closest('button, a, [role="button"], input[type="submit"], label')
      if (el && !el.disabled && el.getAttribute('aria-disabled') !== 'true') sfxPop()
    }
    document.addEventListener('click', onClick, true) // captura: corre siempre, incluso si algo frena la propagación
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
