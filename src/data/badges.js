// Paso 6 — 8 medallas. check(state) recibe un adaptador con helpers del jugador.
export const BADGES = [
  {
    id: 'first', emoji: '🌟',
    name_es: 'Primer paso', name_pt: 'Primeiro passo', name_en: 'First step',
    desc_es: 'Completaste tu primer desafío', desc_pt: 'Você completou seu primeiro desafio', desc_en: 'You completed your first challenge',
    check: (s) => s.totalCompleted >= 1,
  },
  {
    id: 'streak5', emoji: '🔥',
    name_es: 'Racha de 5', name_pt: 'Sequência de 5', name_en: '5-day streak',
    desc_es: '5 días seguidos pensando', desc_pt: '5 dias seguidos pensando', desc_en: '5 days of thinking in a row',
    check: (s) => s.streak >= 5,
  },
  {
    id: 'rounds5', emoji: '🎯',
    name_es: 'Maratonista', name_pt: 'Maratonista', name_en: 'Marathoner',
    desc_es: 'Completaste 5 rondas', desc_pt: 'Você completou 5 rodadas', desc_en: 'You completed 5 rounds',
    check: (s) => s.totalCompleted >= 5,
  },
  {
    id: 'planeta5', emoji: '🌍',
    name_es: 'Guardián del Planeta', name_pt: 'Guardião do Planeta', name_en: 'Guardian of the Planet',
    desc_es: '5 desafíos del Planeta', desc_pt: '5 desafios do Planeta', desc_en: '5 Planet challenges',
    check: (s) => s.worldCompleted('planeta') >= 5,
  },
  {
    id: 'ai10', emoji: '🤖',
    name_es: 'Amigo de la IA', name_pt: 'Amigo da IA', name_en: 'Friend of the AI',
    desc_es: '10 charlas con la IA', desc_pt: '10 conversas com a IA', desc_en: '10 chats with the AI',
    check: (s) => s.aiInteractions >= 10,
  },
  {
    id: 'critic', emoji: '🔮',
    name_es: 'Pensador Crítico', name_pt: 'Pensador Crítico', name_en: 'Critical Thinker',
    desc_es: 'Llegaste al nivel Crítico', desc_pt: 'Você chegou ao nível Crítico', desc_en: 'You reached the Critical level',
    check: (s) => s.level >= 3,
  },
  {
    id: 'inventor10', emoji: '🚀',
    name_es: 'Gran Inventor', name_pt: 'Grande Inventor', name_en: 'Great Inventor',
    desc_es: '10 desafíos del Futuro', desc_pt: '10 desafios do Futuro', desc_en: '10 Future challenges',
    check: (s) => s.worldCompleted('futuro') >= 10,
  },
  {
    id: 'q10', emoji: '💡',
    name_es: 'Mente Curiosa', name_pt: 'Mente Curiosa', name_en: 'Curious Mind',
    desc_es: '10 Preguntas Imposibles', desc_pt: '10 Perguntas Impossíveis', desc_en: '10 Impossible Questions',
    check: (s) => s.worldCompleted('preguntas') >= 10,
  },
  {
    id: 'preguntar3', emoji: '🦉',
    name_es: 'Gran Preguntador', name_pt: 'Grande Perguntador', name_en: 'Great Questioner',
    desc_es: 'Dominaste el arte de preguntar (nivel Filósofo)', desc_pt: 'Você dominou a arte de perguntar (nível Filósofo)', desc_en: 'You mastered the art of asking questions (Philosopher level)',
    check: (s) => s.worldCompleted('preguntar') >= 1,
  },
  {
    id: 'allworlds', emoji: '🏆',
    name_es: 'Explorador Total', name_pt: 'Explorador Total', name_en: 'Total Explorer',
    desc_es: 'Jugaste los 4 mundos', desc_pt: 'Você jogou os 4 mundos', desc_en: 'You played all 4 worlds',
    check: (s) => s.allWorldsAtLeastOne(),
  },
]
