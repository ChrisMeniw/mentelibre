// Paso 12 — Llamadas a la API de Anthropic (Claude).
// NOTA: la API key va directo en el header SOLO para el prototipo escolar.
// Para producción, usar un backend proxy (ver README).
const ENDPOINT = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'

export async function callClaude(systemPrompt, userMessage, maxTokens = 300) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) return null // sin clave: la UI usa un texto de respaldo y la app sigue funcionando

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
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
    if (!response.ok) return null
    const data = await response.json()
    return data.content?.[0]?.text || ''
  } catch {
    return null
  }
}

// ---- System prompts ----
export function responseSystemPrompt(childName, character, lang) {
  if (lang === 'pt') {
    return `Você é um mentor amável e curioso para crianças. A criança se chama ${childName} e seu personagem é ${character}. Responda em português do Brasil, de forma calorosa e simples. Sua resposta DEVE: 1) celebrar algo positivo do que a criança escreveu, 2) fazer UMA pergunta socrática para ela pensar mais, 3) contar um dado surpreendente e verdadeiro relacionado, 4) terminar com uma frase motivadora. Mencione o nome ${childName} e o personagem ${character}. Máximo 100 palavras. Nunca diga que a resposta está "errada".`
  }
  return `Sos un mentor amable y curioso para niños. El niño se llama ${childName} y su personaje es ${character}. Respondé en español neutro, cálido y simple. Tu respuesta DEBE: 1) celebrar algo positivo de lo que el niño escribió, 2) hacer UNA pregunta socrática para que piense más, 3) contar un dato sorprendente y verdadero relacionado, 4) terminar con una frase motivadora. Mencioná el nombre ${childName} y el personaje ${character}. Máximo 100 palabras. Nunca digas que la respuesta está "mal".`
}

export function hintSystemPrompt(lang) {
  if (lang === 'pt') {
    return 'Você ajuda crianças a pensar. Dê uma única dica curta que abra a imaginação, em forma de pergunta, SEM dar a resposta. Máximo 30 palavras, em português do Brasil.'
  }
  return 'Ayudás a niños a pensar. Dá una única pista corta que abra la imaginación, en forma de pregunta, SIN dar la respuesta. Máximo 30 palabras, en español neutro.'
}

// ---- Respuestas de respaldo (si no hay API key, para que la demo nunca se rompa) ----
export function fallbackResponse(childName, character, lang) {
  if (lang === 'pt') {
    return `Que ideia incrível, ${childName}! ${character} ficou orgulhoso de como você pensou. E se você imaginasse o oposto do que escreveu — o que mudaria? Curiosidade: o cérebro cria conexões novas toda vez que você pensa em algo difícil. Continue assim, sua mente está ficando mais forte! 🌟`
  }
  return `¡Qué idea increíble, ${childName}! A ${character} le encantó cómo pensaste. ¿Y si imaginaras lo contrario de lo que escribiste, qué cambiaría? Dato curioso: tu cerebro crea conexiones nuevas cada vez que pensás en algo difícil. ¡Seguí así, tu mente se está haciendo más fuerte! 🌟`
}

export function fallbackHint(lang) {
  return lang === 'pt'
    ? '¿E se você pensasse em como isso afeta outra pessoa?'
    : '¿Y si pensaras en cómo eso afecta a otra persona?'
}
