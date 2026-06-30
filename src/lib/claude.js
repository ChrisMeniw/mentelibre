import { localAsk } from './localZoe'

// Llamadas a ZOE (la profe IA) a través de NUESTRO proxy serverless /api/zoe.
// La API key vive SOLO en el servidor (ANTHROPIC_API_KEY), NUNCA se expone al navegador.
// Si el servidor no tiene clave o la API falla, el proxy devuelve texto vacío y el juego
// usa su respaldo cálido: la experiencia NUNCA se traba.
const ENDPOINT = '/api/zoe'

// ZOE habla ESPAÑOL NEUTRO LATINOAMERICANO (no argentino). Se agrega a cada prompt en español.
const NEUTRO = ' Habla en español neutro latinoamericano con "tú" (tú, tienes, piensas, puedes, sabes, eres, quieres). NUNCA uses voseo: nada de "vos", "tenés", "pensás", "podés", "sabés", "sos", "jugás", "querés". Suena como un locutor de radio latinoamericana: claro y cálido, sin acento de ningún país.'

// ZOE adapta su TONO al grupo de edad del chico.
function toneFor(ageGroup, lang) {
  if (lang === 'pt') {
    if (ageGroup === '6-8') return ' Tom: muito simples e animado, frases curtas, muita alegria, como um amigo mais velho que incentiva.'
    if (ageGroup === '12-15') return ' Tom: direto e respeitando a inteligência dele, de igual para igual, sem soar condescendente.'
    return ' Tom: aventureiro e cúmplice, como uma companheira de aventuras (usa palavras como "missão", "você descobriu").'
  }
  if (ageGroup === '6-8') return ' Tono: muy simple y entusiasta, frases cortas, mucha alegría, como un amigo mayor que te alienta.'
  if (ageGroup === '12-15') return ' Tono: directo y respetando su inteligencia, de igual a igual, sin sonar condescendiente.'
  return ' Tono: aventurero y cómplice, como una compañera de aventuras (usa palabras como "misión", "descubriste").' // 9-11
}

// El navegador YA NO conoce la clave (vive solo en el servidor). El juego SIEMPRE intenta
// ZOE vía el proxy y, si no hay respuesta, usa el respaldo cálido. Se mantiene por compatibilidad.
export function hasApiKey() {
  return true
}

// Monitoreo: si ZOE falla 3 veces seguidas, avisamos (para enganchar alertas reales).
let consecutiveFails = 0
function notifyAdmin() {
  // eslint-disable-next-line no-console
  console.warn('ALERT: ZOE API down — notify Chris Meniw')
}
function logApiError(err) {
  // eslint-disable-next-line no-console
  console.error(`[${new Date().toISOString()}] ZOE API error:`, err && err.message ? err.message : err)
}

// Si la IA en la nube NO está disponible (servidor sin clave o sin créditos), lo detectamos
// UNA vez y no la volvemos a llamar en la sesión: la respuesta de ZOE es LOCAL e INSTANTÁNEA
// (sin "ZOE pensando" colgado ni el botón Siguiente trabado). Si Chris carga créditos, vuelve.
let apiDown = false

// Chequeo de salud en segundo plano al cargar la app: cuando el chico responda, ya sabemos
// si la nube anda y la respuesta sale al toque (sin demora en la primera pregunta).
async function pingZoe() {
  try {
    const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: 'x', message: 'ping', maxTokens: 1 }) })
    const d = await r.json()
    if (!d || !d.text) apiDown = true
  } catch { apiDown = true }
}
if (typeof window !== 'undefined') { pingZoe() }

export async function callClaude(systemPrompt, userMessage, maxTokens = 300, timeoutMs = 9000) {
  if (apiDown) return null // IA en la nube caída/sin créditos: ZOE local INSTANTÁNEA
  let lastErr = null
  // Reintenta UNA vez si falla la red antes de rendirse (la app nunca se traba igual).
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: systemPrompt, message: userMessage, maxTokens }),
      })
      clearTimeout(timer)
      if (!response.ok) { lastErr = new Error('HTTP ' + response.status); if (attempt === 0) continue; break }
      const data = await response.json()
      const text = (data && data.text) || ''
      if (text) { consecutiveFails = 0; return text }
      apiDown = true // respuesta vacía (sin clave/sin créditos): de acá en más, local
      return null
    } catch (e) {
      clearTimeout(timer)
      lastErr = e
      if (attempt === 0) continue // un reintento
    }
  }
  apiDown = true // falló: el resto de la sesión usa la ZOE local
  consecutiveFails++
  logApiError(lastErr)
  if (consecutiveFails >= 3) notifyAdmin()
  return null
}

// ---- System prompts ----
export function responseSystemPrompt(childName, character, lang, ageGroup) {
  if (lang === 'pt') {
    return `Você é um mentor amável e curioso para crianças. A criança se chama ${childName} e seu personagem é ${character}. Responda em português do Brasil, de forma calorosa e simples. Sua resposta DEVE: 1) celebrar algo positivo do que a criança escreveu, 2) fazer UMA pergunta socrática para ela pensar mais, 3) contar um dado surpreendente e verdadeiro relacionado, 4) terminar com uma frase motivadora. Mencione o nome ${childName} e o personagem ${character}. Máximo 100 palavras. Nunca diga que a resposta está "errada".${toneFor(ageGroup, lang)}`
  }
  return `Eres un mentor amable y curioso para niños. El niño se llama ${childName} y su personaje es ${character}. Responde en español neutro (de Latinoamérica, usando "tú"), cálido y simple. Tu respuesta DEBE: 1) celebrar algo positivo de lo que el niño dijo, 2) hacer UNA pregunta socrática para que piense más, 3) contar un dato sorprendente y verdadero relacionado, 4) terminar con una frase motivadora. Menciona el nombre ${childName} y el personaje ${character}. Máximo 100 palabras. Nunca digas que la respuesta está "mal".${NEUTRO}${toneFor(ageGroup, lang)}`
}

export function hintSystemPrompt(lang) {
  if (lang === 'pt') {
    return 'Você ajuda crianças a pensar. Dê uma única dica curta que abra a imaginação, em forma de pergunta, SEM dar a resposta. Máximo 30 palavras, em português do Brasil.'
  }
  return 'Ayudas a niños a pensar. Da una única pista corta que abra la imaginación, en forma de pregunta, SIN dar la respuesta. Máximo 30 palabras, en español neutro (usando "tú").' + NEUTRO
}

// ---- Puntaje del PENSAMIENTO (premia al que mejor piensa) ----
export function scoreSystemPrompt(lang) {
  if (lang === 'pt') {
    return 'Você avalia o PENSAMENTO de uma criança numa pergunta aberta (não há resposta certa nem errada). Dê uma nota de 1 a 5 conforme o quanto a criança pensou: 1 = muito curto ou sem explicar (uma ou duas palavras); 2 = uma ideia curta; 3 = uma ideia com corpo ou um porquê breve; 4 = explicou bem seus motivos; 5 = pensou de forma criativa, explicou o porquê e desenvolveu (ou deu exemplos). Seja justo e incentivador: premie quem pensa mais e reserve o 5 para o que realmente merece. Responda APENAS com o número de 1 a 5, sem mais nada.'
  }
  return 'Evalúas el PENSAMIENTO de un niño en una pregunta abierta (no hay respuesta correcta ni incorrecta). Da una nota del 1 al 5 según cuánto pensó: 1 = muy corto o sin explicar (una o dos palabras); 2 = una idea corta; 3 = una idea con cuerpo o un porqué breve; 4 = explicó bien sus razones; 5 = pensó de forma creativa, explicó el porqué y desarrolló (o dio ejemplos). Sé justo y alentador: premia a quien piensa más y reserva el 5 para lo que de verdad lo merece. Responde SOLO con el número del 1 al 5, sin nada más.'
}

// Extrae el puntaje (1-3) del texto devuelto. Por defecto 2 (alentador).
export function parseScore(text) {
  const m = (text || '').match(/[1-5]/)
  return m ? parseInt(m[0], 10) : 3
}

// ---- Reacción corta por pregunta dentro de una ronda (texto + estrellas en una sola llamada) ----
export function roundReactSystemPrompt(childName, lang, ageGroup) {
  if (lang === 'pt') {
    return `Você é ZOE, uma guia calorosa para crianças. ${childName} respondeu uma pergunta aberta de pensamento (não há resposta certa nem errada). Reaja em 1 ou 2 frases curtas celebrando a ideia; se foi muito curta, convide gentilmente a pensar um pouco mais. Chame ${childName} PELO NOME uma vez, de forma natural (nunca mais de 2 vezes). Português do Brasil, simples. Avalie a qualidade do pensamento de 1 a 5: 1 = muito pouco ou sem explicar (uma ou duas palavras, sem um porquê); 2 = uma ideia curta, sem desenvolver; 3 = uma ideia com corpo ou um porquê breve; 4 = explicou bem seus motivos ou imaginou com detalhe; 5 = MUITO BEM: pensou, explicou o porquê e desenvolveu a ideia (ou imaginou com motivos). Premie de verdade quem pensa mais: reserve o 5 para respostas que realmente merecem e não dê 1 a quem se esforçou. No final, em uma linha separada, adicione exatamente: [ESTRELAS:N] onde N é de 1 a 5. Nunca diga que a resposta está errada.${toneFor(ageGroup, lang)}`
  }
  return `Eres ZOE, una guía cálida para niños. ${childName} respondió una pregunta abierta de pensamiento (no hay respuesta correcta ni incorrecta). Reacciona en 1 o 2 frases cortas celebrando su idea; si fue muy corta, invítalo con cariño a pensar un poco más. Dirígete a ${childName} POR SU NOMBRE una vez, de forma natural (nunca más de 2 veces). Español neutro y simple. Puntúa la calidad del pensamiento del 1 al 5: 1 = muy poquito o sin explicar (una o dos palabras, sin un porqué); 2 = una idea corta, sin desarrollar; 3 = una idea con cuerpo o un porqué breve; 4 = explicó bien sus razones o imaginó con detalle; 5 = MUY BIEN: pensó, explicó el porqué y desarrolló la idea (o imaginó con razones). Premia de verdad a quien piensa más: reserva el 5 para respuestas que de verdad lo merecen y no des 1 a quien sí se esforzó. Al final, en una línea aparte, agrega exactamente: [ESTRELLAS:N] donde N es del 1 al 5. Nunca digas que la respuesta está mal.${NEUTRO}${toneFor(ageGroup, lang)}`
}

// Separa la reacción (texto limpio) de las estrellas embebidas en la etiqueta.
export function parseReact(text) {
  const raw = text || ''
  const m = raw.match(/\[ESTREL?LAS?:\s*([1-5])\]/i)
  const stars = m ? parseInt(m[1], 10) : 3
  const clean = raw.replace(/\[ESTREL?LAS?:[^\]]*\]/ig, '').trim()
  return { stars, text: clean }
}

// Respaldos VARIADOS: para que ZOE se sienta viva aunque su IA esté en pausa (sin clave en
// el servidor) NO repite siempre la misma frase y usa el nombre del chico.
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export function fallbackReact(childName, lang) {
  const n = childName || (lang === 'pt' ? 'amigo' : 'amigo')
  const es = [
    `¡Me encantó cómo pensaste, ${n}! Esa idea es muy tuya. 💜`,
    `¡Qué manera de pensar, ${n}! Se nota que le diste vueltas. ✨`,
    `¡Excelente, ${n}! Pensaste con tu propia cabeza y eso vale oro. 🌟`,
    `¡Genial, ${n}! Tu idea me hizo pensar a mí también. 🚀`,
    `¡Buenísimo, ${n}! Cada vez piensas más profundo. 🧠💪`,
    `¡Me encanta, ${n}! No hay una sola forma de ver esto, y la tuya suma. 💫`,
  ]
  const pt = [
    `Adorei como você pensou, ${n}! Essa ideia é bem sua. 💜`,
    `Que jeito de pensar, ${n}! Dá pra ver que você refletiu. ✨`,
    `Excelente, ${n}! Você pensou com a sua própria cabeça e isso vale ouro. 🌟`,
    `Genial, ${n}! Sua ideia me fez pensar também. 🚀`,
    `Muito bom, ${n}! Cada vez você pensa mais fundo. 🧠💪`,
    `Adoro, ${n}! Não existe um único jeito de ver isso, e o seu conta. 💫`,
  ]
  return pick(lang === 'pt' ? pt : es)
}

// El arte de preguntar: ZOE puntúa la CALIDAD de las preguntas del chico (no responde nada).
// RÚBRICA FIJA Y EXPLÍCITA con ejemplos concretos: así la MISMA pregunta saca SIEMPRE las
// mismas estrellas (calibración consistente, sin arbitrariedad que desmotive). Salida en JSON.
export function askReactSystemPrompt(childName, lang, ageGroup) {
  const nom = childName
    ? (lang === 'pt' ? ` A criança se chama ${childName}; use o nome dela uma vez, com naturalidade.` : ` El niño se llama ${childName}; usa su nombre una vez, de forma natural.`)
    : ''
  if (lang === 'pt') {
    return `Você é ZOE, mentora de pensamento crítico para crianças de 6 a 15 anos. Sua única tarefa agora é avaliar a QUALIDADE da pergunta que a criança escreveu, usando EXATAMENTE esta rubrica:
⭐ (1 estrela): a pergunta tem resposta de sim/não, ou é vaga demais (ex.: "Por quê?", "O que é isso?").
⭐⭐ (2 estrelas): pede uma informação ou explicação pontual, mas não convida a pensar (ex.: "De que cor é o céu?").
⭐⭐⭐ (3 estrelas): é aberta (não se responde com sim/não) e convida a explicar (ex.: "Por que o céu é azul?").
⭐⭐⭐⭐ (4 estrelas): abre várias perspectivas ou convida a imaginar ou comparar (ex.: "Como seria o mundo se o céu fosse de outra cor?").
⭐⭐⭐⭐⭐ (5 estrelas): pergunta poderosa que imagina, compara e desafia suposições, sem uma só resposta (ex.: "O que aconteceria se o céu mudasse de cor todo dia e como mudaria nosso jeito de viver?").
Nunca diga que uma pergunta está "errada": toda pergunta vale; só mostre, com carinho, como poderia ir mais fundo.${nom} Responda APENAS com este JSON exato, sem nenhum texto a mais:
{"stars": 1, "emoji": "😊", "feedback": "uma única frase curta, calorosa, em português do Brasil, dirigida à criança, explicando por que recebeu essas estrelas e como poderia melhorar a pergunta"}
Use o emoji "😊" para 1 estrela, "✨" para 2, "🌟" para 3 e "🚀" para 4 ou 5 estrelas. O campo "stars" deve ser um número de 1 a 5.${toneFor(ageGroup, lang)}`
  }
  return `Eres ZOE, mentora de pensamiento crítico para niños de 6 a 15 años. Tu único trabajo en este momento es evaluar la CALIDAD de la pregunta que escribió el niño, usando EXACTAMENTE esta rúbrica:
⭐ (1 estrella): la pregunta tiene respuesta de sí/no, o es demasiado vaga (ej: "¿Por qué?", "¿Qué es eso?").
⭐⭐ (2 estrellas): pide información o una explicación puntual, pero no invita a pensar (ej: "¿De qué color es el cielo?").
⭐⭐⭐ (3 estrellas): es abierta (no se contesta con sí/no) e invita a explicar (ej: "¿Por qué el cielo es azul?").
⭐⭐⭐⭐ (4 estrellas): abre varias perspectivas o invita a imaginar o comparar (ej: "¿Cómo sería el mundo si el cielo fuera de otro color?").
⭐⭐⭐⭐⭐ (5 estrellas): pregunta poderosa que imagina, compara y desafía suposiciones, sin una sola respuesta (ej: "¿Qué pasaría si el cielo cambiara de color cada día y cómo cambiaría nuestra forma de vivir?").
Nunca digas que una pregunta está "mal": toda pregunta vale; solo muestra, con cariño, cómo podría ir más profundo.${nom} Responde SOLO con este JSON exacto, sin ningún texto adicional:
{"stars": 1, "emoji": "😊", "feedback": "una sola oración corta, cálida, en español neutro latinoamericano (usando tú), dirigida al niño, explicando por qué recibió esas estrellas y cómo podría mejorar su pregunta"}
Usa el emoji "😊" para 1 estrella, "✨" para 2, "🌟" para 3 y "🚀" para 4 o 5 estrellas. El campo "stars" debe ser un número del 1 al 5.${NEUTRO}${toneFor(ageGroup, lang)}`
}

// Lee el JSON de la rúbrica { stars, emoji, feedback }. Si la IA no devolviera JSON válido,
// cae al formato viejo [ESTRELLAS:N] para no romper nunca la experiencia del chico.
export function parseAskJSON(text) {
  const raw = text || ''
  try {
    const m = raw.match(/\{[\s\S]*\}/)
    if (m) {
      const o = JSON.parse(m[0])
      const stars = Math.max(1, Math.min(5, parseInt(o.stars, 10) || 3))
      const emoji = o.emoji || (stars >= 4 ? '🚀' : stars === 3 ? '🌟' : stars === 2 ? '✨' : '😊')
      const feedback = (o.feedback != null ? String(o.feedback) : '').trim()
      return { stars, emoji, feedback }
    }
  } catch { /* no era JSON válido: usamos el respaldo de abajo */ }
  const p = parseReact(raw)
  return { stars: p.stars, emoji: p.stars >= 4 ? '🚀' : p.stars === 3 ? '🌟' : p.stars === 2 ? '✨' : '😊', feedback: p.text }
}

// evaluateQuestion(tema, pregunta, ageGroup) → { stars: 1|2|3, emoji, feedback, failed }.
// Puntúa la calidad de las preguntas del chico con la rúbrica fija (modelo abierto, sin respuesta correcta).
export async function evaluateQuestion(tema, pregunta, ageGroup, lang = 'es', childName = '') {
  const res = await callClaude(askReactSystemPrompt(childName, lang, ageGroup), `Tema: ${tema}\nPregunta del niño: ${pregunta}`, 220)
  // Sin respuesta (sin créditos o falla) = ZOE local GRATIS: lee la pregunta del chico y
  // responde con estrellas justas y un mensaje a medida. El juego SIEMPRE sigue.
  if (!res) return localAsk(childName, pregunta, lang, ageGroup)
  const parsed = parseAskJSON(res)
  return { stars: parsed.stars, emoji: parsed.emoji, feedback: parsed.feedback || fallbackAskReact(childName, lang) }
}

export function fallbackAskReact(childName, lang) {
  const n = childName || (lang === 'pt' ? 'amigo' : 'amigo')
  const es = [
    `¡Qué buenas preguntas, ${n}! Preguntar así es pensar de verdad. 🦉💜`,
    `¡Me encantan tus preguntas, ${n}! La curiosidad es tu superpoder. ✨`,
    `¡Excelentes preguntas, ${n}! Quien pregunta bien, piensa mejor. 🚀`,
    `¡Guau, ${n}! Esas preguntas abren mil caminos. 🌟`,
    `¡Tremendo, ${n}! Cada pregunta tuya enciende una idea nueva. 💡`,
  ]
  const pt = [
    `Que perguntas boas, ${n}! Perguntar assim é pensar de verdade. 🦉💜`,
    `Adoro suas perguntas, ${n}! A curiosidade é o seu superpoder. ✨`,
    `Excelentes perguntas, ${n}! Quem pergunta bem, pensa melhor. 🚀`,
    `Uau, ${n}! Essas perguntas abrem mil caminhos. 🌟`,
    `Demais, ${n}! Cada pergunta sua acende uma ideia nova. 💡`,
  ]
  return pick(lang === 'pt' ? pt : es)
}

// ---- Respuestas de respaldo (si no hay API key, para que la demo nunca se rompa) ----
export function fallbackResponse(childName, character, lang) {
  if (lang === 'pt') {
    return `Que ideia incrível, ${childName}! ${character} ficou orgulhoso de como você pensou. E se você imaginasse o oposto do que escreveu — o que mudaria? Curiosidade: o cérebro cria conexões novas toda vez que você pensa em algo difícil. Continue assim, sua mente está ficando mais forte! 🌟`
  }
  return `¡Qué idea increíble, ${childName}! A ${character} le encantó cómo pensaste. ¿Y si imaginaras lo contrario de lo que dijiste, qué cambiaría? Dato curioso: tu cerebro crea conexiones nuevas cada vez que piensas en algo difícil. ¡Sigue así, tu mente se está haciendo más fuerte! 🌟`
}

export function fallbackHint(lang) {
  return lang === 'pt'
    ? '¿E se você pensasse em como isso afeta outra pessoa?'
    : '¿Y si pensaras en cómo eso afecta a otra persona?'
}
