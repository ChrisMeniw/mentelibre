# 🧠 MenteLibre · MenteLivre

![Gratis para escuelas](https://img.shields.io/badge/Gratis-para%20escuelas-10B981?style=for-the-badge)
![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-7C3AED?style=for-the-badge)
![PWA](https://img.shields.io/badge/Instalable-en%20el%20celular-0EA5E9?style=for-the-badge)

Juego educativo de **pensamiento crítico con IA** para chicos de 6 a 15 años. Bilingüe (🇦🇷 Español / 🇧🇷 Português), gratis para escuelas. Una iniciativa de la **Fundación Chris Meniw**.

> El nombre cambia con el idioma: **MenteLibre** (ES) / **MenteLivre** (PT).

---

## ✨ Qué incluye
- 4 mundos × 3 grupos de edad = **60 desafíos** de pensamiento crítico, en ES y PT.
- Mentor con **IA (Claude)**: pistas socráticas y devoluciones personalizadas (nunca dice que está "mal").
- Fondo espacial **warp** animado + **música procedural** generada en el navegador (Web Audio, sin archivos).
- Niveles, **medallas**, rachas, equipos, ranking de escuelas y portal docente.
- **Instalable en el celular** (PWA: "Agregar a pantalla de inicio") y 100% responsive.

## 🧰 Stack
**React + Vite + Tailwind CSS + Anthropic Claude.** Estado del jugador en `localStorage`. Router con `react-router-dom`.

---

## 🚀 Deploy en 3 pasos

```bash
# 1) Clonar e instalar
git clone <tu-repo> mentelibre && cd mentelibre && npm install

# 2) Configurar la clave (copiá .env.example a .env y pegá tu clave)
cp .env.example .env   # editá VITE_ANTHROPIC_API_KEY

# 3) Publicar
vercel deploy          # o: importá el repo en vercel.com
```

En local: `npm run dev` (http://localhost:5173) · build de producción: `npm run build`.

## 🔑 Variable de entorno requerida

| Variable | Descripción |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | Tu clave de la API de Anthropic (Claude). En Vercel se agrega en **Settings → Environment Variables**. |

> La app funciona sin clave para demostración (usa respuestas de respaldo); con la clave, las devoluciones son personalizadas por IA.

## ⚠️ Nota de seguridad (producción)
Para el **prototipo escolar**, la clave se usa directo desde el navegador (`import.meta.env.VITE_ANTHROPIC_API_KEY`). Esto **expone la clave** en el bundle.
Para **producción**, poné un **backend proxy** (una pequeña función serverless que reciba el mensaje del alumno, agregue la clave del lado del servidor y reenvíe a `api.anthropic.com`). Así la clave nunca viaja al navegador.

## 📱 Instalar en el celular
Abrí la URL publicada en el teléfono → menú del navegador → **"Agregar a pantalla de inicio"**. Queda como una app, a pantalla completa.

## 📨 Contacto
**fundacion@chrismeniw.com** · [www.chrismeniw.com](https://www.chrismeniw.com)

## 📄 Licencia
MIT © Fundación Chris Meniw
