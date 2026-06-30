import { useLang } from '../i18n'

// Hero del logo a TODO EL ANCHO, fundido con el fondo cósmico (sin recuadro ni sombra de
// "foto"). La imagen (logo-hero.webp) ya trae un margen oscuro arriba y abajo; la máscara
// lo desvanece en los bordes para que se integre con el fondo animado de la página.
const MASK = 'linear-gradient(to bottom, transparent 0%, #000 11%, #000 82%, transparent 100%)'

export default function LogoHero({ px = 1.25, pullTop = 3, showTagline = true }) {
  const { t, lang } = useLang()
  const appName = lang === 'pt' ? 'Mente Livre' : 'Mente Libre'
  return (
    <>
      <div className="fade-in" style={{ marginLeft: `-${px}rem`, marginRight: `-${px}rem`, marginTop: pullTop ? `-${pullTop}rem` : undefined }}>
        <img
          src="/logo-hero.webp"
          alt={appName + ' · ZOE'}
          width="1200"
          height="1270"
          loading="eager"
          className="w-full block select-none"
          style={{ WebkitMaskImage: MASK, maskImage: MASK }}
        />
      </div>
      {showTagline && (
        <div className="text-center text-[var(--gold)] font-extrabold text-glow fade-in-d1" style={{ marginTop: '-2.9rem', fontSize: '17px' }}>
          ✨ {t('tagline')}
        </div>
      )}
    </>
  )
}
