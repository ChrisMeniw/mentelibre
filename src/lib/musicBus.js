// Bus mínimo para que las pantallas de juego avisen a la música que se calle.
// La música suena en el menú/inicio y se detiene apenas se empieza a jugar.
let active = 0 // cuántas pantallas de juego están activas
const subs = new Set()

function emit() { subs.forEach((fn) => fn(active > 0)) }

export function enterGameplay() { active++; emit() }
export function exitGameplay() { active = Math.max(0, active - 1); emit() }
export function isGameplay() { return active > 0 }
export function subscribeGameplay(fn) { subs.add(fn); return () => subs.delete(fn) }
