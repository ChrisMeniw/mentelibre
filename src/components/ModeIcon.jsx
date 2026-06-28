// Set de íconos propio y cohesivo (duotono) para los modos de juego.
// Reemplaza los emoji (que se veían amateur) por un lenguaje visual consistente:
// mismo grosor de trazo, esquinas redondeadas, relleno de acento sutil.
// `accent` colorea el glifo; en tarjetas primarias se pasa blanco.

const GLYPHS = {
  // Aventura individual — cohete (jugar / despegar)
  solo: (a) => (
    <>
      <path d="M12 2.5c2.7 1.6 4 4.8 4 8 0 1.6-.4 3-1 4.2H9c-.6-1.2-1-2.6-1-4.2 0-3.2 1.3-6.4 4-8Z"
        fill={a} fillOpacity="0.18" stroke={a} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="1.8" stroke={a} strokeWidth="1.6" />
      <path d="M9 15.2c-1.4.5-2.3 1.7-2.6 3.6 1.9-.2 3-.9 3.6-2M15 15.2c1.4.5 2.3 1.7 2.6 3.6-1.9-.2-3-.9-3.6-2"
        stroke={a} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 19.5h2" stroke={a} strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  // Competencia en grupo — dos personas
  group: (a) => (
    <>
      <circle cx="9" cy="8" r="2.6" fill={a} fillOpacity="0.18" stroke={a} strokeWidth="1.6" />
      <path d="M4.5 18.5c0-2.9 2-4.6 4.5-4.6s4.5 1.7 4.5 4.6" fill={a} fillOpacity="0.18"
        stroke={a} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16.2" cy="9" r="2.1" stroke={a} strokeWidth="1.5" />
      <path d="M14 14.4c1.9-.4 5.4.6 5.4 4.1" stroke={a} strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  // Ranking de escuelas — trofeo
  ranking: (a) => (
    <>
      <path d="M8 4h8v3.2a4 4 0 0 1-8 0V4Z" fill={a} fillOpacity="0.18" stroke={a} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 5.2H5.6A2.4 2.4 0 0 0 8 8.4M16 5.2h2.4A2.4 2.4 0 0 1 16 8.4" stroke={a} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 11.2v2.6" stroke={a} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 19.5c0-1.4 1.3-2.4 3-2.4s3 1 3 2.4Z" fill={a} fillOpacity="0.18" stroke={a} strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  // El arte de preguntar — chispa/idea (bombilla con destello)
  ask: (a) => (
    <>
      <path d="M12 3.2A5.4 5.4 0 0 1 15.4 12.8c-.7.6-1.1 1.4-1.1 2.3H9.7c0-.9-.4-1.7-1.1-2.3A5.4 5.4 0 0 1 12 3.2Z"
        fill={a} fillOpacity="0.18" stroke={a} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9.8 17.4h4.4M10.7 19.6h2.6" stroke={a} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M18.5 5.2l.7-1.7.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7Z" fill={a} stroke={a} strokeWidth="0.8" strokeLinejoin="round" />
    </>
  ),
  // Reto diario — llama
  daily: (a) => (
    <>
      <path d="M12 2.8c.6 2.6-1.3 3.7-1.3 5.8 0 .9.6 1.6 1.3 1.6.7 0 1.1-.5 1.3-1.1 1.4 1 2.4 2.6 2.4 4.6a3.7 3.7 0 0 1-7.4 0c0-1.9.9-3.4 1.9-4.7C11.2 8 12 6.5 12 2.8Z"
        fill={a} fillOpacity="0.2" stroke={a} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 19.6c1.1 0 1.9-.8 1.9-1.8 0-.8-.5-1.4-1.1-2-.4.6-.9.7-1.3.5-.5 1-1.4 1.4-1.4 1.5 0 1 .8 1.8 1.9 1.8Z" fill={a} fillOpacity="0.5" />
    </>
  ),
  // Candado (modo bloqueado)
  lock: (a) => (
    <>
      <rect x="5.5" y="10" width="13" height="9.2" rx="2.2" fill={a} fillOpacity="0.18" stroke={a} strokeWidth="1.6" />
      <path d="M8.3 10V7.8a3.7 3.7 0 0 1 7.4 0V10" stroke={a} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="14.4" r="1.3" fill={a} />
      <path d="M12 15.4v1.8" stroke={a} strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
}

export default function ModeIcon({ name, accent = '#A855F7', size = 26 }) {
  const glyph = GLYPHS[name] || GLYPHS.solo
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block' }}>
      {glyph(accent)}
    </svg>
  )
}
