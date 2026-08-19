// ⚔️ GUARDIANES — el "jefe" de cada planeta. Son los enemigos del buen pensar:
// se los vence PENSANDO (cada estrella de tus respuestas les quita vida).
// Al completar los 5 niveles de un mundo se desbloquea su guardián; vencerlo
// corona el planeta 👑 y da un botín grande. Esto convierte el mapa en una
// conquista (propósito) y no en una lista de preguntas.

export const GUARDIAN_HP = 15      // vida del jefe (3 preguntas × máx 5 ⭐ de daño)
export const GUARDIAN_WIN = 9      // daño necesario para vencerlo (promedio 3⭐)
export const GUARDIAN_QUESTIONS = 3
export const GUARDIAN_SECONDS = 20 // más presión que una ronda normal
export const GUARDIAN_REWARD = { coins: 40, xp: 60 } // botín por la victoria (+1 poder sorpresa)

export const GUARDIANS = {
  planeta: {
    emoji: '🌪️', color: '#10B981',
    name_es: 'Smog, el Ensuciador', name_pt: 'Smog, o Sujão', name_en: 'Smog, the Polluter',
    taunt_es: '¡Nadie puede detener mi basura! ¿O sí…?', taunt_pt: 'Ninguém pode parar meu lixo! Ou será que sim…?', taunt_en: 'No one can stop my trash! Or can they…?',
    weak_es: 'Se debilita con IDEAS para cuidar el planeta.', weak_pt: 'Ele enfraquece com IDEIAS para cuidar do planeta.', weak_en: 'He gets weaker with IDEAS to care for the planet.',
  },
  futuro: {
    emoji: '🤖', color: '#FBBF24',
    name_es: 'Óxido, el Anti-Inventos', name_pt: 'Ferrugem, o Anti-Invenções', name_en: 'Rust, the Anti-Inventor',
    taunt_es: '¿Inventar? ¡Ja! Todo ya está inventado…', taunt_pt: 'Inventar? Ha! Já inventaram tudo…', taunt_en: 'Invent? Ha! Everything has already been invented…',
    weak_es: 'Se debilita con IMAGINACIÓN y nuevas ideas.', weak_pt: 'Ele enfraquece com IMAGINAÇÃO e ideias novas.', weak_en: 'He gets weaker with IMAGINATION and new ideas.',
  },
  etica: {
    emoji: '🎭', color: '#F43F5E',
    name_es: 'Trampas, el Convenenciero', name_pt: 'Trapaça, o Espertinho', name_en: 'Cheat, the Trickster',
    taunt_es: 'Hacer lo correcto es aburrido… ¿verdad?', taunt_pt: 'Fazer o certo é chato… né?', taunt_en: 'Doing the right thing is boring… right?',
    weak_es: 'Se debilita cuando explicas QUÉ es lo justo y por qué.', weak_pt: 'Ele enfraquece quando você explica O QUE é justo e por quê.', weak_en: 'He gets weaker when you explain WHAT is fair and why.',
  },
  preguntas: {
    emoji: '🌫️', color: '#0EA5E9',
    name_es: 'La Niebla de la Duda', name_pt: 'A Névoa da Dúvida', name_en: 'The Fog of Doubt',
    taunt_es: 'Shhh… mejor no pienses. Es más fácil no saber…', taunt_pt: 'Shhh… melhor não pensar. É mais fácil não saber…', taunt_en: 'Shhh… better not to think. It is easier not to know…',
    weak_es: 'Se disipa con PENSAMIENTO profundo y porqués.', weak_pt: 'Ela se dissipa com PENSAMENTO profundo e porquês.', weak_en: 'It fades away with deep THINKING and lots of whys.',
  },
  convivencia: {
    emoji: '🧊', color: '#A855F7',
    name_es: 'Hielo, el Indiferente', name_pt: 'Gelo, o Indiferente', name_en: 'Ice, the Indifferent',
    taunt_es: '¿Para qué escuchar a los demás? Cada uno con lo suyo…', taunt_pt: 'Para que escutar os outros? Cada um com o seu…', taunt_en: 'Why listen to anyone else? To each their own…',
    weak_es: 'Se derrite con EMPATÍA: cuando te pones en el lugar del otro.', weak_pt: 'Ele derrete com EMPATIA: quando você se coloca no lugar do outro.', weak_en: 'He melts with EMPATHY: when you put yourself in someone else\'s shoes.',
  },
}

export function guardianOf(worldId) { return GUARDIANS[worldId] || null }
