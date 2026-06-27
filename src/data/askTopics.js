// El arte de preguntar — TEMAS para que el chico haga sus mejores PREGUNTAS.
// No son preguntas a responder: son disparadores de curiosidad. ES + PT, por edad.
export const ASK_TOPICS = {
  '6-8': [
    { es: 'Una ballena gigante en el océano', pt: 'Uma baleia gigante no oceano' },
    { es: 'Un robot que llegó a tu escuela', pt: 'Um robô que chegou na sua escola' },
    { es: 'Una semilla que crece muy rápido', pt: 'Uma semente que cresce muito rápido' },
    { es: 'La luna en el cielo de noche', pt: 'A lua no céu à noite' },
    { es: 'Un dinosaurio que apareció en el parque', pt: 'Um dinossauro que apareceu no parque' },
    { es: 'Un arcoíris después de la lluvia', pt: 'Um arco-íris depois da chuva' },
    { es: 'Una hormiga cargando una hoja enorme', pt: 'Uma formiga carregando uma folha enorme' },
    { es: 'Un volcán que echa humo', pt: 'Um vulcão soltando fumaça' },
    { es: 'Una estrella fugaz cruzando el cielo', pt: 'Uma estrela cadente cruzando o céu' },
    { es: 'Un pingüino caminando en la nieve', pt: 'Um pinguim andando na neve' },
    { es: 'Una mariposa de muchos colores', pt: 'Uma borboleta cheia de cores' },
    { es: 'Un castillo de arena en la playa', pt: 'Um castelo de areia na praia' },
  ],
  '9-11': [
    { es: 'Una ciudad donde nadie usa dinero', pt: 'Uma cidade onde ninguém usa dinheiro' },
    { es: 'Un animal que nunca duerme', pt: 'Um animal que nunca dorme' },
    { es: 'Internet se apaga durante un día entero', pt: 'A internet desliga por um dia inteiro' },
    { es: 'Un puente que conecta dos países', pt: 'Uma ponte que liga dois países' },
    { es: 'Una planta que limpia el aire de la ciudad', pt: 'Uma planta que limpa o ar da cidade' },
    { es: 'Una escuela sin paredes', pt: 'Uma escola sem paredes' },
    { es: 'El fondo del mar más profundo', pt: 'O fundo do mar mais profundo' },
    { es: 'Un idioma que solo hablan diez personas', pt: 'Uma língua que só dez pessoas falam' },
    { es: 'Una máquina que recicla cualquier cosa', pt: 'Uma máquina que recicla qualquer coisa' },
    { es: 'Un satélite que observa la Tierra', pt: 'Um satélite que observa a Terra' },
    { es: 'Un museo del futuro', pt: 'Um museu do futuro' },
    { es: 'Una tormenta enorme que se acerca', pt: 'Uma tempestade enorme se aproximando' },
  ],
  '12-15': [
    { es: 'Una inteligencia artificial que toma decisiones por la gente', pt: 'Uma inteligência artificial que toma decisões pelas pessoas' },
    { es: 'Una ley nueva que cambia el país', pt: 'Uma lei nova que muda o país' },
    { es: 'Una noticia que se volvió viral en horas', pt: 'Uma notícia que viralizou em horas' },
    { es: 'Una empresa que conoce todos tus datos', pt: 'Uma empresa que conhece todos os seus dados' },
    { es: 'Un descubrimiento científico que cambia todo', pt: 'Uma descoberta científica que muda tudo' },
    { es: 'El primer humano en pisar Marte', pt: 'O primeiro humano a pisar em Marte' },
    { es: 'Un algoritmo que decide qué ves cada día', pt: 'Um algoritmo que decide o que você vê todo dia' },
    { es: 'Una obra de arte que vale millones', pt: 'Uma obra de arte que vale milhões' },
    { es: 'Una protesta enorme en la calle', pt: 'Um protesto enorme na rua' },
    { es: 'Un robot que dice tener sentimientos', pt: 'Um robô que diz ter sentimentos' },
    { es: 'Una decisión muy difícil de un líder', pt: 'Uma decisão muito difícil de um líder' },
    { es: 'Una vacuna que tardó años en crearse', pt: 'Uma vacina que levou anos para ser criada' },
  ],
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickAskTopics(ageGroup, n = 3) {
  const pool = ASK_TOPICS[ageGroup] || ASK_TOPICS['9-11']
  return shuffle(pool).slice(0, Math.min(n, pool.length))
}
