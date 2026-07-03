// ⚡ PODERES — consumibles que se compran con monedas (o salen de los cofres) y se
// usan DURANTE la ronda. Le dan estrategia al juego: ¿cuándo conviene gastarlos?
export const POWERS = [
  {
    id: 'time', emoji: '⏳', price: 15,
    name_es: 'Tiempo extra', name_pt: 'Tempo extra',
    desc_es: '+15 segundos para pensar esa pregunta.', desc_pt: '+15 segundos para pensar nessa pergunta.',
  },
  {
    id: 'hint', emoji: '💡', price: 20,
    name_es: 'Pista de ZOE', name_pt: 'Dica da ZOE',
    desc_es: 'ZOE te da una pista para destrabar tu idea.', desc_pt: 'A ZOE dá uma dica para destravar sua ideia.',
  },
  {
    id: 'double', emoji: '✨', price: 25,
    name_es: 'XP doble', name_pt: 'XP em dobro',
    desc_es: 'La próxima respuesta vale el DOBLE de XP.', desc_pt: 'A próxima resposta vale o DOBRO de XP.',
  },
]

export function powerById(id) { return POWERS.find((p) => p.id === id) || null }

// Pistas LOCALES de ZOE (gratis e instantáneas): preguntas que destraban el pensamiento.
const HINTS = {
  es: [
    '💡 ¿Y si piensas en cómo afecta a otra persona?',
    '💡 Prueba con un ejemplo de tu propia vida.',
    '💡 ¿Qué pasaría si fuera exactamente al revés?',
    '💡 Empieza con "Yo creo que… porque…".',
    '💡 ¿Qué diría alguien que piensa distinto a ti?',
    '💡 Imagina que se lo explicas a un niño más pequeño.',
    '💡 ¿Qué es lo PRIMERO que se te vino a la cabeza? ¿Por qué?',
  ],
  pt: [
    '💡 E se você pensar em como afeta outra pessoa?',
    '💡 Tenta um exemplo da sua própria vida.',
    '💡 O que aconteceria se fosse exatamente ao contrário?',
    '💡 Começa com "Eu acho que… porque…".',
    '💡 O que diria alguém que pensa diferente de você?',
    '💡 Imagina que você explica para uma criança menor.',
    '💡 O que veio PRIMEIRO à sua cabeça? Por quê?',
  ],
}

export function localHint(lang = 'es', seed = 0) {
  const pool = HINTS[lang] || HINTS.es
  return pool[Math.abs(seed) % pool.length]
}
