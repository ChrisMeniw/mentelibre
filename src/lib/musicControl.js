// Puente para arrancar la música desde un gesto REAL (ej. tocar ¡Comenzar!),
// que es lo más confiable en iOS para saltar la política de autoplay.
let handler = null
export function setMusicKick(fn) { handler = fn }
export function kickMusic() { try { handler && handler() } catch { /* noop */ } }
