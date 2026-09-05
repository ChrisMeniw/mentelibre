import { useState } from 'react'
import { useLang } from '../i18n'
import { kickMusic } from '../lib/musicControl'

const SLOW = 0.6 // el video va un poco más lento (calmo/cinematográfico)

// INTRO: el título "Mente Libre" + ZOE + botón aparecen AL INSTANTE, con el VIDEO
// cósmico (clip libre Pexels, comprimido a 3MB) reproduciéndose de fondo desde que carga.
export default function IntroSplash({ onClose }) {
  const { t, lang, setLang } = useLang()
  const appName = lang === 'pt' ? 'Mente Livre' : 'Mente Libre'
  const LANGS = [['es', '🇦🇷 ES', 'Español'], ['pt', '🇧🇷 PT', 'Português'], ['en', '🇺🇸 EN', 'English']]
  // El TÍTULO aparece AL INSTANTE (pedido de Chris): nada de esperar al video.
  // El video cósmico se reproduce DETRÁS desde que carga; si tarda, el título ya está.
  const [phase, setPhase] = useState('content')
  const showContent = phase === 'content'

  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    left: (i * 53) % 100,
    bottom: 16 + (i * 31) % 62,
    delay: (i % 9) * 0.5,
    dur: 3.4 + (i % 6),
    size: 2 + (i % 4),
    gold: i % 3 !== 0,
  }))

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" role="dialog" aria-label={appName} onPointerDown={() => kickMusic()}>
      <style>{`
        @keyframes introSpark { 0%{transform:translateY(10px) scale(0.6);opacity:0} 20%{opacity:1} 100%{transform:translateY(-90px) scale(1);opacity:0} }
        @keyframes titleBreathe { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-4px) scale(1.015)} }
        @keyframes haloBreathe { 0%,100%{opacity:0.45;transform:scale(1)} 50%{opacity:0.85;transform:scale(1.14)} }
        .title-breathe{animation:titleBreathe 5s ease-in-out infinite}
        .halo-breathe{animation:haloBreathe 4s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){ .title-breathe,.halo-breathe{animation:none} }
      `}</style>

      {/* Base opaca por si el video tarda en pintar */}
      <div className="absolute inset-0" style={{ background: '#0b0518' }} />

      {/* VIDEO real de fondo (galaxia cósmica en movimiento) — PROTAGONISTA al comienzo */}
      <video
        autoPlay muted loop playsInline aria-hidden preload="auto"
        onLoadedMetadata={(e) => { e.currentTarget.playbackRate = SLOW }}
        onLoadedData={(e) => { e.currentTarget.play().catch(() => {}) }}
        onCanPlay={(e) => { e.currentTarget.play().catch(() => {}) }}
        onPlay={(e) => { e.currentTarget.playbackRate = SLOW }}

        onError={() => setPhase('content')}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'saturate(1.12) contrast(1.05)' }}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* Velo: TENUE mientras se ve el video; se OSCURECE al aparecer el contenido (para leer el texto) */}
      <div className="absolute inset-0 transition-opacity duration-700" style={{
        opacity: showContent ? 1 : 0.22,
        background: 'linear-gradient(180deg, rgba(10,6,23,0.55) 0%, rgba(10,6,23,0.15) 30%, rgba(10,6,23,0.45) 60%, rgba(10,6,23,0.92) 100%)',
      }} />

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

      {/* Selector de idioma — GRANDE y visible en la portada (ES / PT / EN) */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center pt-3 safe-top pointer-events-none">
        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 pointer-events-auto"
          style={{ background: 'rgba(11,5,24,0.72)', border: '2px solid var(--gold)', backdropFilter: 'blur(6px)', boxShadow: '0 6px 22px rgba(0,0,0,0.45)' }}>
          <span className="text-lg pl-0.5" aria-hidden>🌐</span>
          {LANGS.map(([code, label, name]) => (
            <button key={code} onClick={(e) => { e.stopPropagation(); setLang(code) }}
              aria-label={name} aria-pressed={lang === code}
              className="px-3.5 py-2 rounded-full text-sm font-extrabold min-h-touch transition-colors"
              style={lang === code ? { background: 'var(--gold)', color: '#3B2A04' } : { color: '#ffffff' }}>
              {label}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-white/70 font-bold mt-1 pointer-events-none">🇧🇷 Português disponível</div>
      </div>

      {/* Título "Mente Libre" + ZOE + botón — visibles AL INSTANTE, con el video detrás */}
      <div className={'relative z-10 h-full flex flex-col items-center justify-center px-6 text-center safe-top transition-all duration-700 ' + (showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none')}>
        <img src="/foundation-logo.webp" alt="Chris Meniw Foundation" width="56" height="56"
          className="rounded-full floaty" style={{ width: 56, height: 56, filter: 'drop-shadow(0 8px 24px rgba(124,58,237,0.75))' }} />
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/80 mt-1.5 font-extrabold">Chris Meniw Foundation</div>

        <div className="relative mt-1">
          <span aria-hidden className="halo-breathe absolute inset-0 -z-10"
            style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.6), transparent 65%)', filter: 'blur(22px)' }} />
          <h1 className="title-breathe font-logo text-6xl grad-text leading-none" style={{ textShadow: '0 6px 34px rgba(124,58,237,0.7)' }}>{appName}</h1>
        </div>
        <div className="text-[var(--gold)] font-extrabold mt-2 text-glow">✨ {t('tagline')}</div>

        {/* ZOE — primera profesora IA de LATAM */}
        <div className="mt-5 flex flex-col items-center">
          <img src="/zoe-portal-v10.webp" alt="ZOE" width="80" height="80" className="floaty"
            style={{ width: 80, height: 80, borderRadius: '9999px', objectFit: 'cover', border: '2.5px solid rgba(168,85,247,0.9)', boxShadow: '0 0 28px rgba(168,85,247,0.7)' }} />
          <div className="mt-2 font-logo text-xl grad-text leading-none">ZOE</div>
          <div className="text-[11px] text-[var(--violet-light)] font-extrabold uppercase tracking-wide">{t('zoeTitle')}</div>
        </div>

        <div className="text-2xl font-extrabold text-white mt-4 max-w-sm leading-tight"
          style={{ textShadow: '0 3px 18px rgba(0,0,0,0.95)' }}>{t('homeWelcome')}</div>
        <div className="text-[13px] font-bold text-white/85 mt-1.5" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}>
          🎯 {t('goalShort')}
        </div>

        <button onClick={() => { kickMusic(); onClose() }} className="btn btn-gold mt-5 text-lg px-12 min-h-touch glow-pulse" aria-label={t('introStart')}>
          {t('introStart')}
        </button>
      </div>
    </div>
  )
}
