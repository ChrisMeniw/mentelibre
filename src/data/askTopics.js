// El arte de preguntar — TEMAS/ESCENAS para que el chico haga sus mejores PREGUNTAS.
// No son preguntas a responder: son disparadores de curiosidad e imaginación.
// Estilo evocador/filosófico, adaptado por edad. ES + PT.
export const ASK_TOPICS = {
  '6-8': [
    { es: 'Un dragón que tiene miedo del fuego', pt: 'Um dragão que tem medo do fogo' },
    { es: 'Un juguete que cobra vida cuando nadie mira', pt: 'Um brinquedo que ganha vida quando ninguém olha' },
    { es: 'Una nube que se quedó sola en el cielo', pt: 'Uma nuvem que ficou sozinha no céu' },
    { es: 'Un caracol que quiere correr muy rápido', pt: 'Um caracol que quer correr muito rápido' },
    { es: 'Una estrella que se cayó en tu jardín', pt: 'Uma estrela que caiu no seu jardim' },
    { es: 'Un oso que no quiere dormir en invierno', pt: 'Um urso que não quer dormir no inverno' },
    { es: 'Un lápiz que dibuja cosas de verdad', pt: 'Um lápis que desenha coisas de verdade' },
    { es: 'Una mariposa que olvidó cómo volar', pt: 'Uma borboleta que esqueceu como voar' },
    { es: 'Un pez que quiere conocer la montaña', pt: 'Um peixe que quer conhecer a montanha' },
    { es: 'Una puerta pequeñita en el tronco de un árbol', pt: 'Uma portinha no tronco de uma árvore' },
    { es: 'Un robot chiquito que se perdió en tu casa', pt: 'Um robozinho que se perdeu na sua casa' },
    { es: 'Una sombra que hace cosas distintas a ti', pt: 'Uma sombra que faz coisas diferentes de você' },
  ],
  '9-11': [
    { es: 'El último árbol del mundo', pt: 'A última árvore do mundo' },
    { es: 'Una ciudad donde está prohibido dormir', pt: 'Uma cidade onde é proibido dormir' },
    { es: 'Encuentras una puerta en medio del océano', pt: 'Você encontra uma porta no meio do oceano' },
    { es: 'Un animal que nadie vio jamás', pt: 'Um animal que ninguém jamais viu' },
    { es: 'Un mapa que muestra lugares que todavía no existen', pt: 'Um mapa que mostra lugares que ainda não existem' },
    { es: 'Una biblioteca con todos los libros que nunca se escribieron', pt: 'Uma biblioteca com todos os livros que nunca foram escritos' },
    { es: 'El día que la gravedad dejó de funcionar', pt: 'O dia em que a gravidade parou de funcionar' },
    { es: 'Una escuela en el fondo del mar', pt: 'Uma escola no fundo do mar' },
    { es: 'Un reloj que en vez de horas marca recuerdos', pt: 'Um relógio que em vez de horas marca lembranças' },
    { es: 'Una semilla que tarda cien años en florecer', pt: 'Uma semente que leva cem anos para florescer' },
    { es: 'Un puente que conecta el pasado con el futuro', pt: 'Uma ponte que liga o passado ao futuro' },
    { es: 'La última palabra que quedó en el mundo', pt: 'A última palavra que sobrou no mundo' },
  ],
  '12-15': [
    { es: 'Un robot que aprendió a sentir tristeza', pt: 'Um robô que aprendeu a sentir tristeza' },
    { es: 'Un mundo donde nadie miente nunca', pt: 'Um mundo onde ninguém mente nunca' },
    { es: 'El día que se acabó el tiempo', pt: 'O dia em que o tempo acabou' },
    { es: 'Una máquina que cumple un solo deseo', pt: 'Uma máquina que realiza um único desejo' },
    { es: 'La última persona que queda despierta en la Tierra', pt: 'A última pessoa acordada na Terra' },
    { es: 'Un espejo que muestra quién podrías haber sido', pt: 'Um espelho que mostra quem você poderia ter sido' },
    { es: 'Una inteligencia artificial que se pregunta si está viva', pt: 'Uma inteligência artificial que se pergunta se está viva' },
    { es: 'El momento exacto en que una idea cambia el mundo', pt: 'O momento exato em que uma ideia muda o mundo' },
    { es: 'Un lugar donde se guardan todas las preguntas sin respuesta', pt: 'Um lugar onde se guardam todas as perguntas sem resposta' },
    { es: 'Una civilización que decidió olvidar su historia', pt: 'Uma civilização que decidiu esquecer sua história' },
    { es: 'El instante antes de tomar la decisión más difícil de tu vida', pt: 'O instante antes de tomar a decisão mais difícil da sua vida' },
    { es: 'Un silencio que dura mil años', pt: 'Um silêncio que dura mil anos' },
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

export function pickAskTopics(ageGroup, n = 5) {
  const pool = ASK_TOPICS[ageGroup] || ASK_TOPICS['9-11']
  return shuffle(pool).slice(0, Math.min(n, pool.length))
}
