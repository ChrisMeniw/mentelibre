import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { useStreak } from '../hooks/useStreak'
import { avatarByEmoji } from '../components/AvatarPicker'
import { frameById, petById } from '../data/shop'
import { sfxPop } from '../lib/sfx'
import XPBar from '../components/XPBar'
import SchoolBanner from '../components/SchoolBanner'
import RankingTable from '../components/RankingTable'
import TeamTab from '../components/TeamTab'
import Mascot from '../components/Mascot'
import AdventureMap from '../components/AdventureMap'
import HowToPlay from '../components/HowToPlay'

function PlayerHeader({ onChangeUser }) {
  const { player } = usePlayer()
  const { t } = useLang()
  const nav = useNavigate()
  const av = avatarByEmoji(player.avatar)
  const frame = frameById(player.frame)
  const pet = petById(player.pet)
  return (
    <div className="card p-4 fade-in">
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center shrink-0">
          <div className="relative">
            <div
              className="w-14 h-14 rounded-full grid place-items-center p-[3px]"
              style={frame
                ? { background: frame.ring, boxShadow: `0 0 22px -4px ${frame.glow}` }
                : { background: 'transparent', boxShadow: `0 0 0 2px rgba(255,255,255,0.22), 0 0 24px -4px ${av.color}` }}
            >
              <div className="w-full h-full rounded-full grid place-items-center text-3xl" style={{ background: av.color }}>
                {player.avatar}
              </div>
            </div>
            {pet && <span className="absolute -top-1.5 -right-2 text-lg floaty">{pet.emoji}</span>}
          </div>
          <span className="text-[10px] font-extrabold text-[var(--violet-light)] mt-0.5">{player.avatarName}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => { sfxPop(); onChangeUser && onChangeUser() }}
              className="flex items-center gap-1 min-w-0 active:scale-95 transition"
              aria-label={t('changeUser')}
            >
              <span className="font-extrabold truncate text-lg">{player.name || '—'}</span>
              <span className="text-xs opacity-70 shrink-0">🔁</span>
            </button>
            <button
              onClick={() => { sfxPop(); nav('/tienda') }}
              className="chip shrink-0 count-pop active:scale-90 transition"
              style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.22),rgba(251,191,36,0.08))', borderColor: 'rgba(251,191,36,0.5)' }}
            >
              <span className="text-base">🪙</span>
              <span className="text-[var(--gold)]">{player.coins || 0}</span>
              <span className="text-[var(--gold)] ml-0.5">🛒</span>
            </button>
          </div>
          <div className="mt-1"><XPBar xp={player.xp} /></div>
        </div>
        <div className="text-center shrink-0">
          <div className="text-2xl">🔥</div>
          <div className="text-xs font-extrabold">{player.streak} {player.streak === 1 ? t('day') : t('days')}</div>
        </div>
      </div>
    </div>
  )
}

export default function Hub() {
  useStreak()
  const { t, lang } = useLang()
  const { player, getSchoolXP, resetPlayer } = usePlayer()
  const nav = useNavigate()
  const [tab, setTab] = useState('play')
  const av = avatarByEmoji(player.avatar)
  // Intro del juego: se muestra la primera vez, luego con el botón "?".
  const [showHelp, setShowHelp] = useState(() => {
    try { return !localStorage.getItem('ml_seen_intro') } catch { return false }
  })
  const closeHelp = () => {
    try { localStorage.setItem('ml_seen_intro', '1') } catch { /* noop */ }
    setShowHelp(false)
  }
  // Cambiar de usuario (volver al inicio para elegir otro chico).
  const [confirmChange, setConfirmChange] = useState(false)
  const doChangeUser = () => {
    try { localStorage.removeItem('ml_seen_intro') } catch { /* noop */ }
    resetPlayer()
    nav('/')
  }
  // Siempre mostrar el inicio (arriba) al entrar al Hub.
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])
  const greet = (player.name ? `¡Hola, ${player.name}! ` : '') + (lang === 'pt' ? 'Que mundo vamos explorar? 🚀' : '¿Qué mundo exploramos? 🚀')

  const tabs = [
    { id: 'play', icon: '🎮', label: t('tabPlay') },
    { id: 'team', icon: '👥', label: t('tabTeam') },
    { id: 'ranking', icon: '🏆', label: t('tabRanking') },
  ]

  return (
    <div className="max-w-md mx-auto px-4 pt-14 pb-28 space-y-4">
      {showHelp && <HowToPlay onClose={closeHelp} />}
      {confirmChange && (
        <div className="fixed inset-0 z-[85] grid place-items-center px-6" style={{ background: 'rgba(8,4,20,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setConfirmChange(false)}>
          <div className="card p-6 max-w-xs w-full bounce-in text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl">🔁</div>
            <h2 className="font-logo text-xl grad-text mt-1">{t('changeUser')}</h2>
            <p className="text-sm text-[var(--text-dim)] mt-2 leading-snug">{t('changeUserMsg')}</p>
            <button onClick={doChangeUser} className="btn btn-gold w-full mt-5">{t('changeUserYes')}</button>
            <button onClick={() => setConfirmChange(false)} className="btn btn-ghost w-full mt-2 text-sm">{t('cancel')}</button>
          </div>
        </div>
      )}
      <SchoolBanner school={player.school} team={player.team} teamXP={getSchoolXP()} />
      <PlayerHeader onChangeUser={() => setConfirmChange(true)} />

      <div className="card flex p-1 gap-1">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => { sfxPop(); setTab(tb.id) }}
            className="flex-1 btn text-sm py-2"
            style={tab === tb.id
              ? { background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff', boxShadow: '0 8px 22px -10px rgba(124,58,237,0.9), inset 0 1px 0 rgba(255,255,255,0.3)' }
              : { background: 'transparent', color: 'var(--text-dim)' }}
          >
            {tb.icon} {tb.label}
          </button>
        ))}
      </div>

      {tab === 'play' && (
        <div className="fade-in space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1"><Mascot emoji={player.avatar} color={av.color} name={av.name} mood="idle" message={greet} size={60} /></div>
            <button
              onClick={() => { sfxPop(); setShowHelp(true) }}
              aria-label={t('howToHelp')}
              className="shrink-0 w-11 h-11 min-h-touch rounded-full card grid place-items-center text-lg font-black active:scale-90 transition glow-violet"
            >
              ?
            </button>
          </div>
          <AdventureMap />
        </div>
      )}

      {tab === 'team' && <TeamTab />}

      {tab === 'ranking' && (
        <div className="fade-in">
          <div className="text-sm text-[var(--text-dim)] mb-2">🏆 {t('rankingTitle')}</div>
          <RankingTable yourSchool={player.school} yourXP={getSchoolXP()} />
        </div>
      )}
    </div>
  )
}
