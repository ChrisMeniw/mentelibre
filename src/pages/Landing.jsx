import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import AvatarPicker, { AVATARS } from '../components/AvatarPicker'
import { AGE_GROUPS } from '../data/challenges'

export default function Landing() {
  const { t, lang } = useLang()
  const { saveProfile, hasProfile } = usePlayer()
  const nav = useNavigate()

  const [avatar, setAvatar] = useState(AVATARS[0])
  const [name, setName] = useState('')
  const [ageGroup, setAgeGroup] = useState('6-8')
  const [school, setSchool] = useState('')

  useEffect(() => { if (hasProfile) nav('/hub', { replace: true }) }, [hasProfile, nav])

  const ready = name.trim().length >= 2

  const start = () => {
    if (!ready) return
    saveProfile(name.trim(), avatar.emoji, avatar.name, ageGroup, school.trim())
    nav('/hub', { replace: true })
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-10 pb-16">
      <div className="text-center fade-in pt-2">
        <img
          src="/foundation-logo.webp"
          alt="Chris Meniw Foundation"
          width="104"
          height="104"
          className="mx-auto rounded-full floaty"
          style={{ width: 104, height: 104, filter: 'drop-shadow(0 10px 28px rgba(124,58,237,0.55))' }}
        />
        <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-dim)] mt-2 font-extrabold">
          Chris Meniw Foundation
        </div>
        <div className="font-logo text-5xl grad-text floaty leading-none mt-4">
          {lang === 'pt' ? 'Mente Livre' : 'Mente Libre'}
        </div>
        <div className="text-[var(--gold)] font-extrabold mt-3 text-glow">✨ {t('tagline')}</div>
        <p className="text-sm text-[var(--text-dim)] mt-2 max-w-xs mx-auto leading-relaxed">{t('subtitle')}</p>
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
            className="input mt-1"
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
            className="input mt-1"
          />
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
