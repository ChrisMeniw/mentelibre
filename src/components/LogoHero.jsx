import { useLang } from '../i18n'

// Logo RENDERIZADO por la app (no una foto rectangular pegada): ZOE recortada en círculo,
// con el fondo de la foto quitado (se funde en un "portal" violeta oscuro) + el título
// "Mente Libre" como TEXTO con el degradé de la marca + tagline. Elementos nativos => nunca
// se ve como imagen pegada.
export default function LogoHero({ size = 132, showTagline = true }) {
  const { t, lang } = useLang()
  const appName = lang === 'pt' ? 'Mente Livre' : 'Mente Libre'
  const glow = size + 88
  return (
    <div className="text-center">
      <div className="relative inline-grid place-items-center fade-in">
        <span aria-hidden className="absolute rounded-full" style={{
          width: glow, height: glow, left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(168,85,247,0.5), rgba(124,58,237,0.18) 46%, transparent 72%)',
        }} />
        <img
          src="/zoe-portal.webp"
          alt="ZOE"
          width={size}
          height={size}
          loading="eager"
          style={{ width: size, height: size, borderRadius: '9999px', boxShadow: '0 0 0 2px rgba(196,181,253,0.65), 0 0 32px -2px rgba(168,85,247,0.8)' }}
        />
      </div>
      <h1 className="font-logo grad-text leading-none fade-in-d1"
        style={{ fontSize: 'clamp(46px, 14vw, 66px)', marginTop: 14, textShadow: '0 6px 34px rgba(124,58,237,0.65)' }}>
        {appName}
      </h1>
      {showTagline && (
        <div className="text-[var(--gold)] font-extrabold text-glow fade-in-d2" style={{ marginTop: 10, fontSize: 17 }}>
          ✨ {t('tagline')}
        </div>
      )}
    </div>
  )
}
