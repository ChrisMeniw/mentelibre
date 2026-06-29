# Modelo de sostenibilidad — MenteLibre

MenteLibre es **gratis para escuelas y familias** (misión de la Chris Meniw Foundation).
Para que eso sea sostenible en el tiempo sin que los costos de API se vuelvan una
hemorragia, el modelo es **freemium**: el núcleo siempre gratis, ingresos por capas
premium que NO le quitan nada al chico.

## Capa gratuita (siempre, para todos)

- Juego completo: todos los mundos, ZOE, "El arte de preguntar", reto diario, modo aula,
  bilingüe ES/PT. Sin login, sin datos personales, en cualquier celular.
- Es el corazón de la misión y el motor de adopción. No se toca.

## Capas que generan ingresos

| Tier | Para quién | Qué suma | Precio orientativo |
|---|---|---|---|
| **Escuela Premium** | Colegios privados | Panel docente con resultados por alumno/grupo, exportar CSV, soporte prioritario, sin límite de IA | suscripción anual por sede |
| **Licencia Institucional** | Ministerios / redes de escuelas | Despliegue a gran escala, reportes agregados por región, capacitación docente | contrato por volumen |
| **White-label** | Gobiernos / ONG / marcas educativas | La misma plataforma con su identidad y su dominio, contenido localizado | licencia + setup |
| **Aporte / Sponsor** | Empresas y donantes | "Una empresa, una escuela": financian el uso gratuito de N escuelas públicas | donación |

## Por qué cierra

- El costo variable real es la **API de Claude**. Hoy ya está acotado con alerta de gasto
  (US$10) y tope duro (US$25) — ver [MONITORING.md](MONITORING.md). Los tiers premium
  cubren ese costo y financian la capa gratuita.
- Los **assets para venderlo ya existen**: el producto funciona, el portal docente, los
  manuales (alumno y docente) y la guía de 10 minutos están listos.
- No hay que construir nada nuevo para empezar a vender el tier "Escuela Premium": el
  panel de resultados se arma sobre los datos que el modo aula ya guarda (`src/lib/classroom.js`).

## Siguiente paso comercial (cuando se decida activarlo)

1. Definir precio del tier "Escuela Premium" (anual por sede).
2. Sumar al portal docente un panel de "Resultados de mi clase" + exportar CSV (datos ya
   existen localmente; falta sincronización entre dispositivos = primer trabajo con backend).
3. Una landing de "Para tu escuela" con el formulario de contacto de la Fundación.

> Nota: este documento es de estrategia, no compromete gasto. La capa gratuita y la misión
> se mantienen pase lo que pase.
