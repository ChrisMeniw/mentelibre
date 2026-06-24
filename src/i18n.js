import { createContext, useContext, useState, useCallback, createElement } from 'react'

// Paso 5 — Diccionario ES/PT. El nombre de la app cambia por idioma.
export const LANG_DATA = {
  es: {
    appName: 'MenteLibre',
    tagline: 'Pensar es un superpoder',
    subtitle: 'Entrená tu mente con la ayuda de la IA. Gratis para escuelas.',

    // Onboarding
    chooseAvatar: 'Elegí tu personaje',
    yourName: '¿Cómo te llamás?',
    namePlaceholder: 'Tu nombre',
    ageLabel: 'Tu edad',
    schoolLabel: 'Tu escuela',
    schoolPlaceholder: 'Nombre de la escuela',
    chooseTeam: 'Elegí tu equipo',
    start: '¡Empezar!',
    next: 'Siguiente',
    back: 'Volver',

    // Navegación
    navHome: 'Inicio',
    navBadges: 'Logros',
    navTeacher: 'Docentes',

    // Hub tabs
    tabPlay: 'Jugar',
    tabTeam: 'Mi Equipo',
    tabRanking: 'Ranking',
    chooseWorld: 'Elegí un mundo para explorar',
    completed: 'completados',
    weeklyMission: 'Misión de la semana',
    weeklyMissionText: 'Completá 3 desafíos con tu equipo',
    classmates: 'Compañeros de equipo',
    schoolCode: 'Código de tu escuela',
    copy: 'Copiar',
    copied: '¡Copiado!',
    teamXP: 'XP del equipo',
    rankingTitle: 'Escuelas de LATAM',
    you: 'Vos',

    // Challenge
    step: 'Paso',
    question: 'La pregunta',
    writeYourAnswer: 'Escribí lo que pensás...',
    minWordsHint: 'Escribí al menos 20 palabras para enviar',
    words: 'palabras',
    needHint: '💡 Necesito una pista',
    thinking: 'Pensando...',
    sendAnswer: 'Enviar respuesta →',
    yourAnswer: 'Tu respuesta',
    aiThinking: 'La IA está leyendo tu respuesta...',
    gotItNext: '¡Entendí! Siguiente →',
    reflection: 'Reflexión',
    changedMind: '¿Cambiaste de opinión?',
    rYes: 'Sí',
    rNo: 'No',
    rABit: 'Un poco',
    hardest: '¿Qué fue lo más difícil?',
    h1: 'Encontrar las palabras',
    h2: 'Pensar diferente',
    h3: 'Decidirme',
    finishChallenge: 'Terminar desafío 🎉',
    xpEarned: '¡Ganaste',
    needPickReflection: 'Elegí una opción para terminar',

    // Player / niveles
    level: 'Nivel',
    streak: 'Racha',
    days: 'días',
    day: 'día',

    // Logros
    badgesTitle: 'Tus medallas',
    badgesSub: 'Desbloqueá medallas pensando',
    locked: 'Bloqueada',

    // Teacher
    teacherTitle: 'Portal Docente',
    teacherIntro: 'Una herramienta gratuita para llevar el pensamiento crítico al aula con ayuda de la IA.',
    statChallenges: 'desafíos',
    statLevels: 'niveles',
    statWorlds: 'mundos',
    statCost: 'costo',
    classroomTitle: 'Cómo usarlo en el aula',
    cStep1Title: '1. Individual',
    cStep1: 'Cada estudiante responde un desafío con su propia voz y recibe una devolución de la IA.',
    cStep2Title: '2. Debate',
    cStep2: 'En grupos comparten sus respuestas y debaten: no hay una sola respuesta correcta.',
    cStep3Title: '3. Metacognición',
    cStep3: 'Cierran reflexionando: ¿qué pensaba antes y qué pienso ahora?',
    contact: 'Contacto',
    backToGame: '← Volver al juego',

    // Sonido / instalar
    soundOn: 'Música encendida',
    soundOff: 'Música apagada',
  },
  pt: {
    appName: 'MenteLivre',
    tagline: 'Pensar é um superpoder',
    subtitle: 'Treine sua mente com a ajuda da IA. Grátis para escolas.',

    chooseAvatar: 'Escolha seu personagem',
    yourName: 'Como você se chama?',
    namePlaceholder: 'Seu nome',
    ageLabel: 'Sua idade',
    schoolLabel: 'Sua escola',
    schoolPlaceholder: 'Nome da escola',
    chooseTeam: 'Escolha sua equipe',
    start: 'Começar!',
    next: 'Próximo',
    back: 'Voltar',

    navHome: 'Início',
    navBadges: 'Conquistas',
    navTeacher: 'Professores',

    tabPlay: 'Jogar',
    tabTeam: 'Minha Equipe',
    tabRanking: 'Ranking',
    chooseWorld: 'Escolha um mundo para explorar',
    completed: 'concluídos',
    weeklyMission: 'Missão da semana',
    weeklyMissionText: 'Complete 3 desafios com sua equipe',
    classmates: 'Colegas de equipe',
    schoolCode: 'Código da sua escola',
    copy: 'Copiar',
    copied: 'Copiado!',
    teamXP: 'XP da equipe',
    rankingTitle: 'Escolas da América Latina',
    you: 'Você',

    step: 'Passo',
    question: 'A pergunta',
    writeYourAnswer: 'Escreva o que você pensa...',
    minWordsHint: 'Escreva ao menos 20 palavras para enviar',
    words: 'palavras',
    needHint: '💡 Preciso de uma dica',
    thinking: 'Pensando...',
    sendAnswer: 'Enviar resposta →',
    yourAnswer: 'Sua resposta',
    aiThinking: 'A IA está lendo sua resposta...',
    gotItNext: 'Entendi! Próximo →',
    reflection: 'Reflexão',
    changedMind: 'Você mudou de ideia?',
    rYes: 'Sim',
    rNo: 'Não',
    rABit: 'Um pouco',
    hardest: 'O que foi mais difícil?',
    h1: 'Encontrar as palavras',
    h2: 'Pensar diferente',
    h3: 'Me decidir',
    finishChallenge: 'Terminar desafio 🎉',
    xpEarned: 'Você ganhou',
    needPickReflection: 'Escolha uma opção para terminar',

    level: 'Nível',
    streak: 'Sequência',
    days: 'dias',
    day: 'dia',

    badgesTitle: 'Suas medalhas',
    badgesSub: 'Desbloqueie medalhas pensando',
    locked: 'Bloqueada',

    teacherTitle: 'Portal do Professor',
    teacherIntro: 'Uma ferramenta gratuita para levar o pensamento crítico à sala de aula com a ajuda da IA.',
    statChallenges: 'desafios',
    statLevels: 'níveis',
    statWorlds: 'mundos',
    statCost: 'custo',
    classroomTitle: 'Como usar na sala de aula',
    cStep1Title: '1. Individual',
    cStep1: 'Cada estudante responde um desafio com a própria voz e recebe um retorno da IA.',
    cStep2Title: '2. Debate',
    cStep2: 'Em grupos compartilham suas respostas e debatem: não há uma única resposta certa.',
    cStep3Title: '3. Metacognição',
    cStep3: 'Encerram refletindo: o que eu pensava antes e o que penso agora?',
    contact: 'Contato',
    backToGame: '← Voltar ao jogo',

    soundOn: 'Música ligada',
    soundOff: 'Música desligada',
  },
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem('ml_lang') || 'es' } catch { return 'es' }
  })
  const setLang = useCallback((l) => {
    setLangState(l)
    try { localStorage.setItem('ml_lang', l) } catch { /* noop */ }
  }, [])
  const t = useCallback((key) => {
    return (LANG_DATA[lang] && LANG_DATA[lang][key]) ?? LANG_DATA.es[key] ?? key
  }, [lang])
  return createElement(LangContext.Provider, { value: { t, lang, setLang } }, children)
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang debe usarse dentro de <LangProvider>')
  return ctx
}
