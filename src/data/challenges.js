// Paso 6 — 4 mundos × 3 grupos de edad × 10 preguntas, cada una en ES y PT.
// Cada ronda saca 5 al azar (ver pickRoundQuestions), así no se repiten.
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
      { es: 'Imagina un superhéroe que cuida la naturaleza: ¿qué poder tendría?', pt: 'Imagine um super-herói que cuida da natureza: que poder ele teria?' },
      { es: '¿Qué animal te gustaría proteger y por qué?', pt: 'Que animal você gostaria de proteger e por quê?' },
      { es: '¿Qué le dirías a alguien que deja la canilla abierta?', pt: 'O que você diria a alguém que deixa a torneira aberta?' },
      { es: 'Si fueras un árbol, ¿qué te gustaría que la gente hiciera por ti?', pt: 'Se você fosse uma árvore, o que gostaria que as pessoas fizessem por você?' },
      { es: '¿Cómo cuidarías a una plantita para que crezca fuerte?', pt: 'Como você cuidaria de uma plantinha para que ela cresça forte?' },
      { es: 'Imagina un mundo sin basura: ¿cómo se vería?', pt: 'Imagine um mundo sem lixo: como ele seria?' },
      { es: '¿Por qué crees que las abejas son importantes?', pt: 'Por que você acha que as abelhas são importantes?' },
    ],
    '9-11': [
      { es: 'Si tu escuela pudiera ahorrar energía, ¿qué tres ideas propondrías?', pt: 'Se sua escola pudesse economizar energia, que três ideias você proporia?' },
      { es: '¿Por qué algunas personas no reciclan, y cómo las convencerías?', pt: 'Por que algumas pessoas não reciclam, e como você as convenceria?' },
      { es: 'Si diseñaras un parque para tu barrio, ¿qué incluirías para ayudar al planeta?', pt: 'Se você desenhasse um parque para o seu bairro, o que incluiria para ajudar o planeta?' },
      { es: '¿Qué pasaría con las ciudades si los autos volaran y no usaran combustible?', pt: 'O que aconteceria com as cidades se os carros voassem sem combustível?' },
      { es: '¿Es justo que algunos países contaminen más que otros? ¿Por qué?', pt: 'É justo que alguns países poluam mais que outros? Por quê?' },
      { es: 'Si tuvieras que enseñarle a un niño más pequeño a cuidar el planeta, ¿qué le dirías?', pt: 'Se você tivesse que ensinar uma criança menor a cuidar do planeta, o que diria?' },
      { es: '¿Qué inventarías para limpiar los océanos?', pt: 'O que você inventaria para limpar os oceanos?' },
      { es: 'Si el agua se volviera escasa, ¿cómo cambiaría tu vida?', pt: 'Se a água ficasse escassa, como mudaria a sua vida?' },
      { es: '¿Es mejor plantar muchos árboles o cuidar los que ya existen? ¿Por qué?', pt: 'É melhor plantar muitas árvores ou cuidar das que já existem? Por quê?' },
      { es: '¿Qué podría hacer tu ciudad para tener un aire más limpio?', pt: 'O que sua cidade poderia fazer para ter um ar mais limpo?' },
    ],
    '12-15': [
      { es: 'Si pudieras crear una ley para proteger el ambiente, ¿cuál sería y a quién afectaría?', pt: 'Se você criasse uma lei para proteger o meio ambiente, qual seria e quem afetaria?' },
      { es: '¿Conviene más plantar un millón de árboles o cambiar cómo producimos energía? Defiende tu postura.', pt: 'Compensa mais plantar um milhão de árvores ou mudar como produzimos energia? Defenda sua posição.' },
      { es: '¿Quién debería pagar por limpiar la contaminación: las empresas, los gobiernos o las personas?', pt: 'Quem deveria pagar para limpar a poluição: as empresas, os governos ou as pessoas?' },
      { es: '¿Tecnología o cambiar nuestros hábitos: qué salvará antes al planeta?', pt: 'Tecnologia ou mudar nossos hábitos: o que salvará o planeta primeiro?' },
      { es: 'Si una solución ecológica deja a mucha gente sin trabajo, ¿hay que aplicarla igual?', pt: 'Se uma solução ecológica deixa muita gente sem emprego, deve-se aplicá-la mesmo assim?' },
      { es: '¿Hasta qué punto una persona puede vivir sin generar impacto en el planeta?', pt: 'Até que ponto uma pessoa pode viver sem gerar impacto no planeta?' },
      { es: 'Si fueras presidente por un día, ¿qué medida ambiental tomarías primero?', pt: 'Se você fosse presidente por um dia, que medida ambiental tomaria primeiro?' },
      { es: '¿Es justo pedirles a los países pobres que contaminen menos cuando los ricos contaminaron por años?', pt: 'É justo pedir aos países pobres que poluam menos quando os ricos poluíram por anos?' },
      { es: '¿La tecnología nos salvará del cambio climático o nos volvió más dependientes?', pt: 'A tecnologia vai nos salvar da mudança climática ou nos tornou mais dependentes?' },
      { es: '¿Vale la pena un pequeño sacrificio diario de cada persona para salvar el planeta?', pt: 'Vale a pena um pequeno sacrifício diário de cada pessoa para salvar o planeta?' },
    ],
  },
  futuro: {
    '6-8': [
      { es: 'Inventa una máquina que haga tu tarea favorita: ¿qué hace?', pt: 'Invente uma máquina que faça sua tarefa favorita: o que ela faz?' },
      { es: 'Si pudieras tener un robot amigo, ¿para qué te ayudaría?', pt: 'Se você tivesse um robô amigo, no que ele te ajudaria?' },
      { es: '¿Cómo serían las escuelas del futuro?', pt: 'Como seriam as escolas do futuro?' },
      { es: 'Imagina una comida nueva que nadie probó: ¿de qué es?', pt: 'Imagine uma comida nova que ninguém provou: do que é feita?' },
      { es: 'Si pudieras viajar al futuro un día, ¿qué te gustaría ver?', pt: 'Se você pudesse viajar ao futuro por um dia, o que gostaria de ver?' },
      { es: 'Si pudieras inventar un juguete que no existe, ¿cómo sería?', pt: 'Se você pudesse inventar um brinquedo que não existe, como ele seria?' },
      { es: '¿Cómo sería tu casa ideal del futuro?', pt: 'Como seria a sua casa ideal do futuro?' },
      { es: 'Si los autos pudieran volar, ¿adónde irías primero?', pt: 'Se os carros pudessem voar, aonde você iria primeiro?' },
      { es: '¿Qué te gustaría que hiciera un robot por tu familia?', pt: 'O que você gostaria que um robô fizesse pela sua família?' },
      { es: 'Imagina una mascota del futuro: ¿qué poderes tendría?', pt: 'Imagine um bichinho do futuro: que poderes ele teria?' },
    ],
    '9-11': [
      { es: 'Inventa un transporte que no contamine y sea divertido de usar.', pt: 'Invente um transporte que não polua e seja divertido de usar.' },
      { es: '¿Qué problema de tu ciudad resolverías con un invento?', pt: 'Que problema da sua cidade você resolveria com uma invenção?' },
      { es: 'Si las casas fueran inteligentes, ¿qué te gustaría que hicieran solas?', pt: 'Se as casas fossem inteligentes, o que você gostaria que elas fizessem sozinhas?' },
      { es: 'Diseña un juego que enseñe algo importante mientras te diviertes.', pt: 'Crie um jogo que ensine algo importante enquanto você se diverte.' },
      { es: '¿Cómo ayudaría la tecnología a alguien que vive lejos de la escuela?', pt: 'Como a tecnologia ajudaria alguém que mora longe da escola?' },
      { es: 'Si pudieras crear una app para ayudar a tu comunidad, ¿qué haría?', pt: 'Se você pudesse criar um app para ajudar sua comunidade, o que ele faria?' },
      { es: '¿Cómo crees que estudiaremos dentro de 30 años?', pt: 'Como você acha que vamos estudar daqui a 30 anos?' },
      { es: 'Inventa una solución para que nadie se sienta solo.', pt: 'Invente uma solução para que ninguém se sinta sozinho.' },
      { es: 'Si un aparato te tradujera todos los idiomas, ¿qué harías con eso?', pt: 'Se um aparelho traduzisse todos os idiomas para você, o que faria com isso?' },
      { es: '¿Qué trabajo del futuro te gustaría inventar?', pt: 'Que trabalho do futuro você gostaria de inventar?' },
    ],
    '12-15': [
      { es: 'Diseña un invento que mejore la vida en tu comunidad y explica cómo funcionaría.', pt: 'Crie uma invenção que melhore a vida na sua comunidade e explique como funcionaria.' },
      { es: 'Si la IA pudiera hacer cualquier trabajo, ¿qué deberían hacer las personas?', pt: 'Se a IA pudesse fazer qualquer trabalho, o que as pessoas deveriam fazer?' },
      { es: '¿Qué tecnología de hoy crees que será ridícula dentro de 50 años?', pt: 'Que tecnologia de hoje você acha que será ridícula daqui a 50 anos?' },
      { es: 'Inventa una solución para que nadie pase hambre: ¿qué necesitarías?', pt: 'Invente uma solução para que ninguém passe fome: do que você precisaria?' },
      { es: '¿Es buena idea colonizar otro planeta antes de arreglar el nuestro?', pt: 'É boa ideia colonizar outro planeta antes de consertar o nosso?' },
      { es: 'Si la inteligencia artificial pudiera crear arte, ¿seguiría siendo arte?', pt: 'Se a inteligência artificial pudesse criar arte, ainda seria arte?' },
      { es: '¿Qué problema del mundo resolverías primero con tecnología y por qué?', pt: 'Que problema do mundo você resolveria primeiro com tecnologia e por quê?' },
      { es: 'Si pudieras vivir 200 años, ¿lo harías? ¿Qué cambiaría?', pt: 'Se você pudesse viver 200 anos, faria isso? O que mudaria?' },
      { es: '¿La tecnología nos acerca o nos aleja de las personas?', pt: 'A tecnologia nos aproxima ou nos afasta das pessoas?' },
      { es: '¿Deberíamos ponerle límites a lo que la IA puede hacer? ¿Cuáles?', pt: 'Devemos colocar limites no que a IA pode fazer? Quais?' },
    ],
  },
  etica: {
    '6-8': [
      { es: 'Tu amigo se llevó un juguete sin permiso. ¿Qué le dirías?', pt: 'Seu amigo pegou um brinquedo sem permissão. O que você diria?' },
      { es: '¿Está bien decir una mentira para no lastimar a alguien?', pt: 'É certo contar uma mentira para não machucar alguém?' },
      { es: 'Encuentras dinero en el piso de la escuela. ¿Qué haces?', pt: 'Você encontra dinheiro no chão da escola. O que faz?' },
      { es: 'Si todos quieren el mismo juego, ¿cómo lo resuelven sin pelear?', pt: 'Se todos querem o mesmo jogo, como resolvem sem brigar?' },
      { es: '¿Por qué es importante compartir, aunque a veces cueste?', pt: 'Por que é importante compartilhar, mesmo quando é difícil?' },
      { es: 'Un amigo está triste. ¿Qué harías para ayudarlo?', pt: 'Um amigo está triste. O que você faria para ajudá-lo?' },
      { es: '¿Está bien acusar a alguien que se portó mal? ¿Por qué?', pt: 'É certo dedurar alguém que se comportou mal? Por quê?' },
      { es: 'Si rompes algo sin querer, ¿qué haces?', pt: 'Se você quebra algo sem querer, o que faz?' },
      { es: '¿Por qué es importante cumplir lo que prometemos?', pt: 'Por que é importante cumprir o que prometemos?' },
      { es: 'Si ves a alguien solo en el recreo, ¿qué harías?', pt: 'Se você vê alguém sozinho no recreio, o que faria?' },
    ],
    '9-11': [
      { es: 'Viste a alguien hacer trampa en un juego. ¿Dices algo o no? ¿Por qué?', pt: 'Você viu alguém trapacear num jogo. Você fala algo ou não? Por quê?' },
      { es: '¿Es justo que el más fuerte gane siempre? ¿Qué cambiarías?', pt: 'É justo que o mais forte ganhe sempre? O que você mudaria?' },
      { es: 'Un amigo te pide guardar un secreto que podría lastimar a alguien. ¿Qué haces?', pt: 'Um amigo te pede para guardar um segredo que poderia machucar alguém. O que você faz?' },
      { es: '¿Está bien romper una regla si la regla es injusta?', pt: 'É certo quebrar uma regra se a regra é injusta?' },
      { es: 'Si una máquina decide por ti, ¿quién tiene la culpa si se equivoca?', pt: 'Se uma máquina decide por você, quem tem a culpa se ela errar?' },
      { es: '¿Es justo que todos tengan las mismas reglas aunque sean diferentes?', pt: 'É justo que todos tenham as mesmas regras mesmo sendo diferentes?' },
      { es: 'Si encuentras el celular de alguien, ¿qué haces?', pt: 'Se você encontra o celular de alguém, o que faz?' },
      { es: '¿Está bien copiarse en una prueba si todos lo hacen?', pt: 'É certo colar numa prova se todo mundo faz isso?' },
      { es: '¿Qué es más importante: ganar o jugar limpio?', pt: 'O que é mais importante: ganhar ou jogar limpo?' },
      { es: 'Si una regla te parece injusta, ¿cómo la cambiarías?', pt: 'Se uma regra te parece injusta, como você a mudaria?' },
    ],
    '12-15': [
      { es: 'Una app gratis usa tus datos para ganar dinero. ¿Es un trato justo?', pt: 'Um app grátis usa seus dados para ganhar dinheiro. É um trato justo?' },
      { es: '¿Debería un robot tener permitido mentir si eso ayuda a alguien?', pt: 'Um robô deveria poder mentir se isso ajudar alguém?' },
      { es: 'Si pudieras salvar a 5 personas sacrificando 1, ¿lo harías? Explica.', pt: 'Se você pudesse salvar 5 pessoas sacrificando 1, você faria? Explique.' },
      { es: '¿Es ético copiar la idea de alguien si la mejoras mucho?', pt: 'É ético copiar a ideia de alguém se você a melhora muito?' },
      { es: '¿Quién decide qué está bien y qué está mal: la ley, la mayoría o tu conciencia?', pt: 'Quem decide o que é certo e errado: a lei, a maioria ou sua consciência?' },
      { es: '¿Es ético mentir para proteger a alguien que quieres?', pt: 'É ético mentir para proteger alguém que você ama?' },
      { es: '¿Deberían las redes sociales ser responsables de lo que publica la gente?', pt: 'As redes sociais deveriam ser responsáveis pelo que as pessoas publicam?' },
      { es: 'Si pudieras leer la mente de los demás, ¿sería correcto usar ese poder?', pt: 'Se você pudesse ler a mente dos outros, seria correto usar esse poder?' },
      { es: '¿Es justo juzgar a alguien por un error que cometió hace años?', pt: 'É justo julgar alguém por um erro que cometeu anos atrás?' },
      { es: '¿Quién debería decidir qué información es verdadera en internet?', pt: 'Quem deveria decidir qual informação é verdadeira na internet?' },
    ],
  },
  preguntas: {
    '6-8': [
      { es: '¿De qué color sería el silencio?', pt: 'De que cor seria o silêncio?' },
      { es: 'Si los animales fueran a la escuela, ¿qué aprenderían?', pt: 'Se os animais fossem à escola, o que aprenderiam?' },
      { es: '¿Qué hay más allá del cielo?', pt: 'O que existe além do céu?' },
      { es: 'Si pudieras ser invisible un día, ¿qué cosa buena harías?', pt: 'Se você pudesse ser invisível por um dia, que coisa boa faria?' },
      { es: '¿Los sueños son reales mientras duermes?', pt: 'Os sonhos são reais enquanto você dorme?' },
      { es: '¿Qué forma tendría una idea si pudieras tocarla?', pt: 'Que forma teria uma ideia se você pudesse tocá-la?' },
      { es: 'Si las nubes fueran de algodón, ¿a qué sabrían?', pt: 'Se as nuvens fossem de algodão, com que gosto seriam?' },
      { es: '¿Por qué tenemos que dormir?', pt: 'Por que precisamos dormir?' },
      { es: '¿De dónde vienen las palabras?', pt: 'De onde vêm as palavras?' },
      { es: 'Si pudieras pintar el cielo de otro color, ¿cuál elegirías y por qué?', pt: 'Se você pudesse pintar o céu de outra cor, qual escolheria e por quê?' },
    ],
    '9-11': [
      { es: '¿Puede existir un color que nadie vio nunca?', pt: 'Pode existir uma cor que ninguém nunca viu?' },
      { es: 'Si nadie te ve hacer algo bueno, ¿vale lo mismo?', pt: 'Se ninguém te vê fazer algo bom, vale a mesma coisa?' },
      { es: '¿Qué pesa más: una idea o una montaña?', pt: 'O que pesa mais: uma ideia ou uma montanha?' },
      { es: '¿Por qué hacemos preguntas si no siempre hay respuesta?', pt: 'Por que fazemos perguntas se nem sempre há resposta?' },
      { es: 'Si pudieras hablar con tu yo del futuro, ¿qué le preguntarías?', pt: 'Se você pudesse falar com o seu eu do futuro, o que perguntaria?' },
      { es: '¿El tiempo existiría si no hubiera relojes?', pt: 'O tempo existiria se não houvesse relógios?' },
      { es: '¿Se puede pensar sin usar palabras?', pt: 'Dá para pensar sem usar palavras?' },
      { es: '¿Qué es más real: lo que vemos o lo que imaginamos?', pt: 'O que é mais real: o que vemos ou o que imaginamos?' },
      { es: 'Si nadie recordara algo, ¿de verdad pasó?', pt: 'Se ninguém lembrasse de algo, isso de fato aconteceu?' },
      { es: '¿Por qué dos personas pueden ver lo mismo y pensar distinto?', pt: 'Por que duas pessoas podem ver a mesma coisa e pensar diferente?' },
    ],
    '12-15': [
      { es: '¿La verdad existe aunque nadie la conozca?', pt: 'A verdade existe mesmo que ninguém a conheça?' },
      { es: 'Si una máquina siente, ¿merece derechos?', pt: 'Se uma máquina sente, ela merece direitos?' },
      { es: '¿Somos libres de verdad o solo creemos serlo?', pt: 'Somos realmente livres ou só achamos que somos?' },
      { es: '¿Tiene sentido el infinito o es solo una palabra?', pt: 'O infinito faz sentido ou é só uma palavra?' },
      { es: '¿Qué te hace ser tú y no otra persona?', pt: 'O que faz você ser você e não outra pessoa?' },
      { es: '¿Existe el azar o todo tiene una causa?', pt: 'Existe o acaso ou tudo tem uma causa?' },
      { es: '¿Podemos estar seguros de que el mundo es real y no un sueño?', pt: 'Podemos ter certeza de que o mundo é real e não um sonho?' },
      { es: '¿La felicidad se busca o se encuentra?', pt: 'A felicidade se busca ou se encontra?' },
      { es: 'Si pudieras saber tu futuro, ¿querrías saberlo?', pt: 'Se você pudesse saber seu futuro, gostaria de saber?' },
      { es: '¿Qué hace que una vida valga la pena?', pt: 'O que faz uma vida valer a pena?' },
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

// Saca n preguntas AL AZAR del banco (sin repetir dentro de la ronda).
export function pickRoundQuestions(worldId, ageGroup, n = 5) {
  const qs = [...getQuestions(worldId, ageGroup)]
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[qs[i], qs[j]] = [qs[j], qs[i]]
  }
  return qs.slice(0, Math.min(n, qs.length))
}
