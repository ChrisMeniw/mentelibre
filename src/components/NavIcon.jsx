// Íconos de la barra inferior — set propio de línea. Usan currentColor para
// heredar el dorado (activo) o el gris (inactivo) sin lógica extra.
const N = {
  home: (
    <>
      <path d="M4 11.2 12 4l8 7.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinejoin="round" />
      <path d="M10 19v-4.5h4V19" strokeLinejoin="round" />
    </>
  ),
  shop: (
    <>
      <path d="M6 8h12l-1 11H7L6 8Z" strokeLinejoin="round" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9.5" r="5" />
      <path d="M9 13.6 7.7 20l4.3-2.4L16.3 20 15 13.6" strokeLinejoin="round" />
      <path d="M12 7.3l.9 1.8 2 .3-1.45 1.4.34 2L12 11.8l-1.8.95.34-2L9.1 9.4l2-.3.9-1.8Z" strokeLinejoin="round" />
    </>
  ),
  teacher: (
    <>
      <path d="M12 4 3 8.2l9 4.2 9-4.2L12 4Z" strokeLinejoin="round" />
      <path d="M7 10.2v4.3c0 1.4 2.4 2.6 5 2.6s5-1.2 5-2.6v-4.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 8.4v4.2" strokeLinecap="round" />
    </>
  ),
}

export default function NavIcon({ name, size = 23 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" aria-hidden="true" style={{ display: 'block' }}>
      {N[name] || N.home}
    </svg>
  )
}
