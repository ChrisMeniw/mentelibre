# AUDIT.md — MenteLibre / Mente Livre

Auditoría inicial del proyecto antes de la transformación (Paso 0 del plan).
Fecha: 2026-06-27 · Sitio: https://mentelibre.chrismeniwfoundation.org

---

## ⭐ ACTUALIZACIÓN (lo más importante, leer primero)

### Decisiones ya confirmadas por Chris
- **Modelo de juego = PENSAMIENTO ABIERTO + IMAGINACIÓN** (no quiz). ZOE puntúa la *calidad*
  del pensamiento con ⭐1–3. **No hay respuestas correctas/incorrectas.** → Por eso **NO** se
  implementan las partes del plan que asumen quiz (FASE 2 "+10/−2", FASE 3 "mostrar la respuesta
  correcta + explicación", FASE 5 "mockup con opciones"). Se **adaptan** al modelo abierto.
- **Modo Aula = local** + **Reto Diario compartible** (sin backend, sin costos).

### Ya IMPLEMENTADO y EN VIVO desde la 1ª auditoría (no rehacer)
- ✅ **Accesibilidad WCAG** (Fase 8/3): `:focus-visible`, `prefers-reduced-motion` (apaga
  animaciones + frena el fondo), `aria-live`/`role="status"` en feedback.
- ✅ **Reto del Día compartible** (Fase 6): pregunta del día determinística por fecha, igual para
  todos; responder por voz/texto; ZOE puntúa; **Web Share API + copiar**; ruta `/reto`; 4ª tarjeta
  en el inicio. (`src/lib/dailyChallenge.js`, `src/pages/Daily.jsx`)
- ✅ **SEO + OpenGraph** (Fase 7): el link se ve con tarjeta al compartirlo.
- ✅ **Onboarding "Saltar" siempre visible** (Fase 5) ya existía (`HowToPlay.jsx`).

### 🆕 NUEVO pedido de Chris — "ganar por saber PREGUNTAR"
> *"es pensamiento crítico e imaginación; en el último nivel los chicos ganan por saber preguntar:
> los que mejor pregunten sobre algo son los que mejor puntúan."*

**Propuesta (compatible con el modelo abierto):** un modo/mundo nuevo **"🦉 El arte de preguntar"**
donde se invierte el juego: ZOE muestra un **tema/escena** y el chico, en vez de responder, **escribe
o dice las MEJORES preguntas** que se le ocurran sobre eso. La IA puntúa la **calidad de las
preguntas** (profundidad, originalidad, curiosidad, imaginación) con ⭐1–3 — gana quien mejor pregunta.
Se desbloquea/realza al llegar al nivel más alto (**Filósofo 🦉**), que es "el último nivel".
Decisión de presentación pendiente (ver §6 · B3).

---


---

## 0. Resumen ejecutivo

**El proyecto YA es una plataforma con game loop completo, progresión, badges, feedback
emocional, ZOE, modo aula, ranking, misiones diarias, branding de la Fundación, PWA
instalable y UX bilingüe ES/PT.** Gran parte de las 8 fases del plan **ya está implementada**.

Hay **2 diferencias de fondo entre el plan y el proyecto real** que definen todo lo demás:

| # | El plan dice | La realidad es | Qué hago |
|---|--------------|----------------|----------|
| **A** | Stack **Next.js + TypeScript** (`layout.tsx`, `_app.tsx`) | **Vite + React + JavaScript** (sin Next, sin TS) | Adapto la *intención* de cada fase al stack real. No creo archivos Next/TS. |
| **B** | Preguntas de **opción múltiple** con respuesta **correcta/incorrecta** (+10 / −2 XP, "mostrá la respuesta correcta") | Preguntas **abiertas**: ZOE/IA puntúa la **calidad del pensamiento** con ⭐ 1–3. **No hay respuestas incorrectas** (decisión tuya, repetida). | **Decisión pendiente tuya** (ver §4). No convierto el juego a quiz sin tu OK porque rompería la pedagogía. |

> ⚠️ **Lo que NO hay que romper bajo ningún concepto** está en §3.

---

## 1. Estructura actual

**Stack:** Vite 5 + React 18 + react-router-dom 6 + Tailwind 3. Sin TypeScript. Sin Next.js.
Deploy en Vercel (dominio `mentelibre.chrismeniwfoundation.org`). PWA instalable (manifest + SW).

```
src/
  main.jsx            StrictMode → LangProvider → PlayerProvider → BrowserRouter → App
  App.jsx             Rutas + WarpBackground + LangToggle + BottomNav + FoundationBadge + MusicEngine
  i18n.js             Diccionario ES/PT completo (LangProvider/useLang)
  index.css           Tailwind + estilos (⚠️ sin prefers-reduced-motion)
  pages/    Home, Landing, Hub, Round, Challenge, Classroom, Shop, Achievements, Mission, TeacherPortal
  components/  Zoe, Mascot, Celebration, DailyMissions, AdventureMap, HowToPlay, FoundationBadge,
               BottomNav, WarpBackground, AvatarPicker, BadgeGrid, RankingTable, SchoolBanner,
               TeamTab, XPBar, WorldCard, InstallButton, MusicEngine, AIResponse
  hooks/    usePlayer, useStreak, useSpeech
  lib/      claude (IA), classroom, sfx, speak (TTS), musicBus, seenQuestions
  data/     challenges, challengesExtra, levels, badges, missions, shop
public/   manifest.json, sw.js, zoe.jpg, foundation-logo.webp, iconos, manuales PDF
```

### Rutas (App.jsx)
`/` Home · `/empezar` Landing(onboarding perfil) · `/hub` Hub(mapa) · `/ronda/:world` Round ·
`/desafio/:world` Challenge · `/aula` Classroom · `/tienda` Shop · `/logros` Achievements ·
`/mision` Mission · `/docentes` TeacherPortal · `*` → `/`

### Game loop actual
`Home (splash + selección de modo)` → `Landing (onboarding perfil, 1ª vez)` →
`Hub (mapa de aventura + misiones diarias)` → `Round (5 preguntas, barra de tiempo)` →
`resultados (estrellas + XP + monedas)` → `Celebration (confetti + nivel/badges)` → vuelta al Hub.
Modo Aula: `Classroom` (setup → 20 preguntas/30s → resultados → ranking).

---

## 2. Estado guardado (localStorage)

| Clave | Contenido |
|-------|-----------|
| `ml_player_v1` | name, avatar, avatarName, ageGroup, school, team, **xp, level, streak**, lastPlayed, **coins, completed{}, unlockedBadges[], aiInteractions, owned[], pet, frame, daily{}** |
| `ml_seen_intro` | flag de onboarding ya visto |
| `ml_seen_q_v1` | preguntas ya vistas por mundo+edad (anti-repetición) |
| `ml_classroom_v1` | puntajes de Modo Aula (ranking local) |
| `ml_lang` | idioma es/pt |

Progresión actual (`levels.js`): **Aprendiz → Curioso → Pensador → Crítico → Filósofo**
(cortes 0/200/500/900/1400). Badges (`badges.js`): 8 medallas con `check(state)` automático.

---

## 3. NO ROMPER (crítico)

1. **Modelo de pensamiento abierto** — preguntas sin opción correcta; ZOE puntúa calidad (⭐1–3).
   Es la pedagogía central y una decisión tuya explícita.
2. **`ml_player_v1`** — progreso real de los chicos. Cualquier cambio de esquema debe migrar, no pisar.
3. **Bilingüe ES/PT vía `i18n.js`** — todo texto nuevo va al diccionario, en español neutro.
4. **ZOE** — foto real (`zoe.jpg`), marca registrada. No reemplazar por otra identidad.
5. **Branding Fundación** (`FoundationBadge`) global + datos legales (N.º 0008104315, email
   info@chrismeniwfoundation.org). No tocar.
6. **IA con `VITE_ANTHROPIC_API_KEY`** (en Vercel) + fallback sin clave. No exponer secretos al front.
7. **Música/SFX** (MusicEngine, sfx) y la **anti-repetición de preguntas** recién ajustadas.
8. **PWA** (manifest + sw.js) — la app instala y anda offline.
9. **Crédito Netlify de la web de la Fundación** — no deployar ahí por mi cuenta.

---

## 4. Mapeo plan → realidad (las 8 fases)

| Fase | Estado | Detalle |
|------|--------|---------|
| **0 Auditoría** | ✅ este archivo | — |
| **1 Game loop** | ✅ ~90% | Splash+modos (Home), onboarding (Landing+HowToPlay, flag `ml_seen_intro`), ronda de 5, resultado, recompensa (Celebration). Falta solo unificar como máquina de estados explícita (opcional; hoy es por rutas y funciona). |
| **2 Progresión** | ✅ adaptado | XP + 5 niveles + 8 badges + racha + persistencia ya existen. El esquema XP del plan (+10/−2 por correcto/incorrecto) **depende de la decisión B**. Badges nuevos (velocista, sin_errores) **asumen quiz**. |
| **3 Feedback emocional** | ✅ ~80% | Confetti CSS, mensajes rotativos, sonidos Web Audio, mascota/ZOE reaccionan, barra de tiempo con colores. Falta: `role="alert"` en feedback y `prefers-reduced-motion`. "Mostrar respuesta correcta + explicación" **depende de B**. |
| **4 ZOE** | ⚠️ parcial | ZOE existe (foto real, estados via `talking`). El plan pide **SVG con moods** y **click→pista**. La pista ya existe en Challenge; ZOE-como-botón-de-pista es **nuevo** y compatible. *(No cambiar la foto real por un SVG sin tu OK — es tu marca.)* |
| **5 Onboarding** | ✅ existe | HowToPlay (3 pasos) + Landing. Falta: botón "Saltar" siempre visible y separar el flag `ml_onboarded` del de perfil (hoy `ml_seen_intro`). |
| **6 Aula + Leaderboard** | ⚠️ local | Modo Aula + ranking ya existen **pero son locales** (localStorage), **no sincronizan entre dispositivos**. El "código entre dispositivos distintos" del plan **necesita backend** (hoy la app es estática). **Reto Diario compartible** (semilla por fecha + Web Share) es **nuevo y valioso**. |
| **7 Branding** | ✅ existe | FoundationBadge global + legal. Falta: revisar/medir que esté visible sin scroll en todas las pantallas + completar meta tags SEO (el bloque que pegaste vino vacío). |
| **8 UX móvil + A11y** | ⚠️ parcial | dvh, safe-area, min-h-touch (44px), inputs 16px, aria-labels ya están. **Faltan: `prefers-reduced-motion`, `:focus-visible`, `role="alert"`, auditar 375px sin scroll-x, y medir Lighthouse.** |

---

## 5. Orden propuesto por IMPACTO (lo que sí agrega valor sin romper)

**Tanda A — gana mucho, riesgo cero, no depende de decisiones (puedo hacerla ya):**
1. **A11y/UX (Fase 8 + 3):** `prefers-reduced-motion`, `:focus-visible`, `role="alert"` en feedback,
   auditoría 375px sin scroll horizontal. (Sube Lighthouse Accessibility.)
2. **Reto Diario compartible (Fase 6):** una pregunta abierta del día (semilla por fecha, igual para
   todos), resultado compartible con Web Share API + fallback copiar. Retención real.
3. **ZOE → pista (Fase 4):** tocar a ZOE da 1 pista de la pregunta actual (compatible con el modelo abierto).
4. **Onboarding (Fase 5):** "Saltar" siempre visible + flag `ml_onboarded` separado.
5. **SEO/meta (Fase 7):** completar title/description/OpenGraph (el bloque del plan llegó vacío).

**Tanda B — necesita TU decisión (§ siguiente):**
6. Modelo de respuesta: mantener pensamiento abierto (⭐ calidad) **vs** convertir a quiz correcto/incorrecto.
7. Modo Aula entre dispositivos reales: requiere backend (Vercel KV / Supabase / Firebase) y define costo.

---

## 6. Decisiones que necesito de vos

- **B1 (la grande):** ¿MenteLibre sigue siendo de **pensamiento abierto** (ZOE puntúa calidad, "no hay
  respuestas incorrectas") o lo convertimos a **opción múltiple** con respuesta correcta? La Fase 2/3 del
  plan asume lo segundo; vos pediste lo primero. **Recomiendo mantener el modelo abierto** (es tu
  diferencial pedagógico) y adaptar XP/badges/feedback a la calidad del pensamiento.
- **B2:** Modo Aula entre dispositivos reales necesita un backend pequeño (hoy es local). ¿Lo armamos
  (define un costo/servicio) o por ahora dejamos el ranking local + el Reto Diario compartible?

---

## 7. Conclusión

No hay que "transformar de básico a plataforma": **ya es una plataforma**. El mayor valor está en
(1) accesibilidad + pulido móvil, (2) Reto Diario compartible para retención, (3) ZOE más interactiva,
y (4) decidir el modelo de respuesta y si el aula sincroniza entre dispositivos. Arranco por la **Tanda A**
(cero riesgo) salvo que me digas otra cosa.
