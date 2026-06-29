# Contribuir a MenteLibre

Objetivo de este documento: que **otra persona desarrolladora entienda el código y
pueda corregir un bug o sumar una pantalla en menos de 2 horas**, sin depender de una
sola persona. Si algo acá quedó desactualizado, corregilo en el mismo PR.

## Stack

- **Vite 5** + **React 18** + **react-router-dom 6** + **Tailwind CSS 3**.
- **Sin TypeScript.** Todo es `.jsx` / `.js`.
- Sin backend propio: el estado del jugador vive en **localStorage**. La única llamada
  externa es a la **API de Anthropic (Claude)** para ZOE, y a un **proxy serverless de
  voz** (`/api/tts`) en Vercel.

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/  (verificá que pase antes de cada commit)
npm run preview  # sirve dist/ localmente
```

Variables de entorno (Vercel → Settings → Environment Variables):
- `VITE_ANTHROPIC_API_KEY` — clave de Claude. Si NO está, el juego funciona igual en
  "modo demo" con respuestas de respaldo (nunca se rompe). Ver `src/lib/claude.js`.

## Mapa del código (`src/`)

```
main.jsx            Punto de entrada. Envuelve <App/> en PlayerProvider + LangProvider.
App.jsx             Rutas (react-router) + capas globales: WarpBackground (fondo animado),
                    IntroSplash (1ª vez), BottomNav, AudioMusic, TapSound, LangToggle.
i18n.js             Diccionario ES/PT + hook useLang() → { t, lang, setLang }. TODO texto
                    visible pasa por t('clave'). Las dos claves (es/pt) deben existir siempre.

pages/              Una pantalla por archivo:
  Home / Landing      Inicio y alta del jugador (nombre, edad, avatar, escuela).
  Hub                 Mapa de mundos + pestañas (Jugar / Mi Equipo / Ranking).
  Round               EL LOOP PRINCIPAL: 5 preguntas abiertas, timer, racha, feedback de ZOE.
  Ask                 "El arte de preguntar": el chico hace preguntas; ZOE las puntúa (rúbrica).
  Daily               Reto del día (una pregunta para toda LATAM).
  Classroom           Modo aula (grupos de 5, 20 preguntas, ranking local).
  Shop / Achievements / MyUniverse / Mission / TeacherPortal / Challenge / Characters.

components/         UI reutilizable: Zoe (foto real + voz), WarpBackground y Universe
                   (canvas), characters/ (animales para 6-8), StreakBadge, Celebration, etc.
hooks/             usePlayer (estado + localStorage), useSpeech (dictado por voz).
lib/               claude.js (API de ZOE + rúbrica + manejo de errores), speak.js (voz de
                   ZOE), sfx.js (efectos), musicBus/musicControl (coordinan música), classroom.js.
data/              challenges.js / challengesExtra.js (preguntas por mundo y edad),
                   askTopics.js, levels.js, badges.js, shop.js. Aquí se edita el CONTENIDO.
```

## Reglas de oro (no romper)

1. **Modelo ABIERTO**: no hay respuestas correctas ni incorrectas. ZOE evalúa la calidad
   del pensamiento (1-3 estrellas), nunca dice "está mal". No convertir esto en un quiz.
2. **Bilingüe siempre**: cada string nuevo va en `i18n.js` con su par `es` y `pt`.
   El español es **neutro latinoamericano con "tú"** — NUNCA voseo (vos, tenés, podés…).
3. **ZOE = foto real** (`/zoe.jpg`), nunca un dibujo/SVG.
4. **Nunca exponer secretos** al frontend salvo `VITE_*` (que se inyectan en build).
   La app debe seguir funcionando sin `VITE_ANTHROPIC_API_KEY` (modo demo).
5. **El juego nunca se traba**: toda llamada a la IA tiene respaldo. Ver `callClaude`.
6. **Mobile primero / gama baja**: targets con `min-h-touch`, animaciones `requestAnimationFrame`
   que se pausan con `visibilitychange`, no descargar megas ansiosamente.

## Flujo de un cambio

1. Branch desde `main`.
2. Editá. Si tocás texto, agregá la clave en `i18n.js` (es + pt).
3. `npm run build` debe pasar.
4. Probá en `npm run dev` (o el preview headless).
5. Commit + push + PR. Vercel hace deploy de producción al mergear a `main`.

## Despliegue

- **Hosting**: Vercel (build automático desde `main`). Dominio: `mentelibre.chrismeniwfoundation.org`.
- **Voz**: función serverless `api/tts.js` (proxy de Google TTS) — NO requiere clave.
- Monitoreo y alertas: ver [MONITORING.md](MONITORING.md).
