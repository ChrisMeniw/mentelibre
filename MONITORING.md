# Monitoreo de MenteLibre

Guía para el dueño del repo (Chris Meniw). Estos pasos se hacen UNA vez, a mano, y
protegen al juego de las "muertes" más probables: caída silenciosa del sitio, gasto
de API descontrolado y vencimiento del dominio. Todo con herramientas gratis.

URL en vivo: **https://mentelibre.chrismeniwfoundation.org**

---

## Paso 1 — UptimeRobot (gratis): aviso si el sitio se cae

1. Entra a https://uptimerobot.com y crea una cuenta gratuita.
2. **Add New Monitor**:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: `MenteLibre`
   - URL: `https://mentelibre.chrismeniwfoundation.org`
   - Monitoring Interval: **cada 5 minutos**
3. **Alert Contacts**: agrega tu email y (opcional) tu teléfono por SMS.
4. Guarda. Si el sitio deja de responder, te llega el aviso enseguida.

> Tip: agrega un 2º monitor a `https://mentelibre.chrismeniwfoundation.org/api/tts?tl=es&q=hola`
> para vigilar también que la voz (proxy TTS) siga funcionando.

---

## Paso 2 — Alerta de gasto de la API de Claude

1. Entra a https://console.anthropic.com → **Billing / Limits**.
2. Pon una **alerta de gasto** en **US$10/mes**.
3. Pon un **límite duro** en **US$25/mes** (corta el gasto si algo se dispara).

Así, aunque ZOE reciba muchísimas preguntas, el costo nunca se vuelve una hemorragia.

> En el código ya hay una red de seguridad: si la API de ZOE falla 3 veces seguidas,
> la consola registra `ALERT: ZOE API down — notify Chris Meniw` (ver `notifyAdmin()`
> en `src/lib/claude.js`). Más adelante se puede enganchar a un webhook real.

---

## Paso 3 — Aviso de vencimiento del dominio

1. Revisa cuándo vence **chrismeniwfoundation.org** (en tu proveedor de dominio).
2. Pon un recordatorio en el calendario **60 días antes** del vencimiento.
3. Activa la **renovación automática** si el proveedor lo permite.

Un dominio vencido = el juego desaparece de golpe para cada escuela que lo adoptó.
Este recordatorio lo evita.

---

### Resumen

| Riesgo | Defensa | Costo |
|---|---|---|
| El sitio se cae sin que nadie lo note | UptimeRobot cada 5 min | Gratis |
| Gasto de API descontrolado | Alerta US$10 + tope US$25 + `notifyAdmin()` | Gratis |
| El dominio vence | Recordatorio 60 días + auto-renovación | Gratis |
