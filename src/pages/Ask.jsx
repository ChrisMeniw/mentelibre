import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { pickAskTopics } from '../data/askTopics'
import { evaluateQuestion } from '../lib/claude'
import { useSpeech } from '../hooks/useSpeech'
import { speak, stopSpeak, speakSupported } from '../lib/speak'
import { sfxPop, sfxSend, sfxCorrect, sfxSparkle, sfxComplete, sfxLevelUp, sfxCoins, sfxTick } from '../lib/sfx'
import { enterGameplay, exitGameplay } from '../lib/musicBus'
import { levelForXP, levelName, isAskUnlocked } from '../data/levels'
import Zoe from '../components/Zoe'
import Celebration from '../components/Celebration'
import StarsReveal from '../components/StarsReveal'

const N = 5
const ACCENT = '#8B5CF6'
const ASK_SECONDS = 30 // formular preguntas: 30 segundos
// XP por estrella (spec): ⭐=5, ⭐⭐=10, ⭐⭐⭐=20. Preguntar bien es la habilidad más alta.
const REWARD = { 1: { xp: 5, coins: 2 }, 2: { xp: 10, coins: 3 }, 3: { xp: 20, coins: 5 } }

function Stars({ value }) {
  return (
    <div className="flex items-center justify-center gap-1" aria-label={`${value} de 3 estrellas`}>
      {[1, 2, 3].map((s) => (
        <span key={s} className="text-2xl count-pop" style={{ animationDelay: `${0.1 + s * 0.1}s`, filter: s <= value ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
      ))}
    </div>
  )
}

export default function Ask() {
  const { t, lang } = useLang()
  const { player, addXP, addCoins, completeChallenge, incrementAI, trackDaily } = usePlayer()
  const nav = useNavigate()

  const ageGroup = player.ageGroup || '9-11'
  const topics = useRef(pickAskTopics(ageGroup, N)).current
  const childName = player.name || (lang === 'pt' ? 'amigo' : 'amigo')

  const [phase, setPhase] = useState('intro') // intro | playing | results
  const [ti, setTi] = useState(0)
  const [stage, setStage] = useState('answer') // answer | feedback
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [react, setReact] = useState('')
  const [qStars, setQStars] = useState(2)
  const [timeLeft, setTimeLeft] = useState(ASK_SECONDS)
  const [stars, setStars] = useState([])
  const [results, setResults] = useState(null)
  const [celeb, setCeleb] = useState(null)
  const levelBefore = useRef(levelForXP(player.xp))

  const { listening, supported: micSupported, start: startListen, stop: stopListen } = useSpeech(lang === 'pt' ? 'pt-BR' : 'es-US')

  const topic = topics[ti]
  const topicText = topic ? (lang === 'pt' ? topic.pt : topic.es) : ''

  // Lee el tema en voz alta (chica joven, todos) y reinicia los 30 s al cambiar de tema.
  useEffect(() => {
    if (phase !== 'playing' || stage !== 'answer') return
    setTimeLeft(ASK_SECONDS)
    if (topicText) {
      const tm = setTimeout(() => speak(topicText, lang), 400)
      return () => { clearTimeout(tm); stopSpeak() }
    }
    return () => stopSpeak()
  }, [ti, phase, stage]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cuenta regresiva de 30 s para formular la pregunta (urgencia + tic-tac).
  useEffect(() => {
    if (phase !== 'playing' || stage !== 'answer') return
    if (timeLeft <= 0) { handleTimeUp(); return }
    const id = setTimeout(() => setTimeLeft((s) => { const n = Math.max(0, s - 1); if (n > 0 && n <= 5) sfxTick(); return n }), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, phase, stage]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopSpeak(), [])

  // Estás jugando → la música del menú se calla (quedan los efectos de sonido).
  useEffect(() => { enterGameplay(); return () => exitGameplay() }, [])

  // Bloqueado hasta Filósofo (1400 XP): si no llegó, vuelve al Hub.
  useEffect(() => { if (!isAskUnlocked(player.xp)) nav('/hub') }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleVoice = () => {
    if (listening) { sfxPop(); stopListen(); return }
    sfxPop()
    const base = answer.trim() ? answer.trim() + ' ' : ''
    startListen((text) => setAnswer(base + text))
  }

  const respond = async () => {
    if (!answer.trim()) return
    sfxSend(); if (listening) stopListen(); stopSpeak()
    setStage('feedback'); setLoading(true); setReact(''); incrementAI()
    const { stars: qs, feedback } = await evaluateQuestion(topicText, answer, player.ageGroup, lang, childName)
    setReact(feedback)
    setQStars(qs)
    setLoading(false)
    if (qs >= 2) sfxCorrect(); else sfxSparkle()
  }

  // Se acabó el tiempo: si formuló algo lo enviamos; si no, seguimos sin castigar feo.
  const handleTimeUp = () => {
    if (phase !== 'playing' || stage !== 'answer') return
    if (answer.trim()) { respond(); return }
    if (listening) stopListen()
    stopSpeak(); sfxSparkle()
    setStage('feedback'); setLoading(false); setReact(t('timeUpMsg')); setQStars(1)
  }

  const next = () => {
    sfxPop()
    const all = [...stars, qStars]
    setStars(all)
    trackDaily({ answers: 1, stars: qStars })
    if (ti + 1 < N) {
      setTi(ti + 1); setAnswer(''); setReact(''); setStage('answer')
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      finish(all)
    }
  }

  const finish = (all) => {
    const xp = all.reduce((a, s) => a + (REWARD[s]?.xp || 0), 0)
    const coins = all.reduce((a, s) => a + (REWARD[s]?.coins || 0), 0)
    const totalStars = all.reduce((a, s) => a + s, 0)
    addXP(xp); addCoins(coins); completeChallenge('preguntar')
    const leveledUp = levelForXP(player.xp + xp) > levelBefore.current
    setResults({ xp, coins, totalStars, leveledUp })
    sfxComplete(); if (leveledUp) setTimeout(() => sfxLevelUp(), 500)
    setCeleb({ xp, coins, stars: Math.round(totalStars / N), leveledUp, levelName: levelName(player.xp + xp, lang), ageGroup: player.ageGroup, level: levelForXP(player.xp + xp) })
    setPhase('results')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  // ---------- INTRO ----------
  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-md px-4 pt-14 pb-32 min-h-dvh flex flex-col safe-top">
        <button onClick={() => { sfxPop(); nav('/hub') }} aria-label={t('back')} className="self-start btn btn-ghost px-3 py-2 text-sm min-h-touch">←</button>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-6xl world-float">🦉</div>
          <div className="chip mt-3 text-xs" style={{ background: `${ACCENT}26`, borderColor: `${ACCENT}88`, color: '#DDD6FE' }}>{t('askBadge')}</div>
          <h1 className="font-logo text-3xl grad-text mt-2">{t('askTitle')}</h1>
          <p className="text-sm text-[var(--text-dim)] mt-2 leading-relaxed max-w-xs">{t('askIntro')}</p>
          <button onClick={() => { sfxPop(); setPhase('playing') }} className="btn btn-gold w-full mt-6 text-lg min-h-touch">{t('askStart')}</button>
        </div>
      </div>
    )
  }

  // ---------- RESULTS ----------
  if (phase === 'results' && results) {
    return (
      <>
        {celeb && <Celebration {...celeb} avatar={player.avatar} color={ACCENT} onClose={() => setCeleb(null)} />}
        <div className="mx-auto max-w-md px-4 pt-16 pb-32 min-h-dvh flex flex-col items-center justify-center text-center safe-top">
          <div className="card p-6 w-full bounce-in">
            <div className="text-5xl world-float">🦉</div>
            <div className="font-logo text-2xl grad-text mt-2">{t('askDoneTitle')}</div>
            <div className="mt-3"><Stars value={Math.round(results.totalStars / N)} /></div>
            <div className="text-xs text-[var(--text-dim)] mt-1">{t('askStarsLabel')}</div>
            <div className="count-pop mt-4 flex items-center justify-center gap-3">
              <span className="text-3xl font-logo text-[var(--gold)] text-glow">+{results.xp} XP</span>
              <span className="chip text-lg" style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.25),rgba(251,191,36,0.08))', borderColor: 'rgba(251,191,36,0.6)' }}>🪙 <span className="text-[var(--gold)] font-black">+{results.coins}</span></span>
            </div>
            <button onClick={() => { sfxPop(); nav('/hub') }} className="btn btn-gold w-full mt-6 text-lg min-h-touch">{t('backToMap')}</button>
          </div>
        </div>
      </>
    )
  }

  // ---------- PLAYING ----------
  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 min-h-dvh safe-top">
      <div className="flex items-center justify-between gap-2 mb-3">
        <button onClick={() => { sfxPop(); stopSpeak(); nav('/hub') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-sm min-h-touch">←</button>
        <div className="chip text-[11px]" style={{ background: `${ACCENT}1f`, borderColor: `${ACCENT}66`, color: '#DDD6FE' }}>{t('askBadge')}</div>
        <span className="text-sm text-[var(--text-dim)] tabular-nums">{ti + 1}/{N}</span>
      </div>

      {/* progreso */}
      <div className="flex gap-1.5 mb-3">
        {Array.from({ length: N }).map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i < ti || (i === ti && stage === 'feedback') ? `linear-gradient(90deg,${ACCENT},var(--gold))` : i === ti ? `${ACCENT}88` : 'rgba(255,255,255,0.12)' }} />
        ))}
      </div>

      {/* TEMA */}
      <div className="card p-4" style={{ boxShadow: `inset 0 0 0 1px ${ACCENT}44` }}>
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-extrabold uppercase tracking-wide" style={{ color: ACCENT }}>🦉 {t('askTopicLabel')}</div>
          {speakSupported() && (
            <button onClick={() => { sfxPop(); speak(topicText, lang) }} aria-label={t('listenQuestion')} className="shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold active:scale-90 transition min-h-touch" style={{ background: `${ACCENT}22`, color: ACCENT, border: `1px solid ${ACCENT}55` }}>🔊 {t('listenQuestion')}</button>
          )}
        </div>
        <p className="mt-2 text-lg font-extrabold leading-snug">{topicText}</p>
        <p className="mt-1 text-xs text-[var(--text-dim)]">{t('askHelp')}</p>

        {stage === 'answer' && (
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-[var(--text-dim)] mb-1"><span>⏳ {t('thinkTime')}</span><span>{timeLeft}s</span></div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: Math.max(0, Math.round((timeLeft / ASK_SECONDS) * 100)) + '%', background: timeLeft > 8 ? `linear-gradient(90deg,${ACCENT},var(--sky))` : 'linear-gradient(90deg,var(--gold),var(--rose))' }} />
            </div>
          </div>
        )}
      </div>

      {stage === 'answer' && (
        <div className="card p-4 mt-3 fade-in">
          {micSupported && (
            <button onClick={toggleVoice} aria-label={listening ? t('listening') : t('tapToSpeak')} className={'w-full rounded-2xl py-3.5 px-4 flex items-center justify-center gap-3 font-extrabold text-white transition active:scale-[0.98] min-h-touch ' + (listening ? 'mic-pulse' : '')} style={{ background: listening ? 'linear-gradient(135deg,#FB7185,#E11D48)' : `linear-gradient(135deg,#A855F7,${ACCENT})` }}>
              <span className="text-base">{listening ? t('listening') : t('askTapToSpeak')}</span>
            </button>
          )}
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={micSupported ? 3 : 5} aria-label={t('askPlaceholder')} placeholder={t('askPlaceholder')} className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 mt-3 outline-none focus:border-[var(--violet-light)] resize-none text-base" />
          <button onClick={respond} disabled={!answer.trim()} className="btn btn-gold w-full mt-3 disabled:opacity-40 min-h-touch" aria-label={t('askSend')}>{t('askSend')}</button>
        </div>
      )}

      {stage === 'feedback' && (
        <div className="space-y-4 fade-in mt-3">
          <div className="relative card p-5 text-center overflow-hidden" role="status" aria-live="polite"
            style={{ background: loading ? undefined : (qStars >= 2 ? `linear-gradient(180deg, ${ACCENT}22, rgba(255,255,255,0.03))` : 'linear-gradient(180deg, rgba(251,191,36,0.14), rgba(255,255,255,0.03))') }}>
            <div className="grid place-items-center"><Zoe size={72} talking={!loading} /></div>
            {loading ? (
              <div className="text-[var(--text-dim)] text-sm caret mt-2">{t('aiThinking')}</div>
            ) : (
              <>
                <div className="mt-2"><StarsReveal stars={qStars} /></div>
                <p className="mt-2 text-[15px] font-bold leading-snug">{react}</p>
              </>
            )}
          </div>
          <button onClick={next} disabled={loading} className="btn btn-gold w-full disabled:opacity-40 min-h-touch">{ti + 1 < N ? t('askNext') : t('seeResults')}</button>
        </div>
      )}
    </div>
  )
}
