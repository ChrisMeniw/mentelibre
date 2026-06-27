import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { getWorld, pickQuestion } from '../data/challenges'
import { callClaude, responseSystemPrompt, hintSystemPrompt, scoreSystemPrompt, parseScore, fallbackResponse, fallbackHint } from '../lib/claude'
import { avatarByEmoji } from '../components/AvatarPicker'
import { levelForXP, levelName } from '../data/levels'
import { sfxPop, sfxSend, sfxSparkle, sfxCorrect, sfxComplete, sfxLevelUp } from '../lib/sfx'
import { enterGameplay, exitGameplay } from '../lib/musicBus'
import { useSpeech } from '../hooks/useSpeech'
import { speak, stopSpeak, speakSupported } from '../lib/speak'
import AIResponse from '../components/AIResponse'
import Mascot from '../components/Mascot'
import Celebration from '../components/Celebration'

// Recompensa según cuánto pensó: más pensamiento = más puntos y monedas.
const REWARD = { 1: { xp: 30, coins: 5 }, 2: { xp: 55, coins: 10 }, 3: { xp: 85, coins: 18 } }

const countWords = (s) => (s.trim() ? s.trim().split(/\s+/).length : 0)

export default function Challenge() {
  const { world: worldId } = useParams()
  const nav = useNavigate()
  const { t, lang } = useLang()
  const { player, addXP, completeChallenge, incrementAI, addCoins } = usePlayer()

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
  const [celeb, setCeleb] = useState(null)
  const [score, setScore] = useState(2)

  const { listening, supported: micSupported, start: startListen, stop: stopListen } = useSpeech(lang === 'pt' ? 'pt-BR' : 'es-US')

  // Estás jugando → la música del menú se calla mientras dura el desafío.
  useEffect(() => { enterGameplay(); return () => exitGameplay() }, [])

  // Leer la pregunta en voz alta para los más chicos (6-8) al entrar.
  useEffect(() => {
    if (player.ageGroup === '6-8' && qText) {
      const tm = setTimeout(() => speak(qText, lang), 500)
      return () => { clearTimeout(tm); stopSpeak() }
    }
    return () => stopSpeak()
  }, [qText, lang, player.ageGroup])

  if (!world) { nav('/hub'); return null }

  const words = countWords(answer)
  const canSend = answer.trim().length > 0 // se activa apenas hay algo escrito
  const childName = player.name || (lang === 'pt' ? 'amigo' : 'amigo')

  // Botón hablar: agrega lo dicho a lo que ya hay escrito.
  const toggleVoice = () => {
    if (listening) { sfxPop(); stopListen(); return }
    sfxPop()
    const base = answer.trim() ? answer.trim() + ' ' : ''
    startListen((text) => setAnswer(base + text))
  }

  const getHint = async () => {
    sfxPop()
    setLoadingHint(true); setHint('')
    const res = await callClaude(hintSystemPrompt(lang), qText, 80)
    setHint(res || fallbackHint(lang))
    setLoadingHint(false)
  }

  const goToAI = async () => {
    sfxSend()
    if (listening) stopListen()
    stopSpeak()
    setStep(2); setLoadingAI(true); setAiText('')
    incrementAI()
    const sys = responseSystemPrompt(childName, `${av.name} ${player.avatar}`, lang, player.ageGroup)
    const userMsg = `Pregunta: ${qText}\nRespuesta: ${answer}`
    // Puntaje del pensamiento EN SEGUNDO PLANO (no bloquea la respuesta; se usa recién al terminar).
    setScore(2)
    callClaude(scoreSystemPrompt(lang), userMsg, 5)
      .then((r) => { if (r) setScore(parseScore(r)) })
      .catch(() => { /* queda en 2 */ })
    // La respuesta cálida libera la pantalla apenas llega.
    const res = await callClaude(sys, userMsg, 300)
    setAiText(res || fallbackResponse(childName, av.name, lang))
    setLoadingAI(false)
    sfxSparkle()
  }

  const pickReflection = (setter, id) => { sfxPop(); setter(id) }

  const finish = () => {
    if (!changedMind || !hardest) return
    // Recompensa según cuánto pensó (premia al que mejor piensa).
    const base = REWARD[score] || REWARD[2]
    const reflectBonus = (changedMind === 'yes' || changedMind === 'abit') ? 1 : 0
    const xp = base.xp + reflectBonus * 10
    const coins = base.coins + reflectBonus * 2
    const oldLevel = levelForXP(player.xp)
    const newXP = player.xp + xp
    const leveledUp = levelForXP(newXP) > oldLevel
    addXP(xp); completeChallenge(worldId); addCoins(coins)
    sfxComplete()
    if (leveledUp) sfxLevelUp()
    setCeleb({ xp, coins, stars: score, leveledUp, levelName: levelName(newXP, lang), ageGroup: player.ageGroup, level: levelForXP(newXP) })
  }

  const reflectReady = changedMind && hardest

  return (
    <div className="max-w-md mx-auto px-4 pt-14 pb-28">
      {celeb && (
        <Celebration
          xp={celeb.xp}
          coins={celeb.coins}
          stars={celeb.stars}
          leveledUp={celeb.leveledUp}
          levelName={celeb.levelName}
          ageGroup={celeb.ageGroup}
          level={celeb.level}
          avatar={player.avatar}
          color={av.color}
          onClose={() => nav('/hub')}
        />
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => { sfxPop(); nav('/hub') }} className="btn btn-ghost px-3 py-2 text-sm">←</button>
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
          <Mascot emoji={player.avatar} color={av.color} name={av.name} mood="idle" message={micSupported ? t('mascotHi') : t('mascotHiType')} size={64} />

          <div className="card p-5" style={{ boxShadow: `inset 0 0 0 1px ${world.color}44` }}>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-extrabold uppercase tracking-wide" style={{ color: world.color }}>
                {t('question')}
              </div>
              {speakSupported() && (
                <button
                  onClick={() => { sfxPop(); speak(qText, lang) }}
                  aria-label={t('listenQuestion')}
                  className="shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold active:scale-90 transition"
                  style={{ background: `${world.color}22`, color: world.color, border: `1px solid ${world.color}55` }}
                >
                  🔊 {t('listenQuestion')}
                </button>
              )}
            </div>
            <p className="mt-2 text-lg font-extrabold leading-snug">{qText}</p>
          </div>

          <div className="card p-4">
            {/* BOTÓN HABLAR — protagonista, para que los chicos respondan con la voz */}
            {micSupported && (
              <button
                onClick={toggleVoice}
                className={'w-full rounded-2xl py-4 px-4 flex items-center justify-center gap-3 font-extrabold text-white transition active:scale-[0.98] ' + (listening ? 'mic-pulse' : '')}
                style={{
                  background: listening
                    ? 'linear-gradient(135deg,#FB7185,#E11D48)'
                    : 'linear-gradient(135deg,#A855F7,#7C3AED)',
                  boxShadow: listening ? 'none' : '0 10px 28px -10px rgba(124,58,237,0.9)',
                }}
              >
                {listening ? (
                  <>
                    <span className="flex items-end gap-1 h-5">
                      <span className="sound-bar" style={{ animationDelay: '0s' }} />
                      <span className="sound-bar" style={{ animationDelay: '0.15s' }} />
                      <span className="sound-bar" style={{ animationDelay: '0.3s' }} />
                      <span className="sound-bar" style={{ animationDelay: '0.15s' }} />
                    </span>
                    <span className="text-sm">{t('listening')}</span>
                  </>
                ) : (
                  <span className="text-base">{t('tapToSpeak')}</span>
                )}
              </button>
            )}

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={micSupported ? 3 : 5}
              placeholder={micSupported ? t('orTypeHint') : t('writeYourAnswer')}
              className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 mt-3 outline-none focus:border-[var(--violet-light)] resize-none"
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className={canSend ? 'text-[var(--emerald)] font-bold' : 'text-[var(--text-dim)]'}>
                {canSend ? `${words} ${t(words === 1 ? 'word' : 'words')} ✓` : (micSupported ? '' : t('minWordsHint'))}
              </span>
            </div>

            {hint && (
              <div className="mt-3 rounded-2xl px-3 py-2 text-sm pop-in" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}>
                💡 {hint}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button onClick={getHint} disabled={loadingHint} className="btn btn-ghost flex-1 text-sm disabled:opacity-50">
                {loadingHint ? t('thinking') : t('needHint')}
              </button>
              <button onClick={() => { if (listening) stopListen(); goToAI() }} disabled={!canSend} className="btn btn-primary flex-[1.4] text-sm disabled:opacity-40">
                {t('sendAnswer')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASO 2 — Respuesta de la IA */}
      {step === 2 && (
        <div className="space-y-4 fade-in">
          <Mascot
            emoji={player.avatar}
            color={av.color}
            name={av.name}
            mood={loadingAI ? 'thinking' : 'happy'}
            message={loadingAI ? t('mascotThink') : t('mascotLoved')}
            size={64}
          />

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

          <button onClick={() => { sfxPop(); setStep(3) }} disabled={loadingAI} className="btn btn-primary w-full disabled:opacity-40">
            {t('gotItNext')}
          </button>
        </div>
      )}

      {/* PASO 3 — Reflexión */}
      {step === 3 && (
        <div className="space-y-4 fade-in">
          <Mascot emoji={player.avatar} color={av.color} name={av.name} mood="happy" message={t('mascotReflect')} size={64} />

          <div className="card p-4">
            <div className="font-extrabold mb-3">🤔 {t('changedMind')}</div>
            <div className="grid grid-cols-3 gap-2">
              {[['yes', t('rYes')], ['abit', t('rABit')], ['no', t('rNo')]].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => pickReflection(setChangedMind, id)}
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
                  onClick={() => pickReflection(setHardest, id)}
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
