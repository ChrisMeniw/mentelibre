// ZOE "local" — GRATIS, sin API ni costo. Evalúa el pensamiento del chico con heurísticas
// simples (qué tan largo, si dio razones, si imaginó) y responde con calidez ADAPTÁNDOSE a
// eso: estrellas justas + un mensaje distinto según el caso. Se usa cuando la IA en la nube
// no está disponible (sin créditos), así el juego se siente vivo igual. Español neutro (tú).

const wordsOf = (s) => (String(s || '').trim().match(/\S+/g) || [])
// Semilla estable a partir del texto → elige una variante sin repetir siempre la misma.
const seedOf = (s) => { let h = 0; const t = String(s || ''); for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return Math.abs(h) }
const pick = (arr, seed) => arr[seed % arr.length]

// Marcadores de razonamiento e imaginación (ES + PT).
const REASON = /(porque|porqu[eé]|ya que|as[ií] que|entonces|por eso|debido|para que|igual que|pois|ent[ãa]o|porqu[eê])/i
const IMAGINE = /(imagin|ser[ií]a|podr[ií]a|tal vez|quiz[áa]s|\by si\b|capaz|invent|sue[ñn]|e se\b|seria|poderia|talvez|sonh)/i

// ---------- Rondas / Reto (preguntas abiertas de pensamiento) ----------
function scoreAnswer(answer) {
  const w = wordsOf(answer).length
  const deep = REASON.test(answer) || IMAGINE.test(answer)
  if (w <= 2) return 1            // muy cortito: invitamos a contar más
  if (deep && w >= 5) return 3    // explicó o imaginó: pensó de verdad
  if (w >= 14) return 3           // se explayó mucho
  return 2                        // intento válido (generoso)
}

const REACT = {
  es: {
    3: [
      (n) => `¡Guau, ${n}! Se nota que pensaste de verdad. Me encanta cómo lo explicaste. 🌟`,
      (n) => `¡Excelente, ${n}! Diste razones y eso es pensar en serio. 🚀`,
      (n) => `¡Qué mente, ${n}! Tu idea está llena de imaginación. 🧠✨`,
      (n) => `¡Tremendo, ${n}! Pensaste con tu propia cabeza y se nota un montón. 💫`,
      (n) => `¡Me dejaste pensando, ${n}! Esa forma de mirarlo es muy tuya. 🌟`,
    ],
    2: [
      (n) => `¡Buena idea, ${n}! ¿Y si me cuentas por qué lo piensas así? ✨`,
      (n) => `¡Me gusta, ${n}! Súmale un "porque..." y tu idea vuela más alto. 💜`,
      (n) => `¡Vas bien, ${n}! ¿Qué te hizo pensar eso? Contame un poco más. 🌱`,
      (n) => `¡Buen pensar, ${n}! ¿Se te ocurre un ejemplo para tu idea? 💡`,
      (n) => `¡Bien ahí, ${n}! ¿Y si lo imaginas al revés, qué pasaría? 🤔`,
    ],
    1: [
      (n) => `¡Buen comienzo, ${n}! Contame un poquito más: ¿qué te hace pensar eso? 💪`,
      (n) => `¡Vamos, ${n}! Una idea un poco más larga y la rompés. ¿Por qué lo dirías? 🌱`,
      (n) => `¡Dale, ${n}! Te escucho: ¿qué se te viene a la cabeza con esto? ✨`,
    ],
  },
  pt: {
    3: [
      (n) => `Uau, ${n}! Dá pra ver que você pensou de verdade. Adorei como explicou. 🌟`,
      (n) => `Excelente, ${n}! Você deu motivos e isso é pensar pra valer. 🚀`,
      (n) => `Que mente, ${n}! Sua ideia está cheia de imaginação. 🧠✨`,
      (n) => `Demais, ${n}! Você pensou com a sua própria cabeça e dá pra notar. 💫`,
      (n) => `Você me fez pensar, ${n}! Esse jeito de ver é bem seu. 🌟`,
    ],
    2: [
      (n) => `Boa ideia, ${n}! E se você me contar por que pensa assim? ✨`,
      (n) => `Gostei, ${n}! Coloca um "porque..." e sua ideia voa mais alto. 💜`,
      (n) => `Vai bem, ${n}! O que te fez pensar isso? Conta um pouco mais. 🌱`,
      (n) => `Bom pensamento, ${n}! Você tem um exemplo pra sua ideia? 💡`,
      (n) => `Mandou bem, ${n}! E se imaginar ao contrário, o que mudaria? 🤔`,
    ],
    1: [
      (n) => `Bom começo, ${n}! Conta um pouco mais: o que te faz pensar isso? 💪`,
      (n) => `Vamos, ${n}! Uma ideia um pouco maior e você arrasa. Por quê? 🌱`,
      (n) => `Bora, ${n}! Te escuto: o que vem à sua cabeça com isso? ✨`,
    ],
  },
}

// localReact → { stars, text }: igual forma que parseReact, para usar como respaldo directo.
export function localReact(childName, answer, lang = 'es', _ageGroup) {
  const n = childName || (lang === 'pt' ? 'amigo' : 'amigo')
  const stars = scoreAnswer(answer)
  const pool = (REACT[lang] || REACT.es)[stars]
  return { stars, text: pick(pool, seedOf(answer + n))(n) }
}

// ---------- El arte de preguntar (calidad de las PREGUNTAS del chico) ----------
const Q_OPEN = /(qu[eé]\b|c[oó]mo\b|por qu[eé]|cu[aá]l|para qu[eé]|o que|como|por que|qual)/i
const Q_IMAGINE = /(qu[eé] pasar[ií]a si|c[oó]mo ser[ií]a|\by si\b|por qu[eé] no|o que aconteceria|\be se\b|como seria)/i
const Q_YESNO = /^(es|son|tiene|tienen|hay|puede|pueden|est[áa]|fue|ser[áa]|tem|pode|existe|você gosta|te gusta)\b/i

function scoreQuestion(q) {
  const t = String(q || '').trim()
  const w = wordsOf(t).length
  if (Q_IMAGINE.test(t)) return 3
  if (Q_OPEN.test(t) && w >= 5) return 3
  if (Q_OPEN.test(t) || w >= 6) return 2
  if (w <= 2 || Q_YESNO.test(t)) return 1
  return 2
}

const ASK = {
  es: {
    3: [
      (n) => `¡Qué pregunta, ${n}! Esa abre mil caminos para imaginar. Preguntar así es pensar de verdad. 🚀`,
      (n) => `¡Tremendo, ${n}! Tu pregunta invita a mirar el tema desde varios lados. 🌟`,
      (n) => `¡Guau, ${n}! Esa es una pregunta de las que hacen pensar a todos. 🦉🚀`,
    ],
    2: [
      (n) => `¡Buena pregunta, ${n}! Para que vuele aún más, probá empezar con "¿qué pasaría si...?". 🌟`,
      (n) => `¡Me gusta, ${n}! ¿Y si la hacés más abierta, que no se conteste con sí o no? ✨`,
      (n) => `¡Vas bien, ${n}! Sumale un "¿por qué?" y tu pregunta se hace más profunda. 🌟`,
    ],
    1: [
      (n) => `¡Buen intento, ${n}! Esa se contesta rápido. Probá una que empiece con "por qué" o "cómo". 😊`,
      (n) => `¡Dale, ${n}! Una pregunta que no se conteste con sí o no abre mucho más. 😊`,
      (n) => `¡Vamos, ${n}! ¿Y si preguntás "qué pasaría si...?". Esas encienden ideas. 😊`,
    ],
  },
  pt: {
    3: [
      (n) => `Que pergunta, ${n}! Essa abre mil caminhos pra imaginar. Perguntar assim é pensar de verdade. 🚀`,
      (n) => `Demais, ${n}! Sua pergunta convida a olhar o tema de vários lados. 🌟`,
      (n) => `Uau, ${n}! Essa é uma pergunta das que fazem todo mundo pensar. 🦉🚀`,
    ],
    2: [
      (n) => `Boa pergunta, ${n}! Pra voar ainda mais, começa com "o que aconteceria se...?". 🌟`,
      (n) => `Gostei, ${n}! E se deixar mais aberta, que não se responda com sim ou não? ✨`,
      (n) => `Vai bem, ${n}! Coloca um "por quê?" e sua pergunta fica mais profunda. 🌟`,
    ],
    1: [
      (n) => `Boa tentativa, ${n}! Essa se responde rápido. Tenta uma com "por que" ou "como". 😊`,
      (n) => `Bora, ${n}! Uma pergunta que não se responda com sim ou não abre muito mais. 😊`,
      (n) => `Vamos, ${n}! E se perguntar "o que aconteceria se...?". Essas acendem ideias. 😊`,
    ],
  },
}

// localAsk → { stars, emoji, feedback }: igual forma que evaluateQuestion.
export function localAsk(childName, question, lang = 'es', _ageGroup) {
  const n = childName || (lang === 'pt' ? 'amigo' : 'amigo')
  const stars = scoreQuestion(question)
  const emoji = stars >= 3 ? '🚀' : stars === 2 ? '🌟' : '😊'
  const pool = (ASK[lang] || ASK.es)[stars]
  return { stars, emoji, feedback: pick(pool, seedOf(question + n))(n) }
}
