// Paso 6 — 4 mundos × 3 grupos de edad × 5 preguntas, cada una en ES y PT.
export const WORLDS = [
  { id: 'planeta',   emoji: '🌍', name_es: 'Desafíos del Planeta',  name_pt: 'Desafios do Planeta',   color: '#10B981' },
  { id: 'futuro',    emoji: '🚀', name_es: 'Inventar el Futuro',    name_pt: 'Inventar o Futuro',     color: '#FBBF24' },
  { id: 'etica',     emoji: '🧩', name_es: 'Dilemas Éticos',        name_pt: 'Dilemas Éticos',        color: '#F43F5E' },
  { id: 'preguntas', emoji: '💡', name_es: 'Preguntas Imposibles',  name_pt: 'Perguntas Impossíveis', color: '#0EA5E9' },
]

export const AGE_GROUPS = ['6-8', '9-11', '12-15']

export const CHALLENGES = {
  planeta: {
    '6-8': [
      { es: '¿Qué podrías hacer hoy para cuidar el agua de tu casa?', pt: 'O que você poderia fazer hoje para cuidar da água da sua casa?' },
      { es: 'Si los árboles pudieran hablar, ¿qué crees que nos pedirían?', pt: 'Se as árvores pudessem falar, o que você acha que nos pediriam?' },
      { es: '¿Por qué es importante no tirar basura en la calle?', pt: 'Por que é importante não jogar lixo na rua?' },
      { es: 'Imaginá un superhéroe que cuida la naturaleza: ¿qué poder tendría?', pt: 'Imagine um super-herói que cuida da natureza: que poder ele teria?' },
      { es: '¿Qué animal te gustaría proteger y por qué?', pt: 'Que animal você gostaria de proteger e por quê?' },
    ],
    '9-11': [
      { es: 'Si tu escuela pudiera ahorrar energía, ¿qué tres ideas propondrías?', pt: 'Se sua escola pudesse economizar energia, que três ideias você proporia?' },
      { es: '¿Por qué algunas personas no reciclan, y cómo las convencerías?', pt: 'Por que algumas pessoas não reciclam, e como você as convenceria?' },
      { es: 'Si diseñaras un parque para tu barrio, ¿qué incluirías para ayudar al planeta?', pt: 'Se você desenhasse um parque para o seu bairro, o que incluiria para ajudar o planeta?' },
      { es: '¿Qué pasaría con las ciudades si los autos volaran y no usaran combustible?', pt: 'O que aconteceria com as cidades se os carros voassem sem combustível?' },
      { es: '¿Es justo que algunos países contaminen más que otros? ¿Por qué?', pt: 'É justo que alguns países poluam mais que outros? Por quê?' },
    ],
    '12-15': [
      { es: 'Si pudieras crear una ley para proteger el ambiente, ¿cuál sería y a quién afectaría?', pt: 'Se você criasse uma lei para proteger o meio ambiente, qual seria e quem afetaria?' },
      { es: '¿Conviene más plantar un millón de árboles o cambiar cómo producimos energía? Defendé tu postura.', pt: 'Compensa mais plantar um milhão de árvores ou mudar como produzimos energia? Defenda sua posição.' },
      { es: '¿Quién debería pagar por limpiar la contaminación: las empresas, los gobiernos o las personas?', pt: 'Quem deveria pagar para limpar a poluição: as empresas, os governos ou as pessoas?' },
      { es: '¿Tecnología o cambiar nuestros hábitos: qué salvará antes al planeta?', pt: 'Tecnologia ou mudar nossos hábitos: o que salvará o planeta primeiro?' },
      { es: 'Si una solución ecológica deja a mucha gente sin trabajo, ¿hay que aplicarla igual?', pt: 'Se uma solução ecológica deixa muita gente sem emprego, deve-se aplicá-la mesmo assim?' },
    ],
  },
  futuro: {
    '6-8': [
      { es: 'Inventá una máquina que haga tu tarea favorita: ¿qué hace?', pt: 'Invente uma máquina que faça sua tarefa favorita: o que ela faz?' },
      { es: 'Si pudieras tener un robot amigo, ¿para qué te ayudaría?', pt: 'Se você tivesse um robô amigo, no que ele te ajudaria?' },
      { es: '¿Cómo serían las escuelas del futuro?', pt: 'Como seriam as escolas do futuro?' },
      { es: 'Imaginá una comida nueva que nadie probó: ¿de qué es?', pt: 'Imagine uma comida nova que ninguém provou: do que é feita?' },
      { es: 'Si pudieras viajar al futuro un día, ¿qué te gustaría ver?', pt: 'Se você pudesse viajar ao futuro por um dia, o que gostaria de ver?' },
    ],
    '9-11': [
      { es: 'Inventá un transporte que no contamine y sea divertido de usar.', pt: 'Invente um transporte que não polua e seja divertido de usar.' },
      { es: '¿Qué problema de tu ciudad resolverías con un invento?', pt: 'Que problema da sua cidade você resolveria com uma invenção?' },
      { es: 'Si las casas fueran inteligentes, ¿qué te gustaría que hicieran solas?', pt: 'Se as casas fossem inteligentes, o que você gostaria que elas fizessem sozinhas?' },
      { es: 'Diseñá un juego que enseñe algo importante mientras te divertís.', pt: 'Crie um jogo que ensine algo importante enquanto você se diverte.' },
      { es: '¿Cómo ayudaría la tecnología a alguien que vive lejos de la escuela?', pt: 'Como a tecnologia ajudaria alguém que mora longe da escola?' },
    ],
    '12-15': [
      { es: 'Diseñá un invento que mejore la vida en tu comunidad y explicá cómo funcionaría.', pt: 'Crie uma invenção que melhore a vida na sua comunidade e explique como funcionaria.' },
      { es: 'Si la IA pudiera hacer cualquier trabajo, ¿qué deberían hacer las personas?', pt: 'Se a IA pudesse fazer qualquer trabalho, o que as pessoas deveriam fazer?' },
      { es: '¿Qué tecnología de hoy crees que será ridícula dentro de 50 años?', pt: 'Que tecnologia de hoje você acha que será ridícula daqui a 50 anos?' },
      { es: 'Inventá una solución para que nadie pase hambre: ¿qué necesitarías?', pt: 'Invente uma solução para que ninguém passe fome: do que você precisaria?' },
      { es: '¿Es buena idea colonizar otro planeta antes de arreglar el nuestro?', pt: 'É boa ideia colonizar outro planeta antes de consertar o nosso?' },
    ],
  },
  etica: {
    '6-8': [
      { es: 'Tu amigo se llevó un juguete sin permiso. ¿Qué le dirías?', pt: 'Seu amigo pegou um brinquedo sem permissão. O que você diria?' },
      { es: '¿Está bien decir una mentira para no lastimar a alguien?', pt: 'É certo contar uma mentira para não machucar alguém?' },
      { es: 'Encontrás dinero en el piso de la escuela. ¿Qué hacés?', pt: 'Você encontra dinheiro no chão da escola. O que faz?' },
      { es: 'Si todos quieren el mismo juego, ¿cómo lo resuelven sin pelear?', pt: 'Se todos querem o mesmo jogo, como resolvem sem brigar?' },
      { es: '¿Por qué es importante compartir, aunque a veces cueste?', pt: 'Por que é importante compartilhar, mesmo quando é difícil?' },
    ],
    '9-11': [
      { es: 'Viste a alguien hacer trampa en un juego. ¿Decís algo o no? ¿Por qué?', pt: 'Você viu alguém trapacear num jogo. Você fala algo ou não? Por quê?' },
      { es: '¿Es justo que el más fuerte gane siempre? ¿Qué cambiarías?', pt: 'É justo que o mais forte ganhe sempre? O que você mudaria?' },
      { es: 'Un amigo te pide guardar un secreto que podría lastimar a alguien. ¿Qué hacés?', pt: 'Um amigo te pede para guardar um segredo que poderia machucar alguém. O que você faz?' },
      { es: '¿Está bien romper una regla si la regla es injusta?', pt: 'É certo quebrar uma regra se a regra é injusta?' },
      { es: 'Si una máquina decide por vos, ¿quién tiene la culpa si se equivoca?', pt: 'Se uma máquina decide por você, quem tem a culpa se ela errar?' },
    ],
    '12-15': [
      { es: 'Una app gratis usa tus datos para ganar dinero. ¿Es un trato justo?', pt: 'Um app grátis usa seus dados para ganhar dinheiro. É um trato justo?' },
      { es: '¿Debería un robot tener permitido mentir si eso ayuda a alguien?', pt: 'Um robô deveria poder mentir se isso ajudar alguém?' },
      { es: 'Si pudieras salvar a 5 personas sacrificando 1, ¿lo harías? Explicá.', pt: 'Se você pudesse salvar 5 pessoas sacrificando 1, você faria? Explique.' },
      { es: '¿Es ético copiar la idea de alguien si la mejorás mucho?', pt: 'É ético copiar a ideia de alguém se você a melhora muito?' },
      { es: '¿Quién decide qué está bien y qué está mal: la ley, la mayoría o tu conciencia?', pt: 'Quem decide o que é certo e errado: a lei, a maioria ou sua consciência?' },
    ],
  },
  preguntas: {
    '6-8': [
      { es: '¿De qué color sería el silencio?', pt: 'De que cor seria o silêncio?' },
      { es: 'Si los animales fueran a la escuela, ¿qué aprenderían?', pt: 'Se os animais fossem à escola, o que aprenderiam?' },
      { es: '¿Qué hay más allá del cielo?', pt: 'O que existe além do céu?' },
      { es: 'Si pudieras ser invisible un día, ¿qué cosa buena harías?', pt: 'Se você pudesse ser invisível por um dia, que coisa boa faria?' },
      { es: '¿Los sueños son reales mientras dormís?', pt: 'Os sonhos são reais enquanto você dorme?' },
    ],
    '9-11': [
      { es: '¿Puede existir un color que nadie vio nunca?', pt: 'Pode existir uma cor que ninguém nunca viu?' },
      { es: 'Si nadie te ve hacer algo bueno, ¿vale lo mismo?', pt: 'Se ninguém te vê fazer algo bom, vale a mesma coisa?' },
      { es: '¿Qué pesa más: una idea o una montaña?', pt: 'O que pesa mais: uma ideia ou uma montanha?' },
      { es: '¿Por qué hacemos preguntas si no siempre hay respuesta?', pt: 'Por que fazemos perguntas se nem sempre há resposta?' },
      { es: 'Si pudieras hablar con vos del futuro, ¿qué le preguntarías?', pt: 'Se você pudesse falar com o seu eu do futuro, o que perguntaria?' },
    ],
    '12-15': [
      { es: '¿La verdad existe aunque nadie la conozca?', pt: 'A verdade existe mesmo que ninguém a conheça?' },
      { es: 'Si una máquina siente, ¿merece derechos?', pt: 'Se uma máquina sente, ela merece direitos?' },
      { es: '¿Somos libres de verdad o solo creemos serlo?', pt: 'Somos realmente livres ou só achamos que somos?' },
      { es: '¿Tiene sentido el infinito o es solo una palabra?', pt: 'O infinito faz sentido ou é só uma palavra?' },
      { es: '¿Qué te hace ser vos y no otra persona?', pt: 'O que faz você ser você e não outra pessoa?' },
    ],
  },
}

export function getWorld(id) {
  return WORLDS.find((w) => w.id === id)
}

export function getQuestions(worldId, ageGroup) {
  return CHALLENGES[worldId]?.[ageGroup] || CHALLENGES[worldId]?.['9-11'] || []
}

export function pickQuestion(worldId, ageGroup, seed = Math.random()) {
  const qs = getQuestions(worldId, ageGroup)
  if (!qs.length) return { es: '', pt: '' }
  return qs[Math.floor(seed * qs.length) % qs.length]
}
