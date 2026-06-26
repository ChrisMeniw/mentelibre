import { Routes, Route, Navigate } from 'react-router-dom'
import { useLang } from './i18n'
import WarpBackground from './components/WarpBackground'
import MusicEngine from './components/MusicEngine'
import BottomNav from './components/BottomNav'
import FoundationBadge from './components/FoundationBadge'
import Home from './pages/Home'
import Landing from './pages/Landing'
import Hub from './pages/Hub'
import Challenge from './pages/Challenge'
import Round from './pages/Round'
import Achievements from './pages/Achievements'
import TeacherPortal from './pages/TeacherPortal'
import Shop from './pages/Shop'

// Toggle de idioma visible en todas las pantallas (Paso 5)
function LangToggle() {
  const { lang, setLang } = useLang()
  const on = { background: 'var(--gold)', color: '#3B2A04' }
  const off = { color: 'var(--text-dim)' }
  return (
    <div className="fixed top-3 right-3 z-50 card flex gap-1 p-1 safe-top">
      <button onClick={() => setLang('es')} aria-label="Español" aria-pressed={lang === 'es'} className="px-3 py-2 rounded-full text-xs font-extrabold min-h-touch" style={lang === 'es' ? on : off}>🇦🇷 ES</button>
      <button onClick={() => setLang('pt')} aria-label="Português" aria-pressed={lang === 'pt'} className="px-3 py-2 rounded-full text-xs font-extrabold min-h-touch" style={lang === 'pt' ? on : off}>🇧🇷 PT</button>
    </div>
  )
}

export default function App() {
  return (
    <>
      <WarpBackground />
      <LangToggle />
      <main className="relative z-10 min-h-dvh">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empezar" element={<Landing />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/tienda" element={<Shop />} />
          <Route path="/ronda/:world" element={<Round />} />
          <Route path="/desafio/:world" element={<Challenge />} />
          <Route path="/logros" element={<Achievements />} />
          <Route path="/docentes" element={<TeacherPortal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
      <FoundationBadge />
      <MusicEngine />
    </>
  )
}
