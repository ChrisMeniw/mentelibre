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
        {/* BASE CLARA: un disco blanco luminoso detrás del logo, para que NUNCA se vea
            oscuro sobre el fondo negro de la app. El logo se apoya sobre el blanco => brilla. */}
        <div
          className="relative grid place-items-center"
          style={{
            width: size, height: size, borderRadius: '9999px', padding: Math.round(size * 0.1),
            background: 'radial-gradient(circle at 50% 36%, #ffffff 0%, #f3f1ff 64%, #e3e0ff 100%)',
            boxShadow: '0 0 0 3px rgba(196,181,253,0.9), 0 12px 34px -6px rgba(168,85,247,0.85), inset 0 2px 6px rgba(255,255,255,0.9)',
          }}
        >
          <img
            src="/foundation-logo.webp"
            alt="Chris Meniw Foundation"
            width={size}
            height={size}
            loading="eager"
            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '9999px' }}
          />
        </div>
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
