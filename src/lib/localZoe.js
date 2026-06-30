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
// Puntaje JUSTO y DISCRIMINANTE de 1 a 5: 1★ muy poquito o sin sentido · 2★ intento corto ·
// 3★ una idea con cuerpo o un porqué breve · 4★ dio razones con buena extensión · 5★ MUY BIEN:
// pensó, explicó Y desarrolló (o imaginó con razón). El listón sube con la edad.
function scoreAnswer(answer, ageGroup = '9-11') {
  const w = wordsOf(answer).length
  if (w === 0 || looksLikeGibberish(answer)) return 1
  const B = BARS[ageGroup] || BARS['9-11']
  const reason = REASON.test(answer)      // dio un porqué
  const imagine = IMAGINE.test(answer)    // imaginó / propuso algo
  const developed = DEVELOP.test(answer)  // sumó más de una idea
  const deep = reason || imagine
  if (w <= B.tiny && !deep) return 1      // muy poquito y sin una razón
  if (!deep) {
    if (w >= B.long3) return 4            // se explayó muchísimo (aunque no marque el porqué)
    if (w >= B.reason3) return 3          // texto con buen cuerpo
    if (w >= B.two) return 2              // un intento corto
    return 1
  }
  // dio una razón o imaginó:
  const rich = developed || (reason && imagine)   // desarrolló varias ideas, o razonó E imaginó
  if (rich && w >= B.reason3) return 5    // MUY BIEN: pensó, explicó y desarrolló
  if (w >= B.long3) return 5              // larguísimo y con su porqué
  if (w >= B.reason3) return 4            // razón con buena extensión
  if (w >= B.two) return 3               // razón pero más cortito
  return 2
}

// Puntaje puro (1-3) para usar como respaldo GRATIS en otros modos (Aula, Reto) cuando la
// IA en la nube no está disponible: así TODOS los modos premian al que mejor piensa.
export function localScore(answer, ageGroup = '9-11') {
  return scoreAnswer(answer, ageGroup)
}

const REACT = {
  es: {
    5: [
      (n) => `¡Increíble, ${n}! Pensaste, explicaste tu porqué y lo desarrollaste. ¡Eso es pensar de verdad! 🌟🚀`,
      (n) => `¡Wow, ${n}! Una respuesta redonda: con razones e imaginación. ¡Me dejaste sin palabras! 🧠✨`,
      (n) => `¡Tremendo, ${n}! Le diste vueltas y armaste una idea completa. ¡De 5 estrellas! 💫`,
    ],
    4: [
      (n) => `¡Excelente, ${n}! Diste tus razones y se nota que lo pensaste muy bien. 🚀`,
      (n) => `¡Qué mente, ${n}! Tu idea tiene un porqué y mucha imaginación. 🧠✨`,
      (n) => `¡Muy bien, ${n}! Explicaste tu idea con ganas. ¿Le sumas un ejemplo y la haces brillar? 🌟`,
    ],
    3: [
      (n) => `¡Bien pensado, ${n}! Buena idea y diste un porqué. ¿Te animas a contarme un poquito más? 💡`,
      (n) => `¡Vas muy bien, ${n}! Ya tienes una idea con cuerpo. ¿Y si le agregas un ejemplo? 🌱`,
      (n) => `¡Me gusta, ${n}! Pensaste lindo. Un detalle más y llegas a las 5 estrellas. ✨`,
    ],
    2: [
      (n) => `¡Buena idea, ${n}! ¿Y si me cuentas por qué lo piensas así? ✨`,
      (n) => `¡Me gusta, ${n}! Súmale un "porque..." y tu idea vuela más alto. 💜`,
      (n) => `¡Vas bien, ${n}! ¿Qué te hizo pensar eso? Cuéntame un poco más. 🌱`,
      (n) => `¡Buen pensar, ${n}! ¿Se te ocurre un ejemplo para tu idea? 💡`,
    ],
    1: [
      (n) => `¡Buen comienzo, ${n}! Cuéntame un poquito más: ¿qué te hace pensar eso? 💪`,
      (n) => `¡Vamos, ${n}! Una idea un poco más larga y la logras. ¿Por qué lo dirías? 🌱`,
      (n) => `¡Dale, ${n}! Te escucho: ¿qué se te viene a la cabeza con esto? ✨`,
    ],
  },
  pt: {
    5: [
      (n) => `Incrível, ${n}! Você pensou, explicou o porquê e desenvolveu. Isso é pensar de verdade! 🌟🚀`,
      (n) => `Uau, ${n}! Uma resposta completa: com motivos e imaginação. Me deixou sem palavras! 🧠✨`,
      (n) => `Demais, ${n}! Você refletiu e montou uma ideia completa. De 5 estrelas! 💫`,
    ],
    4: [
      (n) => `Excelente, ${n}! Você deu seus motivos e dá pra ver que pensou muito bem. 🚀`,
      (n) => `Que mente, ${n}! Sua ideia tem um porquê e muita imaginação. 🧠✨`,
      (n) => `Muito bem, ${n}! Explicou sua ideia com vontade. Que tal somar um exemplo? 🌟`,
    ],
    3: [
      (n) => `Bem pensado, ${n}! Boa ideia e você deu um porquê. Conta um pouquinho mais? 💡`,
      (n) => `Você vai muito bem, ${n}! Já tem uma ideia com corpo. E se somar um exemplo? 🌱`,
      (n) => `Gostei, ${n}! Pensou bonito. Mais um detalhe e chega às 5 estrelas. ✨`,
    ],
    2: [
      (n) => `Boa ideia, ${n}! E se você me contar por que pensa assim? ✨`,
      (n) => `Gostei, ${n}! Coloca um "porque..." e sua ideia voa mais alto. 💜`,
      (n) => `Vai bem, ${n}! O que te fez pensar isso? Conta um pouco mais. 🌱`,
      (n) => `Bom pensamento, ${n}! Você tem um exemplo pra sua ideia? 💡`,
    ],
    1: [
      (n) => `Bom começo, ${n}! Conta um pouco mais: o que te faz pensar isso? 💪`,
      (n) => `Vamos, ${n}! Uma ideia um pouco maior e você consegue. Por quê? 🌱`,
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

// Calidad de la PREGUNTA del chico, de 1 a 5: 5★ una "¿qué pasaría si...?" desarrollada ·
// 4★ abierta y rica (o invita a imaginar) · 3★ abierta · 2★ pide info pero no abre · 1★ sí/no o vaga.
function scoreQuestion(q) {
  const t = String(q || '').trim()
  const w = wordsOf(t).length
  if (w === 0) return 1
  const open = Q_OPEN.test(t)
  const imagine = Q_IMAGINE.test(t)
  const yesno = Q_YESNO.test(t)
  if (imagine && w >= 7) return 5
  if (imagine || (open && w >= 8)) return 4
  if (open && w >= 5) return 3
  if (w <= 2 || yesno) return 1
  if (open || w >= 6) return 2
  return 2
}

const ASK = {
  es: {
    5: [
      (n) => `¡Qué pregunta, ${n}! Abre mil caminos para imaginar y comparar. Preguntar así es pensar de verdad. 🚀🌟`,
      (n) => `¡Increíble, ${n}! Esa pregunta hace pensar a cualquiera y no tiene una sola respuesta. 🦉🚀`,
      (n) => `¡Wow, ${n}! Una pregunta de 5 estrellas: invita a imaginar mundos nuevos. 💫`,
    ],
    4: [
      (n) => `¡Tremenda pregunta, ${n}! Invita a mirar el tema desde varios lados. 🌟`,
      (n) => `¡Muy buena, ${n}! Esa abre la imaginación. ¿Y si la empiezas con "¿qué pasaría si...?" para que vuele aún más? 🚀`,
      (n) => `¡Me encanta, ${n}! Es abierta y profunda. Una pregunta que da gusto pensar. 🌟`,
    ],
    3: [
      (n) => `¡Buena pregunta, ${n}! Para que vuele más, prueba empezar con "¿qué pasaría si...?". 🌟`,
      (n) => `¡Vas muy bien, ${n}! Súmale un "¿por qué?" y tu pregunta se hace más profunda. ✨`,
      (n) => `¡Me gusta, ${n}! ¿Y si la haces aún más abierta, para imaginar varias respuestas? 💡`,
    ],
    2: [
      (n) => `¡Buen intento, ${n}! ¿Y si la haces más abierta, que no se conteste con sí o no? ✨`,
      (n) => `¡Vas bien, ${n}! Prueba una que empiece con "por qué" o "cómo". 🌟`,
      (n) => `¡Bien ahí, ${n}! Una pregunta un poco más larga abre muchas ideas. 💡`,
    ],
    1: [
      (n) => `¡Buen intento, ${n}! Esa se contesta rápido. Prueba una que empiece con "por qué" o "cómo". 😊`,
      (n) => `¡Dale, ${n}! Una pregunta que no se conteste con sí o no abre mucho más. 😊`,
      (n) => `¡Vamos, ${n}! ¿Y si preguntas "qué pasaría si...?". Esas encienden ideas. 😊`,
    ],
  },
  pt: {
    5: [
      (n) => `Que pergunta, ${n}! Abre mil caminhos pra imaginar e comparar. Perguntar assim é pensar de verdade. 🚀🌟`,
      (n) => `Incrível, ${n}! Essa pergunta faz qualquer um pensar e não tem uma só resposta. 🦉🚀`,
      (n) => `Uau, ${n}! Uma pergunta de 5 estrelas: convida a imaginar mundos novos. 💫`,
    ],
    4: [
      (n) => `Que pergunta boa, ${n}! Convida a olhar o tema de vários lados. 🌟`,
      (n) => `Muito boa, ${n}! Essa abre a imaginação. E se começar com "o que aconteceria se...?" pra voar mais? 🚀`,
      (n) => `Adorei, ${n}! É aberta e profunda. Uma pergunta que dá gosto pensar. 🌟`,
    ],
    3: [
      (n) => `Boa pergunta, ${n}! Pra voar mais, começa com "o que aconteceria se...?". 🌟`,
      (n) => `Você vai muito bem, ${n}! Coloca um "por quê?" e sua pergunta fica mais profunda. ✨`,
      (n) => `Gostei, ${n}! E se deixar ainda mais aberta, pra imaginar várias respostas? 💡`,
    ],
    2: [
      (n) => `Boa tentativa, ${n}! E se deixar mais aberta, que não se responda com sim ou não? ✨`,
      (n) => `Vai bem, ${n}! Tenta uma que comece com "por que" ou "como". 🌟`,
      (n) => `Mandou bem, ${n}! Uma pergunta um pouco maior abre muitas ideias. 💡`,
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
  const emoji = stars >= 4 ? '🚀' : stars === 3 ? '🌟' : stars === 2 ? '✨' : '😊'
  const pool = (ASK[lang] || ASK.es)[stars]
  return { stars, emoji, feedback: pick(pool, seedOf(question + n))(n) }
}
