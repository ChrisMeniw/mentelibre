// Fuerza el modo de audio "playback" en iOS (Safari 16.4+). Sin esto, tener un
// <video> en la página pone la sesión de audio en modo "ambiente" y el SWITCH DE
// SILENCIO del iPhone mutea TODO — incluso Web Audio (música y efectos). Con
// "playback" el audio suena aunque el switch esté en silencio, como los juegos.
export function setPlaybackAudioSession() {
  try {
    if (typeof navigator !== 'undefined' && navigator.audioSession) {
      navigator.audioSession.type = 'playback'
    }
  } catch { /* noop */ }
}
