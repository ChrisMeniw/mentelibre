// La voz REAL de ZOE (grabación de su clon de ElevenLabs, archivo en public/zoe-voz.mp3).
// Se reproduce cuando tocás a ZOE: ella te habla con su voz de verdad.
import { enterGameplay, exitGameplay } from './musicBus'

let audio = null
let ducking = false

function unduck() {
  if (ducking) { ducking = false; exitGameplay() } // devuelve la música del menú
}

function ensureAudio() {
  if (!audio && typeof window !== 'undefined') {
    audio = new Audio('/zoe-voz.mp3')
    audio.preload = 'auto'
    audio.addEventListener('ended', unduck)
    audio.load()
  }
  return audio
}

export function playZoeVoice() {
  const a = ensureAudio()
  if (!a) return
  try {
    a.currentTime = 0
    if (!ducking) { enterGameplay(); ducking = true } // baja la música mientras ZOE habla
    const p = a.play()
    if (p && p.catch) p.catch(() => unduck()) // si el navegador bloquea, devolvemos la música
  } catch { unduck() }
}

export function stopZoeVoice() {
  try { if (audio) audio.pause() } catch { /* noop */ }
  unduck()
}
