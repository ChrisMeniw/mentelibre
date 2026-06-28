import { useLang } from '../i18n'

// INTRO inspiradora y DINÁMICA (siempre al abrir): montaje cinematográfico de dos
// ilustraciones (cerebro de ideas → galaxia de sueños) con paneo+zoom continuo,
// chispas que suben, título centrado con halo que respira. La música enérgica
// (estilo Fortnite/Roblox) la pone el MusicEngine global y sigue al entrar al menú.
export default function IntroSplash({ onClose }) {
  const { t, lang } = useLang()
  const appName = lang === 'pt' ? 'Mente Livre' : 'Mente Libre'

  const sparkles = Array.from({ length: 22 }, (_, i) => ({
    left: (i * 53) % 100,
    bottom: 16 + (i * 31) % 62,
    delay: (i % 9) * 0.5,
    dur: 3.4 + (i % 6),
    size: 2 + (i % 4),
    gold: i % 3 !== 0,
  }))

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" role="dialog" aria-label={appName}>
      <style>{`
        @keyframes introFadeA { 0%,42%{opacity:1} 50%,92%{opacity:0} 100%{opacity:1} }
        @keyframes introFadeB { 0%,42%{opacity:0} 50%,92%{opacity:1} 100%{opacity:0} }
        @keyframes kenMove1 { 0%{transform:scale(1.06) translate(-1.5%,1.5%)} 100%{transform:scale(1.18) translate(1.5%,-2.5%)} }
        @keyframes kenMove2 { 0%{transform:scale(1.18) translate(1.5%,-2.5%)} 100%{transform:scale(1.06) translate(-1.5%,1.5%)} }
        @keyframes introSpark { 0%{transform:translateY(10px) scale(0.6);opacity:0} 20%{opacity:1} 100%{transform:translateY(-90px) scale(1);opacity:0} }
        @keyframes titleBreathe { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-4px) scale(1.015)} }
        @keyframes haloBreathe { 0%,100%{opacity:0.45;transform:scale(1)} 50%{opacity:0.85;transform:scale(1.14)} }
        .ken-a{animation:introFadeA 14s ease-in-out infinite, kenMove1 14s ease-in-out infinite alternate}
        .ken-b{animation:introFadeB 14s ease-in-out infinite, kenMove2 14s ease-in-out infinite alternate}
        .title-breathe{animation:titleBreathe 5s ease-in-out infinite}
        .halo-breathe{animation:haloBreathe 4s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){ .ken-a,.ken-b,.title-breathe,.halo-breathe{animation:none} .ken-b{opacity:0} }
      `}</style>

      {/* Base opaca: evita transparencias durante el cruce de imágenes */}
      <div className="absolute inset-0" style={{ background: '#0b0518' }} />

      {/* Montaje cinematográfico con paneo + zoom continuo (no estático) */}
      <img src="/intro-1.png" alt="" aria-hidden className="ken-a absolute inset-0 w-full h-full object-cover" />
      <img src="/intro-2.png" alt="" aria-hidden className="ken-b absolute inset-0 w-full h-full object-cover" />

      {/* Velo: oscuro arriba y abajo para leer, deja respirar el centro */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,6,23,0.55) 0%, rgba(10,6,23,0.16) 27%, rgba(10,6,23,0.32) 52%, rgba(10,6,23,0.88) 100%)' }} />

      {/* Chispas de imaginación que suben */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {sparkles.map((s, i) => (
          <span key={i} className="absolute rounded-full" style={{
            left: s.left + '%', bottom: s.bottom + '%', width: s.size, height: s.size,
            background: s.gold ? 'rgba(251,191,36,0.95)' : 'rgba(255,255,255,0.95)',
            boxShadow: s.gold ? '0 0 8px rgba(251,191,36,0.9)' : '0 0 8px rgba(255,255,255,0.85)',
            animation: `introSpark ${s.dur}s ease-out ${s.delay}s infinite`,
          }} />
        ))}
      </div>

      {/* Contenido — centrado vertical: título en el tercio superior, CTA debajo */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center safe-top">
        <img src="/foundation-logo.webp" alt="Chris Meniw Foundation" width="70" height="70"
          className="rounded-full floaty fade-in" style={{ width: 70, height: 70, filter: 'drop-shadow(0 8px 24px rgba(124,58,237,0.75))' }} />
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/80 mt-2 font-extrabold fade-in">Chris Meniw Foundation</div>

        <div className="relative mt-1">
          <span aria-hidden className="halo-breathe absolute inset-0 -z-10"
            style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.6), transparent 65%)', filter: 'blur(22px)' }} />
          <h1 className="title-breathe font-logo text-7xl grad-text leading-none fade-in-d1" style={{ textShadow: '0 6px 34px rgba(124,58,237,0.7)' }}>{appName}</h1>
        </div>
        <div className="text-[var(--gold)] font-extrabold mt-3 text-glow fade-in-d1">✨ {t('tagline')}</div>

        <div className="text-[15px] font-bold text-white mt-6 max-w-xs leading-snug fade-in-d2"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.85)' }}>{t('homeWelcome')}</div>

        <button onClick={onClose} className="btn btn-gold mt-7 text-lg px-12 min-h-touch glow-pulse fade-in-d3" aria-label={t('introStart')}>
          {t('introStart')}
        </button>
        <div className="text-[11px] text-white/70 mt-3 fade-in-d3">{t('introTapHint')}</div>
      </div>
    </div>
  )
}
