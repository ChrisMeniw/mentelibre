import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { getWorld, getQuestions, pickRoundQuestions } from '../data/challenges'
import { getSeen, addSeen, resetSeen } from '../lib/seenQuestions'
import { BADGES } from '../data/badges'
import { levelForXP, levelName } from '../data/levels'
import { callClaude, roundReactSystemPrompt, parseReact, fallbackReact } from '../lib/claude'
import { avatarByEmoji } from '../components/AvatarPicker'
import { useSpeech } from '../hooks/useSpeech'
import { speak, stopSpeak, speakSupported } from '../lib/speak'
import { sfxPop, sfxSend, sfxSparkle, sfxCorrect, sfxComplete, sfxLevelUp, sfxCombo } from '../lib/sfx'
import { enterGameplay, exitGameplay } from '../lib/musicBus'
import Zoe from '../components/Zoe'
import StarsReveal from '../components/StarsReveal'
import CharacterSystem, { characterName, levelTitle } from '../components/characters/CharacterSystem'

const N = 5
const ROUND_REWARD = { 1: { xp: 6, coins: 1 }, 2: { xp: 12, coins: 2 }, 3: { xp: 18, coins: 3 } }
const THINK_SECONDS = 45
const countWords = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0)

function Confetti({ n = 36 }) {
  const colors = ['#7C3AED', '#A855F7', '#FBBF24', '#10B981', '#F43F5E', '#0EA5E9']
  const pieces = Array.from({ length: n }, (_, i) => ({
    left: (i * 53) % 100, delay: (i % 6) * 0.1, dur: 1.8 + (i % 5) * 0.3, color: colors[i % colors.length], size: 7 + (i % 4) * 2,
  }))
  return pieces.map((p, i) => (
    <span key={i} className="confetti-piece" style={{ left: p.left + '%', width: p.size, height: p.size * 1.5, background: p.color, animationDuration: p.dur + 's', animationDelay: p.delay + 's' }} />
  ))
}

function Stars({ value, size = 'text-2xl' }) {
  return (
    <div className="flex items-center justify-center gap-1" aria-label={`${value} de 3 estrellas`}>
      {[1, 2, 3].map((s) => (
        <span key={s} className={size + ' count-pop'} style={{ animationDelay: `${0.1 + s * 0.1}s`, filter: s <= value ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
      ))}
    </div>
  )
}

export default function Round() {
  const { world: worldId } = useParams()
  const nav = useNavigate()
  const { t, lang } = useLang()
  const { player, addXP, addCoins, completeChallenge, incrementAI, trackDaily } = usePlayer()

  const world = getWorld(worldId)
  const av = avatarByEmoji(player.avatar)
  // Elige y registra las preguntas UNA sola vez por ronda, evitando las ya vistas.
  // Ref-guard: a prueba del doble render de StrictMode (no repite el registro).
  const pickedRef = useRef(null)
  if (pickedRef.current === null) {
    let seen = getSeen(worldId, player.ageGroup)
    const pool = getQuestions(worldId, player.ageGroup)
    if (pool.length - seen.length < N) { resetSeen(worldId, player.ageGroup); seen = [] }
    const picked = pickRoundQuestions(worldId, player.ageGroup, N, seen)
    addSeen(worldId, player.ageGroup, picked)
    pickedRef.current = picked
  }
  const questions = pickedRef.current

  const [phase, setPhase] = useState('intro')   // intro | playing | results
  const [qi, setQi] = useState(0)
  const [stage, setStage] = useState('answer')  // answer | feedback
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [react, setReact] = useState('')
  const [qStars, setQStars] = useState(2)
  const [stars, setStars] = useState([])
  const [combo, setCombo] = useState(0)        // racha de respuestas con 2★+ seguidas
  const [comboPop, setComboPop] = useState(0)  // dispara la animación del cartel de racha
  const [timeLeft, setTimeLeft] = useState(THINK_SECONDS)
  const [results, setResults] = useState(null)
  const badgesBefore = useRef(player.unlockedBadges || [])
  const bestComboRef = useRef(0)               // racha máxima de la ronda
  const comboCoinsRef = useRef(0)              // monedas extra acumuladas por racha

  const { listening, supported: micSupported, start: startListen, stop: stopListen } = useSpeech(lang === 'pt' ? 'pt-BR' : 'es-US')

  // Estás jugando → la música del menú se calla mientras dura la ronda.
  useEffect(() => { enterGameplay(); return () => exitGameplay() }, [])

  const q = questions[qi]
  const qText = q ? (lang === 'pt' ? q.pt : q.es) : ''
  const childName = player.name || (lang === 'pt' ? 'amigo' : 'amigo')
  const canSend = answer.trim().length > 0

  // Leer la pregunta en voz alta (auto para 6-8) y reiniciar el tiempo al cambiar de pregunta.
  useEffect(() => {
    if (phase !== 'playing' || stage !== 'answer') return
    setTimeLeft(THINK_SECONDS)
    if (player.ageGroup === '6-8' && qText) {
      const tm = setTimeout(() => speak(qText, lang), 400)
      return () => { clearTimeout(tm); stopSpeak() }
    }
    return () => stopSpeak()
  }, [qi, phase, stage]) // eslint-disable-line react-hooks/exhaustive-deps

  // Barra de "tiempo para pensar" — no castiga: al llegar a 0 se queda en 0.
  useEffect(() => {
    if (phase !== 'playing' || stage !== 'answer' || timeLeft <= 0) return
    const id = setTimeout(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, phase, stage])

  useEffect(() => () => stopSpeak(), [])

  if (!world) { nav('/hub'); return null }

  const toggleVoice = () => {
    if (listening) { sfxPop(); stopListen(); return }
    sfxPop()
    const base = answer.trim() ? answer.trim() + ' ' : ''
    startListen((text) => setAnswer(base + text))
  }

  const startRound = () => { sfxPop(); setPhase('playing'); setStage('answer') }

  const respond = async () => {
    if (!canSend) return
    sfxSend(); if (listening) stopListen(); stopSpeak()
    setStage('feedback'); setLoading(true); setReact('')
    incrementAI()
    const res = await callClaude(roundReactSystemPrompt(childName, lang, player.ageGroup), `Pregunta: ${qText}\nRespuesta: ${answer}`, 120)
    const parsed = res ? parseReact(res) : { stars: 2, text: fallbackReact(childName, lang) }
    setReact(parsed.text || fallbackReact(childName, lang))
    setQStars(parsed.stars)
    setLoading(false)
    // Racha: respuestas con 2★+ encadenadas suben el combo (se corta con un 1★).
    const nc = parsed.stars >= 2 ? combo + 1 : 0
    setCombo(nc)
    if (nc > bestComboRef.current) bestComboRef.current = nc
    if (parsed.stars >= 2) sfxCorrect(); else sfxSparkle()
    if (nc >= 2) { setComboPop((p) => p + 1); setTimeout(() => sfxCombo(nc), 220) }
  }

  const next = () => {
    sfxPop()
    const all = [...stars, qStars]
    setStars(all)
    if (combo >= 2) comboCoinsRef.current += (combo - 1) // bono de racha: x2→+1, x3→+2…
    trackDaily({ answers: 1, stars: qStars }) // progreso de misión diaria por pregunta
    if (qi + 1 < N) {
      setQi(qi + 1); setAnswer(''); setReact(''); setStage('answer')
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      finishRound(all)
    }
  }

  const finishRound = (all) => {
    const totalXp = all.reduce((a, s) => a + (ROUND_REWARD[s]?.xp || 0), 0)
    const baseCoins = all.reduce((a, s) => a + (ROUND_REWARD[s]?.coins || 0), 0)
    const comboBonus = comboCoinsRef.current
    const totalCoins = baseCoins + comboBonus
    const bestCombo = bestComboRef.current
    const totalStars = all.reduce((a, s) => a + s, 0)
    const oldLevel = levelForXP(player.xp)
    const newXP = player.xp + totalXp
    const leveledUp = levelForXP(newXP) > oldLevel
    addXP(totalXp); addCoins(totalCoins); completeChallenge(worldId); trackDaily({ rounds: 1 })
    sfxComplete(); if (leveledUp) sfxLevelUp()
    setResults({ totalXp, totalCoins, comboBonus, bestCombo, totalStars, leveledUp, levelName: levelName(newXP, lang) })
    setPhase('results')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const wName = lang === 'pt' ? world.name_pt : world.name_es

  // ---------- INTRO ----------
  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-md px-4 pt-16 pb-32 min-h-dvh flex flex-col items-center justify-center text-center fade-in safe-top">
        <button onClick={() => { sfxPop(); nav('/hub') }} aria-label={t('back')} className="self-start btn btn-ghost px-3 py-2 text-sm min-h-touch">←</button>
        <div className="floaty mt-6"><Zoe size={110} talking /></div>
        <div className="text-xs font-extrabold text-[var(--violet-light)] mt-1">{t('zoeName')}</div>
        <div className="mt-4 chip text-sm" style={{ borderColor: `${world.color}66`, background: `${world.color}22` }}>
          <span className="text-lg">{world.emoji}</span> {wName}
        </div>
        <h1 className="font-logo text-3xl grad-text mt-3">{t('roundIntroTitle')}</h1>
        <p className="text-sm text-[var(--text-dim)] mt-2 max-w-xs">{t('roundIntroSub')}</p>
        <button onClick={startRound} className="btn btn-gold w-full max-w-xs mt-7 text-lg min-h-touch" aria-label={t('startRound')}>{t('startRound')}</button>
      </div>
    )
  }

  // ---------- RESULTS ----------
  if (phase === 'results' && results) {
    const newBadges = (player.unlockedBadges || []).filter((id) => !badgesBefore.current.includes(id)).map((id) => BADGES.find((b) => b.id === id)).filter(Boolean)
    return (
      <div className="relative mx-auto max-w-md px-4 pt-16 pb-32 min-h-dvh flex flex-col items-center justify-center text-center safe-top">
        <Confetti n={56} />
        <div className="card p-6 w-full bounce-in">
          <div className="grid place-items-center">
            {results.leveledUp
              ? <div className="char-evolve"><CharacterSystem ageGroup={player.ageGroup} level={levelForXP(player.xp)} mood="excited" size={96} /></div>
              : <Zoe size={96} talking />}
          </div>
          <Stars value={Math.round(results.totalStars / N)} size="text-3xl" />
          <div className="font-logo text-2xl grad-text mt-2">{t('roundDoneTitle')}</div>
          <div className="text-sm font-extrabold text-[var(--gold)] mt-1">⭐ {results.totalStars}/{N * 3} {t('roundStarsLabel')}</div>

          <div className="count-pop mt-4 flex items-center justify-center gap-3">
            <span className="text-3xl font-logo text-[var(--gold)] text-glow">+{results.totalXp} XP</span>
            <span className="chip text-lg" style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.25),rgba(251,191,36,0.08))', borderColor: 'rgba(251,191,36,0.6)' }}>🪙 <span className="text-[var(--gold)] font-black">+{results.totalCoins}</span></span>
          </div>

          {results.comboBonus > 0 && (
            <div className="bounce-in mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-black mx-auto"
              style={{ background: 'linear-gradient(135deg,#FBBF24,#F43F5E)', color: '#1a0b2e' }}>
              🔥 {t('comboBest')} x{results.bestCombo} · +{results.comboBonus} 🪙
            </div>
          )}

          {results.leveledUp && (
            <div className="mt-3">
              <div className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--gold)]">{t('newLevel')}</div>
              <div className="font-logo text-2xl grad-text">{characterName(player.ageGroup, levelForXP(player.xp))}</div>
              <div className="text-xs text-[var(--text-dim)] font-bold">{levelTitle(player.ageGroup, levelForXP(player.xp))}</div>
            </div>
          )}

          {newBadges.length > 0 && (
            <div className="mt-4 rounded-2xl p-3" style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.4)' }}>
              <div className="text-xs font-extrabold text-[var(--gold)]">{t('newBadge')}</div>
              <div className="flex items-center justify-center gap-3 mt-1.5">
                {newBadges.map((b) => (
                  <div key={b.id} className="text-center bounce-in">
                    <div className="text-3xl">{b.emoji}</div>
                    <div className="text-[10px] font-bold">{lang === 'pt' ? b.name_pt : b.name_es}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => { sfxPop(); nav('/hub') }} className="btn btn-gold w-full mt-6 text-lg min-h-touch" aria-label={t('nextRound')}>{t('nextRound')}</button>
        </div>
      </div>
    )
  }

  // ---------- PLAYING ----------
  const timePct = Math.max(0, Math.round((timeLeft / THINK_SECONDS) * 100))
  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 min-h-dvh safe-top">
      {/* Header: progreso de la ronda */}
      <div className="flex items-center gap-3 mb-3">
        <button onClick={() => { sfxPop(); stopSpeak(); nav('/hub') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-sm min-h-touch">←</button>
        <div className="flex items-center gap-2 font-extrabold text-sm">
          <span className="text-xl">{world.emoji}</span>
          <span className="text-[var(--text-dim)]">{t('questionOf')} {qi + 1} {t('ofWord')} {N}</span>
        </div>
        {combo >= 2 && (
          <div key={comboPop} className="ml-auto combo-chip flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black"
            style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.25),rgba(244,63,94,0.25))', border: '1px solid rgba(251,191,36,0.6)', color: 'var(--gold)' }}>
            🔥 x{combo}
          </div>
        )}
      </div>
      <div className="flex gap-1.5 mb-4" aria-hidden="true">
        {Array.from({ length: N }, (_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i < qi || (i === qi && stage === 'feedback') ? 'linear-gradient(90deg,var(--violet-light),var(--gold))' : i === qi ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.12)' }} />
        ))}
      </div>

      {stage === 'answer' && (
        <div className="space-y-4 fade-in">
          <div className="card p-5" style={{ boxShadow: `inset 0 0 0 1px ${world.color}44` }}>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-extrabold uppercase tracking-wide" style={{ color: world.color }}>{t('question')}</div>
              {speakSupported() && (
                <button onClick={() => speak(qText, lang)} aria-label={t('listenQuestion')}
                  className="shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold active:scale-90 transition min-h-touch"
                  style={{ background: `${world.color}22`, color: world.color, border: `1px solid ${world.color}55` }}>🔊 {t('listenQuestion')}</button>
              )}
            </div>
            <p className="mt-2 text-lg font-extrabold leading-snug">{qText}</p>

            {/* Barra de tiempo para pensar (no castiga) */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-[var(--text-dim)] mb-1">
                <span>⏳ {t('thinkTime')}</span><span>{timeLeft}s</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: timePct + '%', background: timePct > 35 ? 'linear-gradient(90deg,var(--violet-light),var(--sky))' : 'linear-gradient(90deg,var(--gold),var(--rose))' }} />
              </div>
            </div>
          </div>

          <div className="card p-4">
            {micSupported && (
              <button onClick={toggleVoice} aria-label={listening ? t('listening') : t('tapToSpeak')}
                className={'w-full rounded-2xl py-4 px-4 flex items-center justify-center gap-3 font-extrabold text-white transition active:scale-[0.98] min-h-touch ' + (listening ? 'mic-pulse' : '')}
                style={{ background: listening ? 'linear-gradient(135deg,#FB7185,#E11D48)' : 'linear-gradient(135deg,#A855F7,#7C3AED)', boxShadow: listening ? 'none' : '0 10px 28px -10px rgba(124,58,237,0.9)' }}>
                {listening ? (
                  <>
                    <span className="flex items-end gap-1 h-5">
                      <span className="sound-bar" style={{ animationDelay: '0s' }} /><span className="sound-bar" style={{ animationDelay: '0.15s' }} /><span className="sound-bar" style={{ animationDelay: '0.3s' }} /><span className="sound-bar" style={{ animationDelay: '0.15s' }} />
                    </span>
                    <span className="text-sm">{t('listening')}</span>
                  </>
                ) : <span className="text-base">{t('tapToSpeak')}</span>}
              </button>
            )}
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={micSupported ? 3 : 5}
              aria-label={t('writeYourAnswer')} placeholder={micSupported ? t('orTypeHint') : t('writeYourAnswer')}
              className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 mt-3 outline-none focus:border-[var(--violet-light)] resize-none text-base" />
            <button onClick={() => { if (listening) stopListen(); respond() }} disabled={!canSend}
              className="btn btn-primary w-full mt-3 disabled:opacity-40 min-h-touch" aria-label={t('respondBtn')}>{t('respondBtn')}</button>
          </div>
        </div>
      )}

      {stage === 'feedback' && (
        <div className="space-y-4 fade-in">
          <div className="card p-4" style={{ boxShadow: `inset 0 0 0 1px ${world.color}33` }}>
            <div className="text-xs font-extrabold uppercase tracking-wide text-[var(--text-dim)]">{t('yourAnswer')}</div>
            <blockquote className="mt-1 border-l-2 pl-3 italic text-[var(--text-dim)] text-sm" style={{ borderColor: world.color }}>{answer}</blockquote>
          </div>

          <div className="relative card p-5 text-center overflow-hidden"
            role="status" aria-live="polite"
            style={{ background: loading ? undefined : (qStars >= 2 ? 'linear-gradient(180deg, rgba(16,185,129,0.16), rgba(255,255,255,0.03))' : 'linear-gradient(180deg, rgba(251,191,36,0.14), rgba(255,255,255,0.03))') }}>
            {!loading && qStars >= 3 && <Confetti n={28} />}
            <div className="grid place-items-center"><Zoe size={72} talking={!loading} /></div>
            {loading ? (
              <div className="text-[var(--text-dim)] text-sm caret mt-2">{t('aiThinking')}</div>
            ) : (
              <>
                <div className="mt-2"><StarsReveal stars={qStars} /></div>
                {combo >= 2 && (
                  <div key={comboPop} className="combo-burst mx-auto mt-2 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-black"
                    style={{ background: 'linear-gradient(135deg,#FBBF24,#F43F5E)', color: '#1a0b2e', boxShadow: '0 8px 24px -6px rgba(251,191,36,0.8)' }}>
                    🔥 {t('comboLabel')} x{combo}{combo >= 3 ? ' 🚀' : ''}
                  </div>
                )}
                <p className="mt-2 text-[15px] font-bold leading-snug">{react}</p>
              </>
            )}
          </div>

          <button onClick={next} disabled={loading} className="btn btn-gold w-full disabled:opacity-40 min-h-touch"
            aria-label={qi + 1 < N ? t('nextQuestion') : t('seeResults')}>
            {qi + 1 < N ? t('nextQuestion') : t('seeResults')}
          </button>
        </div>
      )}
    </div>
  )
}
