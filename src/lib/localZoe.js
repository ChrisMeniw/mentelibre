// ZOE "local" — GRATIS, sin API ni costo. Evalúa el pensamiento del chico con heurísticas
// simples (qué tan largo, si dio razones, si imaginó) y responde con calidez ADAPTÁNDOSE a
// eso: estrellas justas + un mensaje distinto según el caso. Se usa cuando la IA en la nube
// no está disponible (sin créditos), así el juego se siente vivo igual. Español neutro (tú).

const wordsOf = (s) => (String(s || '').trim().match(/\S+/g) || [])
// Semilla estable a partir del texto → elige una variante sin repetir siempre la misma.
const seedOf = (s) => { let h = 0; const t = String(s || ''); for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return Math.abs(h) }
const pick = (arr, seed) => arr[seed % arr.length]

// Marcadores de razonamiento, imaginación y desarrollo (ES + PT).
const REASON = /(porque|porqu[eé]|ya que|as[ií] que|entonces|por eso|debido|para que|igual que|gracias a|pois|ent[ãa]o|porqu[eê])/i
const IMAGINE = /(imagin|ser[ií]a|podr[ií]a|tal vez|quiz[áa]s|\by si\b|capaz|invent|sue[ñn]|e se\b|seria|poderia|talvez|sonh)/i
const DEVELOP = /(adem[áa]s|tambi[ée]n|por ejemplo|aunque|en cambio|primero|segundo|por un lado|al[ée]m disso|tamb[ée]m|por exemplo|embora|por outro lado)/i

// El listón SUBE con la edad: a un peque le pedimos menos palabras que a un grande para
// llegar a 3★ (tiny: por debajo y sin razón = 1★; two: alcanza 2★; reason3: con una razón
// llega a 3★; long3: se explayó mucho = 3★ aunque no use conectores).
const BARS = {
  '6-8':   { tiny: 2, two: 3, reason3: 5, long3: 10 },
  '9-11':  { tiny: 2, two: 4, reason3: 7, long3: 14 },
  '12-15': { tiny: 3, two: 5, reason3: 9, long3: 18 },
}

// ¿Tecleo al azar / sin sentido? (sin vocales, o un mismo caracter repetido muchísimo) → 1★.
function looksLikeGibberish(s) {
  const t = String(s || '').toLowerCase().replace(/\s+/g, '')
  if (t.length < 4) return false // muy corto se evalúa por longitud, no acá
  if (!/[aeiouáéíóúãõ]/.test(t)) return true
  if (/(.)\1{4,}/.test(t)) return true
  return false
}

// ---------- Rondas / Reto (preguntas abiertas de pensamiento) ----------
// Puntaje JUSTO y DISCRIMINANTE: premia a quien piensa de verdad (da razones, imagina,
// desarrolla) con 3★; un intento válido saca 2★; muy poquito o sin sustancia, 1★.
function scoreAnswer(answer, ageGroup = '9-11') {
  const w = wordsOf(answer).length
  if (w === 0) return 1
  if (looksLikeGibberish(answer)) return 1
  const B = BARS[ageGroup] || BARS['9-11']
  const deep = REASON.test(answer) || IMAGINE.test(answer)   // dio una razón o imaginó
  const developed = DEVELOP.test(answer)                     // sumó más de una idea
  // 3★ — pensó de verdad: razón/imaginación con cuerpo, o se explayó mucho, o desarrolló varias ideas
  if ((deep && w >= B.reason3) || w >= B.long3 || (deep && developed && w >= B.two)) return 3
  // 1★ — muy poquito y sin una razón
  if (w <= B.tiny && !deep) return 1
  // 2★ — intento válido: algo de cuerpo o una razón corta
  if (w >= B.two || deep) return 2
  // quedó entre medio (cortito y sin razón) → todavía 1★; ZOE lo invita a contar más
  return 1
}

// Puntaje puro (1-3) para usar como respaldo GRATIS en otros modos (Aula, Reto) cuando la
// IA en la nube no está disponible: así TODOS los modos premian al que mejor piensa.
export function localScore(answer, ageGroup = '9-11') {
  return scoreAnswer(answer, ageGroup)
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
export function localReact(childName, answer, lang = 'es', ageGroup = '9-11') {
  const n = childName || (lang === 'pt' ? 'amigo' : 'amigo')
  const stars = scoreAnswer(answer, ageGroup)
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
