import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { getWorld, pickQuestion } from '../data/challenges'
import { callClaude, responseSystemPrompt, hintSystemPrompt, fallbackResponse, fallbackHint } from '../lib/claude'
import { avatarByEmoji } from '../components/AvatarPicker'
import AIResponse from '../components/AIResponse'

const countWords = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0)

function Confetti() {
  const colors = ['#7C3AED', '#A855F7', '#FBBF24', '#10B981', '#F43F5E', '#0EA5E9']
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    dur: 1.6 + Math.random() * 1.4,
    color: colors[i % colors.length],
  }))
  return (
    <>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{ left: p.left + '%', background: p.color, animationDuration: p.dur + 's', animationDelay: p.delay + 's' }}
        />
      ))}
    </>
  )
}

export default function Challenge() {
  const { world: worldId } = useParams()
  const nav = useNavigate()
  const { t, lang } = useLang()
  const { player, addXP, completeChallenge, incrementAI } = usePlayer()

  const world = getWorld(worldId)
  const av = avatarByEmoji(player.avatar)
  const question = useMemo(() => pickQuestion(worldId, player.ageGroup), [worldId, player.ageGroup])
  const qText = lang === 'pt' ? question.pt : question.es

  const [step, setStep] = useState(1)
  const [answer, setAnswer] = useState('')
  const [hint, setHint] = useState('')
  const [loadingHint, setLoadingHint] = useState(false)
  const [aiText, setAiText] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)
  const [changedMind, setChangedMind] = useState('')
  const [hardest, setHardest] = useState('')
  const [confetti, setConfetti] = useState(false)
  const [toast, setToast] = useState(0)

  if (!world) { nav('/hub'); return null }

  const words = countWords(answer)
  const canSend = words >= 20
  const childName = player.name || (lang === 'pt' ? 'amigo' : 'amigo')

  const getHint = async () => {
    setLoadingHint(true); setHint('')
    const res = await callClaude(hintSystemPrompt(lang), qText, 80)
    setHint(res || fallbackHint(lang))
    setLoadingHint(false)
  }

  const goToAI = async () => {
    setStep(2); setLoadingAI(true); setAiText('')
    incrementAI()
    const sys = responseSystemPrompt(childName, `${av.name} ${player.avatar}`, lang)
    const res = await callClaude(sys, `Pregunta: ${qText}\nRespuesta: ${answer}`, 300)
    setAiText(res || fallbackResponse(childName, av.name, lang))
    setLoadingAI(false)
  }

  const finish = () => {
    if (!changedMind || !hardest) return
    const bonus = (changedMind === 'yes' || changedMind === 'abit') ? 25 : 0
    const xp = 50 + bonus
    addXP(xp); completeChallenge(worldId)
    setToast(xp); setConfetti(true)
    setTimeout(() => nav('/hub'), 2200)
  }

  const reflectReady = changedMind && hardest

  return (
    <div className="max-w-md mx-auto px-4 pt-14 pb-28">
      {confetti && <Confetti />}
      {toast > 0 && (
        <div className="fixed top-4 right-4 z-[60] xp-toast card px-4 py-2 font-extrabold text-[var(--gold)]">
          +{toast} XP 🎉
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => nav('/hub')} className="btn btn-ghost px-3 py-2 text-sm">←</button>
        <div className="flex items-center gap-2 font-extrabold">
          <span className="text-2xl">{world.emoji}</span>
          <span>{lang === 'pt' ? world.name_pt : world.name_es}</span>
        </div>
      </div>

      {/* Indicador de pasos */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="flex-1 h-1.5 rounded-full"
            style={{ background: s <= step ? 'linear-gradient(90deg,var(--violet-light),var(--gold))' : 'rgba(255,255,255,0.12)' }}
          />
        ))}
      </div>

      {/* PASO 1 — Pregunta */}
      {step === 1 && (
        <div className="space-y-4 fade-in">
          <div className="card p-5" style={{ boxShadow: `inset 0 0 0 1px ${world.color}44` }}>
            <div className="text-xs font-extrabold uppercase tracking-wide" style={{ color: world.color }}>
              {t('question')}
            </div>
            <p className="mt-2 text-lg font-extrabold leading-snug">{qText}</p>
          </div>

          <div className="card p-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder={t('writeYourAnswer')}
              className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 outline-none focus:border-[var(--violet-light)] resize-none"
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className={canSend ? 'text-[var(--emerald)] font-bold' : 'text-[var(--text-dim)]'}>
                {words} {t('words')} {canSend ? '✓' : `· ${t('minWordsHint')}`}
              </span>
            </div>

            {hint && (
              <div className="mt-3 rounded-2xl px-3 py-2 text-sm" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}>
                💡 {hint}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button onClick={getHint} disabled={loadingHint} className="btn btn-ghost flex-1 text-sm disabled:opacity-50">
                {loadingHint ? t('thinking') : t('needHint')}
              </button>
              <button onClick={goToAI} disabled={!canSend} className="btn btn-primary flex-[1.4] text-sm disabled:opacity-40">
                {t('sendAnswer')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASO 2 — Respuesta de la IA */}
      {step === 2 && (
        <div className="space-y-4 fade-in">
          <div className="card p-4">
            <div className="text-xs font-extrabold uppercase tracking-wide text-[var(--text-dim)]">{t('yourAnswer')}</div>
            <blockquote className="mt-1 border-l-2 pl-3 italic text-[var(--text-dim)]" style={{ borderColor: world.color }}>
              {answer}
            </blockquote>
          </div>

          <div className="card p-4 min-h-[120px]">
            {loadingAI
              ? <div className="text-[var(--text-dim)] text-sm caret">{t('aiThinking')}</div>
              : <AIResponse text={aiText} />}
          </div>

          <button onClick={() => setStep(3)} disabled={loadingAI} className="btn btn-primary w-full disabled:opacity-40">
            {t('gotItNext')}
          </button>
        </div>
      )}

      {/* PASO 3 — Reflexión */}
      {step === 3 && (
        <div className="space-y-4 fade-in">
          <div className="card p-4">
            <div className="font-extrabold mb-3">🤔 {t('changedMind')}</div>
            <div className="grid grid-cols-3 gap-2">
              {[['yes', t('rYes')], ['abit', t('rABit')], ['no', t('rNo')]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setChangedMind(id)}
                  className="btn text-sm"
                  style={changedMind === id
                    ? { background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'var(--text)' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <div className="font-extrabold mb-3">💭 {t('hardest')}</div>
            <div className="space-y-2">
              {[['h1', t('h1')], ['h2', t('h2')], ['h3', t('h3')]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setHardest(id)}
                  className="btn w-full text-left text-sm"
                  style={hardest === id
                    ? { background: 'rgba(16,185,129,0.18)', color: '#fff', boxShadow: 'inset 0 0 0 1px var(--emerald)' }
                    : { background: 'rgba(255,255,255,0.06)', color: 'var(--text)' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={finish} disabled={!reflectReady} className="btn btn-gold w-full text-lg disabled:opacity-40">
            {t('finishChallenge')}
          </button>
          {!reflectReady && <p className="text-center text-xs text-[var(--text-dim)]">{t('needPickReflection')}</p>}
        </div>
      )}
    </div>
  )
}
