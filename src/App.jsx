import { useState } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useLang } from './i18n'
import WarpBackground from './components/WarpBackground'
import AudioMusic from './components/AudioMusic'
import IntroSplash from './components/IntroSplash'
import BottomNav from './components/BottomNav'
import FoundationBadge from './components/FoundationBadge'
import Home from './pages/Home'
import Daily from './pages/Daily'
import Ask from './pages/Ask'
import Characters from './pages/Characters'
import Mission from './pages/Mission'
import Classroom from './pages/Classroom'
import Landing from './pages/Landing'
import Hub from './pages/Hub'
import Challenge from './pages/Challenge'
import Round from './pages/Round'
import Achievements from './pages/Achievements'
import TeacherPortal from './pages/TeacherPortal'
import Shop from './pages/Shop'

// Al pasar de un planeta a otro (auto-avance), `key` fuerza remontar la ronda
// para que reinicie limpia (preguntas, tiempo, racha).
function RoundRoute() {
  const { world } = useParams()
  return <Round key={world} />
}

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
  // La intro se muestra SIEMPRE al abrir el juego (cada carga de página).
  const [showIntro, setShowIntro] = useState(true)
  return (
    <>
      {showIntro && <IntroSplash onClose={() => setShowIntro(false)} />}
      <WarpBackground />
      <LangToggle />
      <main className="relative z-10 min-h-dvh">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reto" element={<Daily />} />
          <Route path="/preguntar" element={<Ask />} />
          <Route path="/personajes" element={<Characters />} />
          <Route path="/mision" element={<Mission />} />
          <Route path="/aula" element={<Classroom />} />
          <Route path="/empezar" element={<Landing />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/tienda" element={<Shop />} />
          <Route path="/ronda/:world" element={<RoundRoute />} />
          <Route path="/desafio/:world" element={<Challenge />} />
          <Route path="/logros" element={<Achievements />} />
          <Route path="/docentes" element={<TeacherPortal />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
      <FoundationBadge />
      <AudioMusic />
    </>
  )
}
