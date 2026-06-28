// Paso 12 — Llamadas a la API de Anthropic (Claude).
// NOTA: la API key va directo en el header SOLO para el prototipo escolar.
// Para producción, usar un backend proxy (ver README).
const ENDPOINT = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'

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

export async function callClaude(systemPrompt, userMessage, maxTokens = 300, timeoutMs = 20000) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) return null // sin clave: la UI usa un texto de respaldo y la app sigue funcionando

  // Reintenta UNA vez si falla la red/API antes de rendirse (la app nunca se traba igual).
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          // Permite llamar a la API directo desde el navegador (solo prototipo).
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        }),
      })
      clearTimeout(timer)
      if (!response.ok) { if (attempt === 0) continue; return null }
      const data = await response.json()
      return data.content?.[0]?.text || ''
    } catch {
      clearTimeout(timer)
      if (attempt === 0) continue // un reintento
      return null
    }
  }
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
    return 'Você avalia o PENSAMENTO de uma criança numa pergunta aberta (não há resposta certa nem errada). Dê uma nota de 1 a 3 conforme o quanto a criança pensou: 1 = respondeu muito curto, sem explicar; 2 = deu uma ideia com alguma razão; 3 = pensou de forma criativa, explicou o porquê ou deu exemplos. Seja generoso e incentivador. Responda APENAS com o número 1, 2 ou 3, sem mais nada.'
  }
  return 'Evalúas el PENSAMIENTO de un niño en una pregunta abierta (no hay respuesta correcta ni incorrecta). Da una nota del 1 al 3 según cuánto pensó: 1 = respondió muy corto, sin explicar; 2 = dio una idea con alguna razón; 3 = pensó de forma creativa, explicó el porqué o dio ejemplos. Sé generoso y alentador. Responde SOLO con el número 1, 2 o 3, sin nada más.'
}

// Extrae el puntaje (1-3) del texto devuelto. Por defecto 2 (alentador).
export function parseScore(text) {
  const m = (text || '').match(/[123]/)
  return m ? parseInt(m[0], 10) : 2
}

// ---- Reacción corta por pregunta dentro de una ronda (texto + estrellas en una sola llamada) ----
export function roundReactSystemPrompt(childName, lang, ageGroup) {
  if (lang === 'pt') {
    return `Você é ZOE, uma guia calorosa para crianças. ${childName} respondeu uma pergunta aberta de pensamento (não há resposta certa nem errada). Reaja em 1 ou 2 frases curtas celebrando a ideia; se foi muito curta, convide gentilmente a pensar um pouco mais. Chame ${childName} PELO NOME uma vez, de forma natural (nunca mais de 2 vezes). Português do Brasil, simples. No final, em uma linha separada, adicione a etiqueta de qualidade do pensamento exatamente assim: [ESTRELAS:N] onde N é 1, 2 ou 3 (3 = criativo e explica o porquê). Nunca diga que a resposta está errada.${toneFor(ageGroup, lang)}`
  }
  return `Eres ZOE, una guía cálida para niños. ${childName} respondió una pregunta abierta de pensamiento (no hay respuesta correcta ni incorrecta). Reacciona en 1 o 2 frases cortas celebrando su idea; si fue muy corta, invítalo con cariño a pensar un poco más. Dirígete a ${childName} POR SU NOMBRE una vez, de forma natural (nunca más de 2 veces). Español neutro y simple. Al final, en una línea aparte, agrega la etiqueta de calidad del pensamiento exactamente así: [ESTRELLAS:N] donde N es 1, 2 o 3 (3 = creativo y explica el porqué). Nunca digas que la respuesta está mal.${NEUTRO}${toneFor(ageGroup, lang)}`
}

// Separa la reacción (texto limpio) de las estrellas embebidas en la etiqueta.
export function parseReact(text) {
  const raw = text || ''
  const m = raw.match(/\[ESTREL?LAS?:\s*([123])\]/i)
  const stars = m ? parseInt(m[1], 10) : 2
  const clean = raw.replace(/\[ESTREL?LAS?:[^\]]*\]/ig, '').trim()
  return { stars, text: clean }
}

export function fallbackReact(childName, lang) {
  return lang === 'pt'
    ? `Adorei sua ideia, ${childName}! Você pensou de um jeito só seu. 💜`
    : `¡Me encantó tu idea, ${childName}! Pensaste de una forma muy tuya. 💜`
}

// El arte de preguntar: la IA puntúa la CALIDAD de las preguntas del chico (no responde nada).
export function askReactSystemPrompt(childName, lang, ageGroup) {
  if (lang === 'pt') {
    return `Você é ZOE, uma guia calorosa e socrática para crianças. ${childName} NÃO responde: o desafio é fazer as MELHORES PERGUNTAS sobre um tema. Leia o tema e as perguntas e pontue a QUALIDADE delas: ⭐ = pergunta superficial ou óbvia; ⭐⭐ = pergunta interessante que vai além do óbvio; ⭐⭐⭐ = pergunta profunda, filosófica, imaginativa e original. Critérios: profundidade, originalidade, curiosidade e imaginação. Em 1 ou 2 frases calorosas EXPLIQUE POR QUE essa pergunta foi boa (ou, com carinho, como poderia ir mais fundo), de forma socrática e sem dar respostas. Nunca diga que uma pergunta está errada: toda pergunta vale. No final, em uma linha separada, escreva exatamente: [ESTRELAS:N] com N = 1, 2 ou 3.${toneFor(ageGroup, lang)}`
  }
  return `Eres ZOE, una guía cálida y socrática para niños. ${childName} NO responde: el desafío es hacer las MEJORES PREGUNTAS sobre un tema. Lee el tema y sus preguntas y puntúa la CALIDAD de las preguntas así: ⭐ = pregunta superficial u obvia; ⭐⭐ = pregunta interesante que va más allá de lo obvio; ⭐⭐⭐ = pregunta profunda, filosófica, imaginativa y original. Criterios: profundidad, originalidad, curiosidad e imaginación. En 1 o 2 frases cálidas EXPLICA POR QUÉ esa pregunta fue buena (o, con cariño, cómo podría ir más profundo), al estilo socrático y sin dar respuestas. Nunca digas que una pregunta está mal: toda pregunta vale. Al final, en una línea aparte, escribe exactamente: [ESTRELLAS:N] con N = 1, 2 o 3.${NEUTRO}${toneFor(ageGroup, lang)}`
}

// evaluateQuestion(tema, pregunta, ageGroup) → { stars: 1|2|3, feedback }.
// Puntúa la calidad de las preguntas del chico (modelo abierto, sin respuesta correcta).
export async function evaluateQuestion(tema, pregunta, ageGroup, lang = 'es', childName = '') {
  const res = await callClaude(askReactSystemPrompt(childName, lang, ageGroup), `Tema: ${tema}\nPreguntas: ${pregunta}`, 140)
  if (!res) return { stars: 2, feedback: fallbackAskReact(childName, lang) }
  const parsed = parseReact(res)
  return { stars: parsed.stars || 2, feedback: parsed.text || fallbackAskReact(childName, lang) }
}

export function fallbackAskReact(childName, lang) {
  return lang === 'pt'
    ? `Que perguntas boas, ${childName}! Perguntar assim é pensar de verdade. 🦉💜`
    : `¡Qué buenas preguntas, ${childName}! Preguntar así es pensar de verdad. 🦉💜`
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
