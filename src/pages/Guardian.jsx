import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLang, pickLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { getWorld, pickRoundQuestions } from '../data/challenges'
import { guardianOf, GUARDIAN_HP, GUARDIAN_WIN, GUARDIAN_QUESTIONS, GUARDIAN_SECONDS, GUARDIAN_REWARD } from '../data/guardians'
import { POWERS } from '../data/powers'
import { callClaude, roundReactSystemPrompt, parseReact } from '../lib/claude'
import { localReact } from '../lib/localZoe'
import { useSpeech } from '../hooks/useSpeech'
import { speak, stopSpeak } from '../lib/speak'
import { sfxPop, sfxSend, sfxCorrect, sfxSparkle, sfxComplete, sfxLevelUp, sfxTick, sfxStarsFanfare } from '../lib/sfx'
import { enterGameplay, exitGameplay } from '../lib/musicBus'
import Zoe from '../components/Zoe'
import StarsReveal from '../components/StarsReveal'

// ⚔️ BATALLA CONTRA EL GUARDIÁN — el "jefe" del planeta. Cada estrella de tus
// respuestas le QUITA VIDA. 3 preguntas, 20 segundos, y hay que hacerle 9+ de daño
// para vencerlo. Victoria = planeta CORONADO 👑 + botín grande. Se puede reintentar.

const DICT = {
  es: {
    boss: 'GUARDIÁN DEL PLANETA', hp: 'VIDA', dmg: 'daño', fight: '⚔️ ¡A pensar!',
    intro1: 'Apareció el guardián', intro2: 'Vence sus trampas PENSANDO: cada ⭐ de tus respuestas le quita vida.',
    goal: `Hazle ${GUARDIAN_WIN} de daño en ${GUARDIAN_QUESTIONS} preguntas y el planeta es tuyo 👑`,
    q: 'PREGUNTA', timeFor: 'TIEMPO', hit: '¡Le pegaste', win: '¡GUARDIÁN VENCIDO!',
    winSub: '¡Coronaste el planeta! Tu forma de pensar fue más fuerte.',
    lose: 'El guardián resiste…', loseSub: 'Te faltó poquito. Explica tus porqués y vuelve: ¡lo tienes!',
    retry: 'Reintentar ⚔️', backMap: 'Volver al mapa', reward: 'BOTÍN', answerPh: 'Escribe tu respuesta…',
    respond: '¡Atacar con tu idea! ⚡', speakBtn: '🎤 Toca y habla', timeUp: '¡Se acabó el tiempo! El guardián esquivó.',
    crowned: 'Planeta coronado', next: 'Siguiente →', seeResult: 'Ver el final →',
  },
  pt: {
    boss: 'GUARDIÃO DO PLANETA', hp: 'VIDA', dmg: 'dano', fight: '⚔️ Bora pensar!',
    intro1: 'Apareceu o guardião', intro2: 'Vença as armadilhas dele PENSANDO: cada ⭐ das suas respostas tira vida.',
    goal: `Cause ${GUARDIAN_WIN} de dano em ${GUARDIAN_QUESTIONS} perguntas e o planeta é seu 👑`,
    q: 'PERGUNTA', timeFor: 'TEMPO', hit: 'Você acertou', win: 'GUARDIÃO VENCIDO!',
    winSub: 'Você coroou o planeta! Seu jeito de pensar foi mais forte.',
    lose: 'O guardião resiste…', loseSub: 'Faltou pouquinho. Explique seus porquês e volte: você consegue!',
    retry: 'Tentar de novo ⚔️', backMap: 'Voltar ao mapa', reward: 'RECOMPENSA', answerPh: 'Escreva sua resposta…',
    respond: 'Atacar com sua ideia! ⚡', speakBtn: '🎤 Toque e fale', timeUp: 'Acabou o tempo! O guardião desviou.',
    crowned: 'Planeta coroado', next: 'Próxima →', seeResult: 'Ver o final →',
  },
}

export default function Guardian() {
  const { world: worldId } = useParams()
  const nav = useNavigate()
  const { lang } = useLang()
  const L = DICT[lang] || DICT.es
  const { player, addXP, addCoins, addPower, addLights, trackDaily, beatGuardian } = usePlayer()

  const world = getWorld(worldId)
  const G = guardianOf(worldId)

  const questionsRef = useRef(null)
  if (questionsRef.current === null) questionsRef.current = pickRoundQuestions(worldId, player.ageGroup, GUARDIAN_QUESTIONS, [])
  const [phase, setPhase] = useState('intro') // intro | fight | win | lose
  const [qi, setQi] = useState(0)
  const [stage, setStage] = useState('answer') // answer | feedback
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [react, setReact] = useState('')
  const [qStars, setQStars] = useState(0)
  const [damage, setDamage] = useState(0)      // daño total hecho al jefe
  const [hitAnim, setHitAnim] = useState(0)    // dispara la animación de golpe
  const [timeLeft, setTimeLeft] = useState(GUARDIAN_SECONDS)
  const [prize, setPrize] = useState(null)

  const { listening, supported: micSupported, start: startListen, stop: stopListen } = useSpeech(lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-US')

  useEffect(() => { enterGameplay(); return () => exitGameplay() }, [])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [phase])
  useEffect(() => () => stopSpeak(), [])

  const q = questionsRef.current[qi]
  const qText = q ? (pickLang(q, lang)) : ''
  const childName = player.name || 'amigo'

  // Reloj de 20s por pregunta (más presión que una ronda normal).
  useEffect(() => {
    if (phase !== 'fight' || stage !== 'answer') return
    setTimeLeft(GUARDIAN_SECONDS)
    if (qText) { const tm = setTimeout(() => speak(qText, lang), 350); return () => { clearTimeout(tm); stopSpeak() } }
    return () => stopSpeak()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi, phase, stage])

  useEffect(() => {
    if (phase !== 'fight' || stage !== 'answer') return
    if (timeLeft <= 0) { handleTimeUp(); return }
    const id = setTimeout(() => setTimeLeft((s) => { const n = Math.max(0, s - 1); if (n > 0 && n <= 5) sfxTick(); return n }), 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, stage])

  if (!world || !G) { nav('/hub'); return null }
  const gName = pickLang(G, lang, 'name_')
  const hpLeft = Math.max(0, GUARDIAN_HP - damage)
  const hpPct = Math.round((hpLeft / GUARDIAN_HP) * 100)

  const respond = async () => {
    if (!answer.trim()) return
    sfxSend(); if (listening) stopListen(); stopSpeak()
    setStage('feedback'); setLoading(true); setReact('')
    const res = await callClaude(roundReactSystemPrompt(childName, lang, player.ageGroup), `Pregunta: ${qText}\nRespuesta: ${answer}`, 120)
    const parsed = res ? parseReact(res) : localReact(childName, answer, lang, player.ageGroup)
    setQStars(parsed.stars); setReact(parsed.text)
    setDamage((d) => d + parsed.stars)
    setHitAnim((h) => h + 1)
    trackDaily({ answers: 1, stars: parsed.stars })
    setLoading(false)
    parsed.stars >= 4 ? sfxStarsFanfare() : parsed.stars >= 2 ? sfxCorrect() : sfxSparkle()
  }

  const handleTimeUp = () => {
    if (phase !== 'fight' || stage !== 'answer') return
    if (answer.trim()) { respond(); return }
    if (listening) stopListen()
    stopSpeak(); sfxSparkle()
    setStage('feedback'); setLoading(false); setQStars(0); setReact(L.timeUp)
  }

  const next = () => {
    sfxPop()
    if (qi + 1 < GUARDIAN_QUESTIONS) { setQi(qi + 1); setAnswer(''); setReact(''); setStage('answer'); return }
    // Final de la batalla
    if (damage >= GUARDIAN_WIN) {
      const pw = POWERS[Math.floor(Math.random() * POWERS.length)]
      addXP(GUARDIAN_REWARD.xp); addCoins(GUARDIAN_REWARD.coins); addPower(pw.id, 1); addLights(damage)
      beatGuardian(worldId)
      setPrize({ ...GUARDIAN_REWARD, power: pw })
      sfxComplete(); setTimeout(() => sfxLevelUp(), 450)
      setPhase('win')
    } else {
      setPhase('lose')
    }
  }

  const retry = () => {
    sfxPop()
    questionsRef.current = pickRoundQuestions(worldId, player.ageGroup, GUARDIAN_QUESTIONS, [])
    setQi(0); setDamage(0); setAnswer(''); setReact(''); setStage('answer'); setPhase('fight')
  }

  // ---------- INTRO DEL JEFE ----------
  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-md px-4 pt-16 pb-32 min-h-dvh flex flex-col items-center justify-center text-center safe-top fade-in">
        <div className="text-[11px] font-extrabold tracking-[0.25em] uppercase" style={{ color: G.color }}>{L.boss}</div>
        <div className="boss-breathe text-8xl mt-3" style={{ filter: `drop-shadow(0 14px 34px ${G.color}aa)` }}>{G.emoji}</div>
        <h1 className="font-logo text-3xl grad-text mt-3 leading-tight">{gName}</h1>
        <p className="mt-2 text-base font-bold italic text-[var(--text-dim)]">“{pickLang(G, lang, 'taunt_')}”</p>
        <div className="card p-4 mt-5 text-sm leading-snug">
          <p>{L.intro2}</p>
          <p className="mt-2 font-extrabold text-[var(--gold)]">{L.goal}</p>
          <p className="mt-2 text-[12.5px] text-[var(--text-dim)]">💜 {pickLang(G, lang, 'weak_')}</p>
        </div>
        <button onClick={() => { sfxPop(); setPhase('fight') }} className="btn btn-gold w-full max-w-xs mt-6 text-lg min-h-touch glow-pulse">{L.fight}</button>
        <button onClick={() => { sfxPop(); nav('/hub') }} className="btn btn-ghost w-full max-w-xs mt-2 text-sm min-h-touch">{L.backMap}</button>
      </div>
    )
  }

  // ---------- VICTORIA / DERROTA ----------
  if (phase === 'win' || phase === 'lose') {
    const won = phase === 'win'
    return (
      <div className="mx-auto max-w-md px-4 pt-16 pb-32 min-h-dvh flex flex-col items-center justify-center text-center safe-top">
        <div className="card p-6 w-full bounce-in">
          <div className="text-7xl">{won ? '👑' : G.emoji}</div>
          <div className="font-logo text-3xl grad-text mt-2 leading-tight">{won ? L.win : L.lose}</div>
          <p className="text-sm text-[var(--text-dim)] mt-2">{won ? L.winSub : L.loseSub}</p>
          <div className="mt-3 text-sm font-black" style={{ color: G.color }}>{L.dmg}: {damage}/{GUARDIAN_HP} · {won ? '✅' : `${L.hp}: ${hpLeft}`}</div>
          {won && prize && (
            <div className="mt-4 rounded-2xl p-3" style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.45)' }}>
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--gold)]">{L.reward}</div>
              <div className="mt-1.5 flex items-center justify-center gap-2 flex-wrap">
                <span className="chip font-black text-[var(--gold)]">+{prize.xp} XP</span>
                <span className="chip font-black"><span className="coin-spin">🪙</span> +{prize.coins}</span>
                <span className="chip font-black">{prize.power.emoji} +1 {pickLang(prize.power, lang, 'name_')}</span>
              </div>
              <div className="text-xs font-extrabold text-[var(--violet-light)] mt-2">👑 {L.crowned}: {pickLang(world, lang, 'name_')}</div>
            </div>
          )}
          {won
            ? <button onClick={() => { sfxPop(); nav('/hub') }} className="btn btn-gold w-full mt-5 text-lg min-h-touch">{L.backMap}</button>
            : (
              <>
                <button onClick={retry} className="btn btn-gold w-full mt-5 text-lg min-h-touch">{L.retry}</button>
                <button onClick={() => { sfxPop(); nav('/hub') }} className="btn btn-ghost w-full mt-2 text-sm min-h-touch">{L.backMap}</button>
              </>
            )}
        </div>
      </div>
    )
  }

  // ---------- PELEA ----------
  const canSend = answer.trim().length > 0
  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 min-h-dvh safe-top">
      {/* Barra del jefe: emoji + VIDA */}
      <div className="card p-3 mb-3" style={{ boxShadow: `inset 0 0 0 1px ${G.color}55` }}>
        <div className="flex items-center gap-3">
          <span key={hitAnim} className={'text-4xl ' + (hitAnim ? 'boss-hit' : 'boss-breathe')}>{G.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black truncate">{gName}</span>
              <span className="text-xs font-black" style={{ color: G.color }}>{L.hp} {hpLeft}/{GUARDIAN_HP}</span>
            </div>
            <div className="h-3 mt-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: hpPct + '%', background: `linear-gradient(90deg, ${G.color}, var(--rose))` }} />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] font-extrabold text-[var(--text-dim)]">
          <span>{L.q} {qi + 1}/{GUARDIAN_QUESTIONS}</span>
          <span className={timeLeft <= 5 ? 'text-[var(--rose)]' : ''}>⏱ {timeLeft}s</span>
        </div>
      </div>

      <div key={qi} className="reel-in">
        {stage === 'answer' && (
          <div className="space-y-3 fade-in">
            <div className="card p-5" style={{ boxShadow: `inset 0 0 0 1px ${world.color}44` }}>
              <p className="text-lg font-extrabold leading-snug">{qText}</p>
            </div>
            <div className="card p-4">
              {micSupported && (
                <button onClick={() => { if (listening) { sfxPop(); stopListen() } else { sfxPop(); const b = answer.trim() ? answer.trim() + ' ' : ''; startListen((committed, preview = '') => setAnswer((b + committed + (preview ? ' ' + preview : '')).replace(/\s+/g, ' '))) } }}
                  className={'w-full rounded-2xl py-3.5 flex items-center justify-center font-extrabold text-white transition active:scale-[0.98] min-h-touch ' + (listening ? 'mic-pulse' : '')}
                  style={{ background: listening ? 'linear-gradient(135deg,var(--rose-light),var(--rose-deep))' : 'linear-gradient(135deg,var(--violet-light),var(--violet))' }}>
                  {L.speakBtn}
                </button>
              )}
              <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={micSupported ? 2 : 4}
                placeholder={L.answerPh} aria-label={L.answerPh}
                className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 mt-3 outline-none focus:border-[var(--violet-light)] resize-none text-base" />
              <button onClick={() => { if (listening) stopListen(); respond() }} disabled={!canSend}
                className="btn btn-gold w-full mt-3 disabled:opacity-40 min-h-touch">{L.respond}</button>
            </div>
          </div>
        )}

        {stage === 'feedback' && (
          <div className="space-y-3 fade-in">
            <div className="relative card p-5 text-center overflow-hidden" role="status" aria-live="polite"
              style={{ background: loading ? undefined : `linear-gradient(180deg, ${G.color}1c, rgba(255,255,255,0.03))` }}>
              <div className="grid place-items-center"><Zoe size={64} talking={!loading} /></div>
              {loading ? (
                <div className="mt-2 text-[var(--text-dim)] text-sm font-bold">💭 …</div>
              ) : (
                <>
                  {qStars > 0 && <div className="mt-1"><StarsReveal stars={qStars} /></div>}
                  {qStars > 0 && <div className="mt-1 font-black text-sm" style={{ color: G.color }}>⚔️ {L.hit} {qStars}!</div>}
                  <p className="mt-2 text-[15px] font-bold leading-snug">{react}</p>
                </>
              )}
            </div>
            <button onClick={next} disabled={loading} className="btn btn-gold w-full disabled:opacity-40 min-h-touch">
              {qi + 1 < GUARDIAN_QUESTIONS ? L.next : L.seeResult}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
