// La voz REAL de ZOE (grabación de su clon de ElevenLabs, archivo en public/zoe-voz.mp3).
// Se reproduce cuando tocás a ZOE: ella te habla con su voz de verdad.
import { enterGameplay, exitGameplay } from './musicBus'

let audio = null
let ducking = false

function unduck() {
  if (ducking) { ducking = false; exitGameplay() } // devuelve la música del menú
}

export function playZoeVoice() {
  if (typeof window === 'undefined') return
  try {
    if (!audio) {
      audio = new Audio('/zoe-voz.mp3')
      audio.addEventListener('ended', unduck)
      audio.addEventListener('pause', unduck)
    }
    audio.currentTime = 0
    if (!ducking) { enterGameplay(); ducking = true } // baja la música mientras ZOE habla
    audio.play().catch(() => unduck())
  } catch { unduck() }
}

export function stopZoeVoice() {
  try { if (audio) audio.pause() } catch { /* noop */ }
  unduck()
}
