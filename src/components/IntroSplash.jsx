import { useEffect, useRef } from 'react'
import { useLang } from '../i18n'
import { startIntroMusic, stopIntroMusic } from '../lib/introMusic'
import { enterGameplay, exitGameplay } from '../lib/musicBus'

// INTRO inspiradora (siempre al abrir): montaje cinematográfico de dos ilustraciones
// (un chico mirando un cielo de ideas: cerebro de luz → galaxia de sueños) que se
// funden con zoom lento, con música cálida y esperanzadora acorde al video.
// El primer toque enciende la música; el botón ¡Comenzar! entra al juego.
export default function IntroSplash({ onClose }) {
  const { t, lang } = useLang()
  const appName = lang === 'pt' ? 'Mente Livre' : 'Mente Libre'
  const musicStarted = useRef(false)

  // Mientras se ve la intro: silenciar la música del menú (arcade) y poner la inspiradora.
  useEffect(() => {
    enterGameplay()
    const onGesture = () => startMusic()
    window.addEventListener('pointerdown', onGesture, { once: false, passive: true })
    return () => {
      window.removeEventListener('pointerdown', onGesture)
      stopIntroMusic()
      exitGameplay()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startMusic() {
    if (musicStarted.current) return
    musicStarted.current = true
    startIntroMusic()
  }

  function enter() {
    stopIntroMusic()
    exitGameplay()      // el menú retoma su música al entrar
    onClose()
  }

  const sparkles = Array.from({ length: 14 }, (_, i) => ({
    left: (i * 37) % 100,
    delay: (i % 7) * 0.6,
    dur: 4 + (i % 5),
    size: 2 + (i % 3),
  }))

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      onPointerDown={startMusic}
      role="dialog"
      aria-label={appName}
    >
      <style>{`
        @keyframes introFadeA { 0%,40%{opacity:1} 50%,90%{opacity:0} 100%{opacity:1} }
        @keyframes introFadeB { 0%,40%{opacity:0} 50%,90%{opacity:1} 100%{opacity:0} }
        @keyframes introZoomIn  { from{transform:scale(1.04)} to{transform:scale(1.14)} }
        @keyframes introZoomOut { from{transform:scale(1.14)} to{transform:scale(1.04)} }
        @keyframes introSpark { 0%{transform:translateY(8px);opacity:0} 25%{opacity:1} 100%{transform:translateY(-60px);opacity:0} }
        .intro-imgA{animation:introFadeA 15s ease-in-out infinite, introZoomIn 15s ease-in-out infinite alternate}
        .intro-imgB{animation:introFadeB 15s ease-in-out infinite, introZoomOut 15s ease-in-out infinite alternate}
        @media (prefers-reduced-motion: reduce){
          .intro-imgA,.intro-imgB{animation:none}
          .intro-imgB{opacity:0}
        }
      `}</style>

      {/* Base opaca: evita que se transparente el fondo durante el cruce de imágenes */}
      <div className="absolute inset-0" style={{ background: '#0b0518' }} />

      {/* Montaje cinematográfico (dos ilustraciones que se funden) */}
      <img src="/intro-1.png" alt="" aria-hidden className="intro-imgA absolute inset-0 w-full h-full object-cover" />
      <img src="/intro-2.png" alt="" aria-hidden className="intro-imgB absolute inset-0 w-full h-full object-cover" />

      {/* Velo para legibilidad: claro arriba (que se vea el cielo) y oscuro abajo (texto) */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,6,23,0.15) 0%, rgba(10,6,23,0.35) 45%, rgba(10,6,23,0.92) 100%)' }} />

      {/* Chispas de imaginación que suben */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {sparkles.map((s, i) => (
          <span key={i} className="absolute rounded-full"
            style={{
              left: s.left + '%', bottom: '32%', width: s.size, height: s.size,
              background: i % 3 ? 'rgba(251,191,36,0.9)' : 'rgba(255,255,255,0.9)',
              boxShadow: '0 0 6px rgba(251,191,36,0.8)',
              animation: `introSpark ${s.dur}s ease-out ${s.delay}s infinite`,
            }} />
        ))}
      </div>

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-16 px-6 text-center safe-top">
        <img
          src="/foundation-logo.webp" alt="Chris Meniw Foundation" width="76" height="76"
          className="rounded-full floaty fade-in"
          style={{ width: 76, height: 76, filter: 'drop-shadow(0 8px 24px rgba(124,58,237,0.7))' }}
        />
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/75 mt-2 font-extrabold fade-in">Chris Meniw Foundation</div>
        <h1 className="font-logo text-6xl grad-text leading-none mt-2 fade-in-d1" style={{ textShadow: '0 6px 30px rgba(124,58,237,0.6)' }}>{appName}</h1>
        <div className="text-[var(--gold)] font-extrabold mt-2 text-glow fade-in-d1">✨ {t('tagline')}</div>
        <div className="text-[15px] font-bold text-white mt-4 max-w-xs leading-snug fade-in-d2">{t('homeWelcome')}</div>

        <button
          onClick={enter}
          className="btn btn-gold mt-6 text-lg px-12 min-h-touch glow-pulse fade-in-d3"
          aria-label={t('introStart')}
        >
          {t('introStart')}
        </button>
        <div className="text-[10px] text-white/60 mt-3 fade-in-d3">{t('introTapHint')}</div>
      </div>
    </div>
  )
}
