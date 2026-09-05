// Paso 6 — 4 mundos × 3 grupos de edad, cada pregunta en ES y PT.
// El banco base (10 c/u) se amplía con challengesExtra.js (20) + challengesExtra2.js (25)
// → 55 por bucket. Cada ronda saca 5 evitando las ya vistas, así no se repiten.
import { EXTRA_CHALLENGES } from './challengesExtra'
import { EXTRA_CHALLENGES_2 } from './challengesExtra2'
import { EXTRA_CHALLENGES_3 } from './challengesExtra3'
import { EXTRA_CHALLENGES_4 } from './challengesExtra4'

export const WORLDS = [
  { id: 'planeta',   emoji: '🌍', name_es: 'Desafíos del Planeta',  name_pt: 'Desafios do Planeta',   name_en: 'Planet Challenges',   color: '#10B981' },
  { id: 'futuro',    emoji: '🚀', name_es: 'Inventar el Futuro',    name_pt: 'Inventar o Futuro',     name_en: 'Invent the Future',   color: '#FBBF24' },
  { id: 'etica',     emoji: '🧩', name_es: 'Dilemas Éticos',        name_pt: 'Dilemas Éticos',        name_en: 'Ethical Dilemmas',    color: '#F43F5E' },
  { id: 'preguntas', emoji: '💡', name_es: 'Preguntas Imposibles',  name_pt: 'Perguntas Impossíveis', name_en: 'Impossible Questions', color: '#0EA5E9' },
  { id: 'convivencia', emoji: '🤝', name_es: 'El Arte de Convivir',  name_pt: 'A Arte de Conviver',    name_en: 'The Art of Living Together', color: '#A855F7' },
]

// MenteLibre es para chicos de 12 a 17 años. El bucket interno '12-15'
// se conserva (las preguntas ya están calibradas para esa madurez) y se
// muestra al usuario como "12 a 17".
export const AGE_GROUPS = ['12-15']
export const AGE_LABELS = { '12-15': '12–17' }

export const CHALLENGES = {
  planeta: {
    '6-8': [
      { es: '¿Qué podrías hacer hoy para cuidar el agua de tu casa?', pt: 'O que você poderia fazer hoje para cuidar da água da sua casa?', en: 'What could you do today to save water at home?' },
      { es: 'Si los árboles pudieran hablar, ¿qué crees que nos pedirían?', pt: 'Se as árvores pudessem falar, o que você acha que nos pediriam?', en: 'If trees could talk, what do you think they would ask us for?' },
      { es: '¿Por qué es importante no tirar basura en la calle?', pt: 'Por que é importante não jogar lixo na rua?', en: 'Why is it important not to throw trash on the street?' },
      { es: 'Imagina un superhéroe que cuida la naturaleza: ¿qué poder tendría?', pt: 'Imagine um super-herói que cuida da natureza: que poder ele teria?', en: 'Imagine a superhero who protects nature: what power would they have?' },
      { es: '¿Qué animal te gustaría proteger y por qué?', pt: 'Que animal você gostaria de proteger e por quê?', en: 'Which animal would you like to protect, and why?' },
      { es: '¿Qué le dirías a alguien que deja la canilla abierta?', pt: 'O que você diria a alguém que deixa a torneira aberta?', en: 'What would you say to someone who leaves the tap running?' },
      { es: 'Si fueras un árbol, ¿qué te gustaría que la gente hiciera por ti?', pt: 'Se você fosse uma árvore, o que gostaria que as pessoas fizessem por você?', en: 'If you were a tree, what would you want people to do for you?' },
      { es: '¿Cómo cuidarías a una plantita para que crezca fuerte?', pt: 'Como você cuidaria de uma plantinha para que ela cresça forte?', en: 'How would you take care of a little plant so it grows strong?' },
      { es: 'Imagina un mundo sin basura: ¿cómo se vería?', pt: 'Imagine um mundo sem lixo: como ele seria?', en: 'Imagine a world with no trash: what would it look like?' },
      { es: '¿Por qué crees que las abejas son importantes?', pt: 'Por que você acha que as abelhas são importantes?', en: 'Why do you think bees are important?' },
    ],
    '9-11': [
      { es: 'Si tu escuela pudiera ahorrar energía, ¿qué tres ideas propondrías?', pt: 'Se sua escola pudesse economizar energia, que três ideias você proporia?', en: 'If your school could save energy, what three ideas would you suggest?' },
      { es: '¿Por qué algunas personas no reciclan, y cómo las convencerías?', pt: 'Por que algumas pessoas não reciclam, e como você as convenceria?', en: 'Why do some people not recycle, and how would you convince them to?' },
      { es: 'Si diseñaras un parque para tu barrio, ¿qué incluirías para ayudar al planeta?', pt: 'Se você desenhasse um parque para o seu bairro, o que incluiria para ajudar o planeta?', en: 'If you designed a park for your neighborhood, what would you add to help the planet?' },
      { es: '¿Qué pasaría con las ciudades si los autos volaran y no usaran combustible?', pt: 'O que aconteceria com as cidades se os carros voassem sem combustível?', en: 'What would happen to cities if cars could fly and used no fuel?' },
      { es: '¿Es justo que algunos países contaminen más que otros? ¿Por qué?', pt: 'É justo que alguns países poluam mais que outros? Por quê?', en: 'Is it fair that some countries pollute more than others? Why?' },
      { es: 'Si tuvieras que enseñarle a un niño más pequeño a cuidar el planeta, ¿qué le dirías?', pt: 'Se você tivesse que ensinar uma criança menor a cuidar do planeta, o que diria?', en: 'If you had to teach a younger kid to care for the planet, what would you tell them?' },
      { es: '¿Qué inventarías para limpiar los océanos?', pt: 'O que você inventaria para limpar os oceanos?', en: 'What would you invent to clean up the oceans?' },
      { es: 'Si el agua se volviera escasa, ¿cómo cambiaría tu vida?', pt: 'Se a água ficasse escassa, como mudaria a sua vida?', en: 'If water became scarce, how would your life change?' },
      { es: '¿Es mejor plantar muchos árboles o cuidar los que ya existen? ¿Por qué?', pt: 'É melhor plantar muitas árvores ou cuidar das que já existem? Por quê?', en: 'Is it better to plant lots of trees or take care of the ones we already have? Why?' },
      { es: '¿Qué podría hacer tu ciudad para tener un aire más limpio?', pt: 'O que sua cidade poderia fazer para ter um ar mais limpo?', en: 'What could your city do to have cleaner air?' },
    ],
    '12-15': [
      { es: 'Si pudieras crear una ley para proteger el ambiente, ¿cuál sería y a quién afectaría?', pt: 'Se você criasse uma lei para proteger o meio ambiente, qual seria e quem afetaria?', en: 'If you could create a law to protect the environment, what would it be and who would it affect?' },
      { es: '¿Conviene más plantar un millón de árboles o cambiar cómo producimos energía? Defiende tu postura.', pt: 'Compensa mais plantar um milhão de árvores ou mudar como produzimos energia? Defenda sua posição.', en: 'Is it better to plant a million trees or change how we produce energy? Defend your position.' },
      { es: '¿Quién debería pagar por limpiar la contaminación: las empresas, los gobiernos o las personas?', pt: 'Quem deveria pagar para limpar a poluição: as empresas, os governos ou as pessoas?', en: 'Who should pay to clean up pollution: companies, governments, or ordinary people?' },
      { es: '¿Tecnología o cambiar nuestros hábitos: qué salvará antes al planeta?', pt: 'Tecnologia ou mudar nossos hábitos: o que salvará o planeta primeiro?', en: 'Technology or changing our habits: which will save the planet sooner?' },
      { es: 'Si una solución ecológica deja a mucha gente sin trabajo, ¿hay que aplicarla igual?', pt: 'Se uma solução ecológica deixa muita gente sem emprego, deve-se aplicá-la mesmo assim?', en: 'If a green solution leaves many people without jobs, should we still use it?' },
      { es: '¿Hasta qué punto una persona puede vivir sin generar impacto en el planeta?', pt: 'Até que ponto uma pessoa pode viver sem gerar impacto no planeta?', en: 'How far can a person really live without making any impact on the planet?' },
      { es: 'Si fueras presidente por un día, ¿qué medida ambiental tomarías primero?', pt: 'Se você fosse presidente por um dia, que medida ambiental tomaria primeiro?', en: 'If you were president for a day, what environmental action would you take first?' },
      { es: '¿Es justo pedirles a los países pobres que contaminen menos cuando los ricos contaminaron por años?', pt: 'É justo pedir aos países pobres que poluam menos quando os ricos poluíram por anos?', en: 'Is it fair to ask poor countries to pollute less when rich ones polluted for years?' },
      { es: '¿La tecnología nos salvará del cambio climático o nos volvió más dependientes?', pt: 'A tecnologia vai nos salvar da mudança climática ou nos tornou mais dependentes?', en: 'Will technology save us from climate change, or has it just made us more dependent?' },
      { es: '¿Vale la pena un pequeño sacrificio diario de cada persona para salvar el planeta?', pt: 'Vale a pena um pequeno sacrifício diário de cada pessoa para salvar o planeta?', en: 'Is a small daily sacrifice from each person worth it to save the planet?' },
    ],
  },
  futuro: {
    '6-8': [
      { es: 'Inventa una máquina que haga tu tarea favorita: ¿qué hace?', pt: 'Invente uma máquina que faça sua tarefa favorita: o que ela faz?', en: 'Invent a machine that does your favorite chore: what does it do?' },
      { es: 'Si pudieras tener un robot amigo, ¿para qué te ayudaría?', pt: 'Se você tivesse um robô amigo, no que ele te ajudaria?', en: 'If you had a robot friend, what would it help you with?' },
      { es: '¿Cómo serían las escuelas del futuro?', pt: 'Como seriam as escolas do futuro?', en: 'What would schools of the future be like?' },
      { es: 'Imagina una comida nueva que nadie probó: ¿de qué es?', pt: 'Imagine uma comida nova que ninguém provou: do que é feita?', en: 'Imagine a new food no one has ever tasted: what is it made of?' },
      { es: 'Si pudieras viajar al futuro un día, ¿qué te gustaría ver?', pt: 'Se você pudesse viajar ao futuro por um dia, o que gostaria de ver?', en: 'If you could travel to the future for one day, what would you want to see?' },
      { es: 'Si pudieras inventar un juguete que no existe, ¿cómo sería?', pt: 'Se você pudesse inventar um brinquedo que não existe, como ele seria?', en: 'If you could invent a toy that doesn\'t exist yet, what would it be like?' },
      { es: '¿Cómo sería tu casa ideal del futuro?', pt: 'Como seria a sua casa ideal do futuro?', en: 'What would your dream house of the future be like?' },
      { es: 'Si los autos pudieran volar, ¿adónde irías primero?', pt: 'Se os carros pudessem voar, aonde você iria primeiro?', en: 'If cars could fly, where would you go first?' },
      { es: '¿Qué te gustaría que hiciera un robot por tu familia?', pt: 'O que você gostaria que um robô fizesse pela sua família?', en: 'What would you like a robot to do for your family?' },
      { es: 'Imagina una mascota del futuro: ¿qué poderes tendría?', pt: 'Imagine um bichinho do futuro: que poderes ele teria?', en: 'Imagine a pet from the future: what powers would it have?' },
    ],
    '9-11': [
      { es: 'Inventa un transporte que no contamine y sea divertido de usar.', pt: 'Invente um transporte que não polua e seja divertido de usar.', en: 'Invent a way to travel that doesn\'t pollute and is fun to use.' },
      { es: '¿Qué problema de tu ciudad resolverías con un invento?', pt: 'Que problema da sua cidade você resolveria com uma invenção?', en: 'What problem in your city would you solve with an invention?' },
      { es: 'Si las casas fueran inteligentes, ¿qué te gustaría que hicieran solas?', pt: 'Se as casas fossem inteligentes, o que você gostaria que elas fizessem sozinhas?', en: 'If houses were smart, what would you want them to do on their own?' },
      { es: 'Diseña un juego que enseñe algo importante mientras te diviertes.', pt: 'Crie um jogo que ensine algo importante enquanto você se diverte.', en: 'Design a game that teaches something important while you have fun.' },
      { es: '¿Cómo ayudaría la tecnología a alguien que vive lejos de la escuela?', pt: 'Como a tecnologia ajudaria alguém que mora longe da escola?', en: 'How could technology help someone who lives far from school?' },
      { es: 'Si pudieras crear una app para ayudar a tu comunidad, ¿qué haría?', pt: 'Se você pudesse criar um app para ajudar sua comunidade, o que ele faria?', en: 'If you could create an app to help your community, what would it do?' },
      { es: '¿Cómo crees que estudiaremos dentro de 30 años?', pt: 'Como você acha que vamos estudar daqui a 30 anos?', en: 'How do you think we\'ll study 30 years from now?' },
      { es: 'Inventa una solución para que nadie se sienta solo.', pt: 'Invente uma solução para que ninguém se sinta sozinho.', en: 'Invent a solution so that no one ever feels lonely.' },
      { es: 'Si un aparato te tradujera todos los idiomas, ¿qué harías con eso?', pt: 'Se um aparelho traduzisse todos os idiomas para você, o que faria com isso?', en: 'If a device could translate every language for you, what would you do with it?' },
      { es: '¿Qué trabajo del futuro te gustaría inventar?', pt: 'Que trabalho do futuro você gostaria de inventar?', en: 'What job of the future would you like to invent?' },
    ],
    '12-15': [
      { es: 'Diseña un invento que mejore la vida en tu comunidad y explica cómo funcionaría.', pt: 'Crie uma invenção que melhore a vida na sua comunidade e explique como funcionaria.', en: 'Design an invention that improves life in your community and explain how it would work.' },
      { es: 'Si la IA pudiera hacer cualquier trabajo, ¿qué deberían hacer las personas?', pt: 'Se a IA pudesse fazer qualquer trabalho, o que as pessoas deveriam fazer?', en: 'If AI could do any job, what should people do?' },
      { es: '¿Qué tecnología de hoy crees que será ridícula dentro de 50 años?', pt: 'Que tecnologia de hoje você acha que será ridícula daqui a 50 anos?', en: 'What technology of today do you think will seem ridiculous in 50 years?' },
      { es: 'Inventa una solución para que nadie pase hambre: ¿qué necesitarías?', pt: 'Invente uma solução para que ninguém passe fome: do que você precisaria?', en: 'Invent a solution so no one goes hungry: what would you need?' },
      { es: '¿Es buena idea colonizar otro planeta antes de arreglar el nuestro?', pt: 'É boa ideia colonizar outro planeta antes de consertar o nosso?', en: 'Is it a good idea to colonize another planet before fixing our own?' },
      { es: 'Si la inteligencia artificial pudiera crear arte, ¿seguiría siendo arte?', pt: 'Se a inteligência artificial pudesse criar arte, ainda seria arte?', en: 'If artificial intelligence could create art, would it still be art?' },
      { es: '¿Qué problema del mundo resolverías primero con tecnología y por qué?', pt: 'Que problema do mundo você resolveria primeiro com tecnologia e por quê?', en: 'What world problem would you solve first with technology, and why?' },
      { es: 'Si pudieras vivir 200 años, ¿lo harías? ¿Qué cambiaría?', pt: 'Se você pudesse viver 200 anos, faria isso? O que mudaria?', en: 'If you could live 200 years, would you? What would change?' },
      { es: '¿La tecnología nos acerca o nos aleja de las personas?', pt: 'A tecnologia nos aproxima ou nos afasta das pessoas?', en: 'Does technology bring us closer to people or push us apart?' },
      { es: '¿Deberíamos ponerle límites a lo que la IA puede hacer? ¿Cuáles?', pt: 'Devemos colocar limites no que a IA pode fazer? Quais?', en: 'Should we set limits on what AI can do? Which ones?' },
    ],
  },
  etica: {
    '6-8': [
      { es: 'Tu amigo se llevó un juguete sin permiso. ¿Qué le dirías?', pt: 'Seu amigo pegou um brinquedo sem permissão. O que você diria?', en: 'Your friend took a toy without asking. What would you say to them?' },
      { es: 'Si lastimaste a un amigo sin querer, ¿cómo le pedís perdón?', pt: 'Se você machucou um amigo sem querer, como pede desculpas?', en: 'If you hurt a friend by accident, how would you say sorry?' },
      { es: 'Encuentras dinero en el piso de la escuela. ¿Qué haces?', pt: 'Você encontra dinheiro no chão da escola. O que faz?', en: 'You find money on the floor at school. What do you do?' },
      { es: 'Si todos quieren el mismo juego, ¿cómo lo resuelven sin pelear?', pt: 'Se todos querem o mesmo jogo, como resolvem sem brigar?', en: 'If everyone wants the same game, how do you sort it out without fighting?' },
      { es: '¿Por qué es importante compartir, aunque a veces cueste?', pt: 'Por que é importante compartilhar, mesmo quando é difícil?', en: 'Why is it important to share, even when it\'s hard?' },
      { es: 'Un amigo está triste. ¿Qué harías para ayudarlo?', pt: 'Um amigo está triste. O que você faria para ajudá-lo?', en: 'A friend is sad. What would you do to help them?' },
      { es: 'Si ves a dos compañeros peleando, ¿qué podrías hacer?', pt: 'Se você vê dois colegas brigando, o que poderia fazer?', en: 'If you see two classmates fighting, what could you do?' },
      { es: 'Si rompes algo sin querer, ¿qué haces?', pt: 'Se você quebra algo sem querer, o que faz?', en: 'If you break something by accident, what do you do?' },
      { es: '¿Por qué es importante cumplir lo que prometemos?', pt: 'Por que é importante cumprir o que prometemos?', en: 'Why is it important to keep our promises?' },
      { es: 'Si ves a alguien solo en el recreo, ¿qué harías?', pt: 'Se você vê alguém sozinho no recreio, o que faria?', en: 'If you see someone alone at recess, what would you do?' },
    ],
    '9-11': [
      { es: 'Viste a alguien hacer trampa en un juego. ¿Dices algo o no? ¿Por qué?', pt: 'Você viu alguém trapacear num jogo. Você fala algo ou não? Por quê?', en: 'You saw someone cheat in a game. Do you say something or not? Why?' },
      { es: '¿Es justo que el más fuerte gane siempre? ¿Qué cambiarías?', pt: 'É justo que o mais forte ganhe sempre? O que você mudaria?', en: 'Is it fair for the strongest to always win? What would you change?' },
      { es: 'Un amigo te pide guardar un secreto que podría lastimar a alguien. ¿Qué haces?', pt: 'Um amigo te pede para guardar um segredo que poderia machucar alguém. O que você faz?', en: 'A friend asks you to keep a secret that could hurt someone. What do you do?' },
      { es: '¿Está bien romper una regla si la regla es injusta?', pt: 'É certo quebrar uma regra se a regra é injusta?', en: 'Is it okay to break a rule if the rule is unfair?' },
      { es: 'Si una máquina decide por ti, ¿quién tiene la culpa si se equivoca?', pt: 'Se uma máquina decide por você, quem tem a culpa se ela errar?', en: 'If a machine decides for you, who is to blame when it gets it wrong?' },
      { es: '¿Es justo que todos tengan las mismas reglas aunque sean diferentes?', pt: 'É justo que todos tenham as mesmas regras mesmo sendo diferentes?', en: 'Is it fair for everyone to have the same rules even when they\'re different?' },
      { es: 'Si encuentras el celular de alguien, ¿qué haces?', pt: 'Se você encontra o celular de alguém, o que faz?', en: 'If you find someone\'s phone, what do you do?' },
      { es: '¿Está bien copiarse en una prueba si todos lo hacen?', pt: 'É certo colar numa prova se todo mundo faz isso?', en: 'Is it okay to cheat on a test if everyone else does?' },
      { es: '¿Qué es más importante: ganar o jugar limpio?', pt: 'O que é mais importante: ganhar ou jogar limpo?', en: 'What matters more: winning or playing fair?' },
      { es: 'Si una regla te parece injusta, ¿cómo la cambiarías?', pt: 'Se uma regra te parece injusta, como você a mudaria?', en: 'If a rule seems unfair to you, how would you change it?' },
    ],
    '12-15': [
      { es: 'Una app gratis usa tus datos para ganar dinero. ¿Es un trato justo?', pt: 'Um app grátis usa seus dados para ganhar dinheiro. É um trato justo?', en: 'A free app uses your data to make money. Is that a fair deal?' },
      { es: '¿Debería un robot tener permitido mentir si eso ayuda a alguien?', pt: 'Um robô deveria poder mentir se isso ajudar alguém?', en: 'Should a robot be allowed to lie if it helps someone?' },
      { es: 'Si pudieras salvar a 5 personas sacrificando 1, ¿lo harías? Explica.', pt: 'Se você pudesse salvar 5 pessoas sacrificando 1, você faria? Explique.', en: 'If you could save 5 people by sacrificing 1, would you? Explain.' },
      { es: '¿Es ético copiar la idea de alguien si la mejoras mucho?', pt: 'É ético copiar a ideia de alguém se você a melhora muito?', en: 'Is it ethical to copy someone\'s idea if you improve it a lot?' },
      { es: '¿Quién decide qué está bien y qué está mal: la ley, la mayoría o tu conciencia?', pt: 'Quem decide o que é certo e errado: a lei, a maioria ou sua consciência?', en: 'Who decides what\'s right and wrong: the law, the majority, or your conscience?' },
      { es: '¿Es ético mentir para proteger a alguien que quieres?', pt: 'É ético mentir para proteger alguém que você ama?', en: 'Is it ethical to lie in order to protect someone you love?' },
      { es: '¿Deberían las redes sociales ser responsables de lo que publica la gente?', pt: 'As redes sociais deveriam ser responsáveis pelo que as pessoas publicam?', en: 'Should social media be responsible for what people post on it?' },
      { es: 'Si pudieras leer la mente de los demás, ¿sería correcto usar ese poder?', pt: 'Se você pudesse ler a mente dos outros, seria correto usar esse poder?', en: 'If you could read other people\'s minds, would it be right to use that power?' },
      { es: '¿Es justo juzgar a alguien por un error que cometió hace años?', pt: 'É justo julgar alguém por um erro que cometeu anos atrás?', en: 'Is it fair to judge someone for a mistake they made years ago?' },
      { es: '¿Quién debería decidir qué información es verdadera en internet?', pt: 'Quem deveria decidir qual informação é verdadeira na internet?', en: 'Who should decide what information is true on the internet?' },
    ],
  },
  preguntas: {
    '6-8': [
      { es: 'Si pudieras tener un superpoder, ¿cuál elegirías?', pt: 'Se você pudesse ter um superpoder, qual escolheria?', en: 'If you could have one superpower, which would you choose?' },
      { es: 'Imaginá un animal nuevo: ¿cómo es y cómo se llama?', pt: 'Imagine um animal novo: como ele é e como se chama?', en: 'Imagine a brand-new animal: what is it like and what is it called?' },
      { es: 'Si pudieras hablar con los animales, ¿a quién le hablarías primero?', pt: 'Se você pudesse falar com os animais, com quem falaria primeiro?', en: 'If you could talk to animals, who would you talk to first?' },
      { es: 'Si las nubes fueran de algodón de azúcar, ¿a qué sabrían?', pt: 'Se as nuvens fossem de algodão-doce, com que gosto seriam?', en: 'If clouds were made of cotton candy, what would they taste like?' },
      { es: 'Si pudieras volar, ¿adónde irías?', pt: 'Se você pudesse voar, aonde iria?', en: 'If you could fly, where would you go?' },
      { es: 'Si fueras gigante por un día, ¿qué harías?', pt: 'Se você fosse gigante por um dia, o que faria?', en: 'If you were a giant for one day, what would you do?' },
      { es: 'Si encontraras un cofre del tesoro, ¿qué te gustaría que tenga adentro?', pt: 'Se você achasse um baú do tesouro, o que gostaria que tivesse dentro?', en: 'If you found a treasure chest, what would you want inside it?' },
      { es: '¿Qué cosa te hace reír muchísimo?', pt: 'O que te faz rir muito?', en: 'What is something that makes you laugh a lot?' },
      { es: 'Si pudieras pintar el cielo, ¿de qué color lo dejarías?', pt: 'Se você pudesse pintar o céu, de que cor o deixaria?', en: 'If you could paint the sky, what color would you make it?' },
      { es: 'Si tuvieras una varita mágica, ¿qué harías aparecer?', pt: 'Se você tivesse uma varinha mágica, o que faria aparecer?', en: 'If you had a magic wand, what would you make appear?' },
    ],
    '9-11': [
      { es: '¿Puede existir un color que nadie vio nunca?', pt: 'Pode existir uma cor que ninguém nunca viu?', en: 'Could there be a color that no one has ever seen?' },
      { es: 'Si nadie te ve hacer algo bueno, ¿vale lo mismo?', pt: 'Se ninguém te vê fazer algo bom, vale a mesma coisa?', en: 'If no one sees you do something good, does it count the same?' },
      { es: '¿Qué pesa más: una idea o una montaña?', pt: 'O que pesa mais: uma ideia ou uma montanha?', en: 'What weighs more: an idea or a mountain?' },
      { es: '¿Por qué hacemos preguntas si no siempre hay respuesta?', pt: 'Por que fazemos perguntas se nem sempre há resposta?', en: 'Why do we ask questions if there isn\'t always an answer?' },
      { es: 'Si pudieras hablar con tu yo del futuro, ¿qué le preguntarías?', pt: 'Se você pudesse falar com o seu eu do futuro, o que perguntaria?', en: 'If you could talk to your future self, what would you ask?' },
      { es: '¿El tiempo existiría si no hubiera relojes?', pt: 'O tempo existiria se não houvesse relógios?', en: 'Would time exist if there were no clocks?' },
      { es: '¿Se puede pensar sin usar palabras?', pt: 'Dá para pensar sem usar palavras?', en: 'Can you think without using words?' },
      { es: '¿Qué es más real: lo que vemos o lo que imaginamos?', pt: 'O que é mais real: o que vemos ou o que imaginamos?', en: 'What is more real: what we see or what we imagine?' },
      { es: 'Si nadie recordara algo, ¿de verdad pasó?', pt: 'Se ninguém lembrasse de algo, isso de fato aconteceu?', en: 'If no one remembered something, did it really happen?' },
      { es: '¿Por qué dos personas pueden ver lo mismo y pensar distinto?', pt: 'Por que duas pessoas podem ver a mesma coisa e pensar diferente?', en: 'Why can two people see the same thing and think differently about it?' },
    ],
    '12-15': [
      { es: '¿La verdad existe aunque nadie la conozca?', pt: 'A verdade existe mesmo que ninguém a conheça?', en: 'Does the truth exist even if no one knows it?' },
      { es: 'Si una máquina siente, ¿merece derechos?', pt: 'Se uma máquina sente, ela merece direitos?', en: 'If a machine can feel, does it deserve rights?' },
      { es: '¿Somos libres de verdad o solo creemos serlo?', pt: 'Somos realmente livres ou só achamos que somos?', en: 'Are we truly free, or do we just believe we are?' },
      { es: '¿Tiene sentido el infinito o es solo una palabra?', pt: 'O infinito faz sentido ou é só uma palavra?', en: 'Does infinity actually make sense, or is it just a word?' },
      { es: '¿Qué te hace ser tú y no otra persona?', pt: 'O que faz você ser você e não outra pessoa?', en: 'What makes you you and not someone else?' },
      { es: '¿Existe el azar o todo tiene una causa?', pt: 'Existe o acaso ou tudo tem uma causa?', en: 'Does chance really exist, or does everything have a cause?' },
      { es: '¿Podemos estar seguros de que el mundo es real y no un sueño?', pt: 'Podemos ter certeza de que o mundo é real e não um sonho?', en: 'Can we be sure the world is real and not a dream?' },
      { es: '¿La felicidad se busca o se encuentra?', pt: 'A felicidade se busca ou se encontra?', en: 'Is happiness something you search for or something you stumble upon?' },
      { es: 'Si pudieras saber tu futuro, ¿querrías saberlo?', pt: 'Se você pudesse saber seu futuro, gostaria de saber?', en: 'If you could know your future, would you want to?' },
      { es: '¿Qué hace que una vida valga la pena?', pt: 'O que faz uma vida valer a pena?', en: 'What makes a life worth living?' },
    ],
  },
  convivencia: {
    '6-8': [
      { es: '¿Qué harías para que alguien nuevo se sienta bienvenido?', pt: 'O que você faria para alguém novo se sentir bem-vindo?', en: 'What would you do to make someone new feel welcome?' },
      { es: 'Si un amigo está triste, ¿cómo te darías cuenta?', pt: 'Se um amigo está triste, como você perceberia?', en: 'If a friend is sad, how would you be able to tell?' },
      { es: '¿Qué se siente cuando alguien te escucha de verdad?', pt: 'O que você sente quando alguém te escuta de verdade?', en: 'How does it feel when someone really listens to you?' },
      { es: 'Si dos amigos quieren jugar a cosas distintas, ¿qué harías?', pt: 'Se dois amigos querem brincar de coisas diferentes, o que você faria?', en: 'If two friends want to play different things, what would you do?' },
      { es: '¿Cómo pedirías perdón si lastimaste a alguien sin querer?', pt: 'Como você pediria desculpa se magoou alguém sem querer?', en: 'How would you say sorry if you hurt someone by accident?' },
      { es: '¿Qué es lo más lindo que un amigo puede hacer por ti?', pt: 'Qual é a coisa mais bonita que um amigo pode fazer por você?', en: 'What is the nicest thing a friend can do for you?' },
      { es: 'Si alguien se ríe de otro, ¿qué podrías hacer?', pt: 'Se alguém ri de outra pessoa, o que você poderia fazer?', en: 'If someone laughs at another person, what could you do?' },
      { es: '¿Cómo se comparte algo que a los dos les gusta mucho?', pt: 'Como se divide algo de que os dois gostam muito?', en: 'How do you share something that you both really like?' },
      { es: '¿Qué harías si ves a un compañero jugando siempre solo?', pt: 'O que você faria se visse um colega sempre brincando sozinho?', en: 'What would you do if you saw a classmate always playing alone?' },
      { es: '¿Cómo saber si alguien quiere estar solo o quiere compañía?', pt: 'Como saber se alguém quer ficar sozinho ou quer companhia?', en: 'How can you tell if someone wants to be alone or wants company?' },
      { es: '¿Qué palabras hacen sentir bien a los demás?', pt: 'Que palavras fazem os outros se sentirem bem?', en: 'What words make other people feel good?' },
      { es: 'Si te enojas con un amigo, ¿cómo vuelven a estar bien?', pt: 'Se você briga com um amigo, como vocês voltam a ficar bem?', en: 'If you get angry with a friend, how do you make up again?' },
    ],
    '9-11': [
      { es: '¿Cómo ayudarías a dos compañeros que se pelearon a hacer las paces?', pt: 'Como você ajudaria dois colegas que brigaram a fazer as pazes?', en: 'How would you help two classmates who fought to make peace?' },
      { es: '¿Qué diferencia hay entre escuchar y solo esperar tu turno para hablar?', pt: 'Que diferença há entre escutar e só esperar sua vez de falar?', en: 'What\'s the difference between listening and just waiting for your turn to talk?' },
      { es: 'Si un grupo deja afuera a alguien, ¿qué podrías hacer?', pt: 'Se um grupo deixa alguém de fora, o que você poderia fazer?', en: 'If a group leaves someone out, what could you do?' },
      { es: '¿Por qué a veces es tan difícil pedir perdón?', pt: 'Por que às vezes é tão difícil pedir desculpa?', en: 'Why is it sometimes so hard to say sorry?' },
      { es: '¿Cómo se siente que te entiendan aunque no estén de acuerdo contigo?', pt: 'Como é sentir que te entendem mesmo sem concordar com você?', en: 'How does it feel to be understood even when someone disagrees with you?' },
      { es: '¿Qué harías si tu amigo te pide hacer algo que no quieres?', pt: 'O que você faria se seu amigo pedisse para fazer algo que você não quer?', en: 'What would you do if your friend asked you to do something you don\'t want to?' },
      { es: '¿Cómo tratarías a alguien que piensa muy distinto a ti?', pt: 'Como você trataria alguém que pensa muito diferente de você?', en: 'How would you treat someone who thinks very differently from you?' },
      { es: '¿Se puede ser amigo de alguien con quien no compartes gustos?', pt: 'Dá para ser amigo de alguém com quem você não compartilha gostos?', en: 'Can you be friends with someone you don\'t share interests with?' },
      { es: '¿Qué hace que un equipo funcione bien aunque sus miembros sean distintos?', pt: 'O que faz uma equipe funcionar bem mesmo com membros diferentes?', en: 'What makes a team work well even when its members are all different?' },
      { es: 'Si alguien te cuenta algo difícil, ¿cómo lo acompañarías?', pt: 'Se alguém te conta algo difícil, como você o acompanharia?', en: 'If someone tells you something hard, how would you support them?' },
      { es: '¿Por qué a veces herimos justo a quienes más queremos?', pt: 'Por que às vezes machucamos justamente quem mais amamos?', en: 'Why do we sometimes hurt exactly the people we love most?' },
      { es: '¿Cómo se construye la confianza entre dos personas?', pt: 'Como se constrói a confiança entre duas pessoas?', en: 'How is trust built between two people?' },
    ],
    '12-15': [
      { es: '¿Se puede convivir bien con alguien que piensa completamente distinto a ti?', pt: 'É possível conviver bem com alguém que pensa completamente diferente de você?', en: 'Can you get along well with someone who thinks completely differently from you?' },
      { es: '¿Qué es más difícil: perdonar o pedir perdón? ¿Por qué?', pt: 'O que é mais difícil: perdoar ou pedir perdão? Por quê?', en: 'What is harder: forgiving or asking for forgiveness? Why?' },
      { es: '¿Hasta dónde hay que ceder para mantener una amistad?', pt: 'Até onde é preciso ceder para manter uma amizade?', en: 'How much should you give up to keep a friendship?' },
      { es: '¿Es posible ser sincero sin lastimar? ¿Cómo?', pt: 'É possível ser sincero sem magoar? Como?', en: 'Is it possible to be honest without hurting someone? How?' },
      { es: '¿Qué diferencia hay entre tolerar a alguien y respetarlo de verdad?', pt: 'Que diferença há entre tolerar alguém e respeitá-lo de verdade?', en: 'What\'s the difference between tolerating someone and truly respecting them?' },
      { es: '¿Por qué a veces es más fácil ser cruel en grupo que estando solo?', pt: 'Por que às vezes é mais fácil ser cruel em grupo do que sozinho?', en: 'Why is it sometimes easier to be cruel in a group than on your own?' },
      { es: '¿Se puede querer a alguien y aun así ponerle límites?', pt: 'Dá para amar alguém e ainda assim colocar limites?', en: 'Can you love someone and still set boundaries with them?' },
      { es: '¿Qué hace que un grupo incluya o excluya a una persona?', pt: 'O que faz um grupo incluir ou excluir uma pessoa?', en: 'What makes a group include or exclude a person?' },
      { es: '¿Cómo cambiarías la forma en que tu generación se trata en las redes?', pt: 'Como você mudaria a forma como a sua geração se trata nas redes?', en: 'How would you change the way your generation treats each other online?' },
      { es: '¿Vale la pena mantener una amistad que te hace sentir mal?', pt: 'Vale a pena manter uma amizade que te faz sentir mal?', en: 'Is it worth keeping a friendship that makes you feel bad?' },
      { es: '¿Es responsabilidad tuya el bienestar de los que te rodean?', pt: 'O bem-estar de quem está à sua volta é responsabilidade sua?', en: 'Is the well-being of the people around you your responsibility?' },
      { es: '¿Cómo se reconstruye la confianza después de una traición?', pt: 'Como se reconstrói a confiança depois de uma traição?', en: 'How do you rebuild trust after a betrayal?' },
    ],
  },
}

export function getWorld(id) {
  return WORLDS.find((w) => w.id === id)
}

// Siguiente planeta en orden (vuelve al primero tras el último → nunca se corta).
export function nextWorldId(id) {
  const i = WORLDS.findIndex((w) => w.id === id)
  return WORLDS[(i + 1) % WORLDS.length].id
}

export function getQuestions(worldId, ageGroup) {
  const base = CHALLENGES[worldId]?.[ageGroup] || CHALLENGES[worldId]?.['9-11'] || []
  const extra = EXTRA_CHALLENGES[worldId]?.[ageGroup] || EXTRA_CHALLENGES[worldId]?.['9-11'] || []
  const extra2 = EXTRA_CHALLENGES_2[worldId]?.[ageGroup] || EXTRA_CHALLENGES_2[worldId]?.['9-11'] || []
  const extra3 = EXTRA_CHALLENGES_3[worldId]?.[ageGroup] || EXTRA_CHALLENGES_3[worldId]?.['9-11'] || []
  const extra4 = EXTRA_CHALLENGES_4[worldId]?.[ageGroup] || EXTRA_CHALLENGES_4[worldId]?.['9-11'] || []
  return base.concat(extra, extra2, extra3, extra4)
}

export function pickQuestion(worldId, ageGroup, seed = Math.random()) {
  const qs = getQuestions(worldId, ageGroup)
  if (!qs.length) return { es: '', pt: '', en: '' }
  return qs[Math.floor(seed * qs.length) % qs.length]
}

// Saca n preguntas AL AZAR del banco, evitando las ya vistas (exclude) para
// que NO se repitan al pasar de ronda. Si no alcanzan, usa todo el banco.
export function pickRoundQuestions(worldId, ageGroup, n = 5, exclude = []) {
  const pool = getQuestions(worldId, ageGroup)
  const seen = new Set(exclude)
  let qs = pool.filter((q) => !seen.has(q.es))
  if (qs.length < n) qs = [...pool] // banco agotado → reinicia el ciclo
  else qs = [...qs]
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[qs[i], qs[j]] = [qs[j], qs[i]]
  }
  return qs.slice(0, Math.min(n, qs.length))
}

// Modo Aula: mezcla preguntas de los 4 mundos para una edad y toma n (cada una con su mundo).
export function pickMixedQuestions(ageGroup, n = 20) {
  const all = []
  for (const w of WORLDS) {
    const qs = getQuestions(w.id, ageGroup)
    for (const q of qs) all.push({ ...q, world: w.id, color: w.color, emoji: w.emoji })
  }
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all.slice(0, Math.min(n, all.length))
}
