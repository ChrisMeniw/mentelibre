import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import AvatarPicker, { AVATARS } from '../components/AvatarPicker'
import { AGE_GROUPS } from '../data/challenges'

const TEAMS = [
  { id: 'Alfa', emoji: '🔮', color: '#7C3AED' },
  { id: 'Beta', emoji: '⚡', color: '#0EA5E9' },
  { id: 'Gamma', emoji: '🌿', color: '#10B981' },
  { id: 'Delta', emoji: '🔥', color: '#FBBF24' },
]

export default function Landing() {
  const { t, lang } = useLang()
  const { saveProfile, hasProfile } = usePlayer()
  const nav = useNavigate()

  const [avatar, setAvatar] = useState(AVATARS[0])
  const [name, setName] = useState('')
  const [ageGroup, setAgeGroup] = useState('6-8')
  const [school, setSchool] = useState('')
  const [team, setTeam] = useState('')

  useEffect(() => { if (hasProfile) nav('/hub', { replace: true }) }, [hasProfile, nav])

  const ready = name.trim().length >= 2 && team

  const start = () => {
    if (!ready) return
    saveProfile(name.trim(), avatar.emoji, avatar.name, ageGroup, school.trim(), team)
    nav('/hub', { replace: true })
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-16">
      <div className="text-center fade-in">
        <div className="font-logo text-4xl tracking-tight">
          {lang === 'pt' ? 'MenteLivre' : 'MenteLibre'}
        </div>
        <div className="text-[var(--gold)] font-extrabold mt-1">✨ {t('tagline')}</div>
        <p className="text-sm text-[var(--text-dim)] mt-2">{t('subtitle')}</p>
      </div>

      <div className="card p-4 mt-6 fade-in-d1">
        <div className="font-extrabold mb-3">{t('chooseAvatar')}</div>
        <AvatarPicker value={avatar.emoji} onChange={setAvatar} />
      </div>

      <div className="card p-4 mt-4 space-y-4 fade-in-d2">
        <div>
          <label className="text-sm font-extrabold">{t('yourName')}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
            className="mt-1 w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 outline-none focus:border-[var(--violet-light)]"
          />
        </div>
        <div>
          <label className="text-sm font-extrabold">{t('ageLabel')}</label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {AGE_GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setAgeGroup(g)}
                className="btn text-sm"
                style={ageGroup === g
                  ? { background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'var(--text)' }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-extrabold">{t('schoolLabel')}</label>
          <input
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder={t('schoolPlaceholder')}
            className="mt-1 w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 outline-none focus:border-[var(--violet-light)]"
          />
        </div>
      </div>

      <div className="card p-4 mt-4 fade-in-d3">
        <div className="font-extrabold mb-3">{t('chooseTeam')}</div>
        <div className="grid grid-cols-2 gap-3">
          {TEAMS.map((tm) => {
            const sel = team === tm.id
            return (
              <button
                key={tm.id}
                onClick={() => setTeam(tm.id)}
                className="card p-3 flex items-center gap-2 active:scale-95 transition"
                style={{ boxShadow: sel ? `0 0 0 2px ${tm.color}` : `inset 0 0 0 1px ${tm.color}33` }}
              >
                <span className="text-2xl">{tm.emoji}</span>
                <span className="font-extrabold" style={{ color: tm.color }}>{tm.id}</span>
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={start}
        disabled={!ready}
        className="btn btn-gold w-full mt-6 text-lg disabled:opacity-40"
      >
        {t('start')} 🚀
      </button>
    </div>
  )
}
