// Paso 6 — 8 medallas. check(state) recibe un adaptador con helpers del jugador.
export const BADGES = [
  {
    id: 'first', emoji: '🌟',
    name_es: 'Primer paso', name_pt: 'Primeiro passo',
    desc_es: 'Completaste tu primer desafío', desc_pt: 'Você completou seu primeiro desafio',
    check: (s) => s.totalCompleted >= 1,
  },
  {
    id: 'streak5', emoji: '🔥',
    name_es: 'Racha de 5', name_pt: 'Sequência de 5',
    desc_es: '5 días seguidos pensando', desc_pt: '5 dias seguidos pensando',
    check: (s) => s.streak >= 5,
  },
  {
    id: 'rounds5', emoji: '🎯',
    name_es: 'Maratonista', name_pt: 'Maratonista',
    desc_es: 'Completaste 5 rondas', desc_pt: 'Você completou 5 rodadas',
    check: (s) => s.totalCompleted >= 5,
  },
  {
    id: 'planeta5', emoji: '🌍',
    name_es: 'Guardián del Planeta', name_pt: 'Guardião do Planeta',
    desc_es: '5 desafíos del Planeta', desc_pt: '5 desafios do Planeta',
    check: (s) => s.worldCompleted('planeta') >= 5,
  },
  {
    id: 'ai10', emoji: '🤖',
    name_es: 'Amigo de la IA', name_pt: 'Amigo da IA',
    desc_es: '10 charlas con la IA', desc_pt: '10 conversas com a IA',
    check: (s) => s.aiInteractions >= 10,
  },
  {
    id: 'critic', emoji: '🔮',
    name_es: 'Pensador Crítico', name_pt: 'Pensador Crítico',
    desc_es: 'Llegaste al nivel Crítico', desc_pt: 'Você chegou ao nível Crítico',
    check: (s) => s.level >= 3,
  },
  {
    id: 'inventor10', emoji: '🚀',
    name_es: 'Gran Inventor', name_pt: 'Grande Inventor',
    desc_es: '10 desafíos del Futuro', desc_pt: '10 desafios do Futuro',
    check: (s) => s.worldCompleted('futuro') >= 10,
  },
  {
    id: 'q10', emoji: '💡',
    name_es: 'Mente Curiosa', name_pt: 'Mente Curiosa',
    desc_es: '10 Preguntas Imposibles', desc_pt: '10 Perguntas Impossíveis',
    check: (s) => s.worldCompleted('preguntas') >= 10,
  },
  {
    id: 'preguntar3', emoji: '🦉',
    name_es: 'Gran Preguntador', name_pt: 'Grande Perguntador',
    desc_es: 'Dominaste el arte de preguntar (nivel Filósofo)', desc_pt: 'Você dominou a arte de perguntar (nível Filósofo)',
    check: (s) => s.worldCompleted('preguntar') >= 1,
  },
  {
    id: 'allworlds', emoji: '🏆',
    name_es: 'Explorador Total', name_pt: 'Explorador Total',
    desc_es: 'Jugaste los 4 mundos', desc_pt: 'Você jogou os 4 mundos',
    check: (s) => s.allWorldsAtLeastOne(),
  },
]
