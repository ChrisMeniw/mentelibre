import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { AGE_GROUPS, pickMixedQuestions } from '../data/challenges'
import { pickAskTopics } from '../data/askTopics'
import { callClaude, roundReactSystemPrompt, parseReact, evaluateQuestion } from '../lib/claude'
import { localReact } from '../lib/localZoe'
import { useSpeech } from '../hooks/useSpeech'
import { speak, stopSpeak, speakSupported } from '../lib/speak'
import { sfxPop, sfxSend, sfxCorrect, sfxSparkle, sfxComplete, sfxLevelUp, sfxTick } from '../lib/sfx'
import { enterGameplay, exitGameplay } from '../lib/musicBus'
import Zoe from '../components/Zoe'
import StarsReveal from '../components/StarsReveal'

// COMPETENCIA POR EQUIPOS (2v2 / 5v5) en un mismo dispositivo (pass-and-play, ideal para
// el aula o la casa). Reglas CLARAS, timer rápido de 30s hacia abajo, puntaje por equipo,
// comodín x2 (estrategia) y un cierre donde ZOE da un TEMA y cada equipo inventa su mejor
// PREGUNTA (se califica 1-5, adaptado a la edad). Gana el equipo con más estrellas. 🏆

const QTURNS = 6 // turnos de respuesta (3 por equipo, alternados)
const BONUS_SECONDS = 30
const secondsForTurn = (turn) => Math.max(12, 30 - turn * 3) // 30,27,24,21,18,15 → pensar rápido
const countTeamPlayers = (fmt) => (fmt === '5v5' ? 5 : 2)

const TEAM_META = [
  { emoji: '🔵', color: '#38BDF8' },
  { emoji: '🔴', color: '#F43F5E' },
]

// Diccionario bilingüe local (ES / PT) de esta pantalla.
const DICT = {
  es: {
    title: 'Competencia por equipos', sub: 'Dos equipos, un ganador. ¡A pensar rápido!',
    format: 'Elige el formato', f2: '2 vs 2', f5: '5 vs 5', quick: 'Rápido',
    age: '¿Qué edad juega?', teamA: 'Equipo Azul', teamB: 'Equipo Rojo', teamName: 'Nombre del equipo',
    howTitle: '¿Cómo se juega?',
    how: [
      'Se juega por TURNOS en el mismo aparato (celular, compu o pizarra). Se lo pasan entre los jugadores.',
      'Cuando es el turno de tu equipo, uno de ustedes responde la pregunta. ¡Ustedes eligen quién! (esa es la estrategia).',
      'Tenés 30 segundos… y en cada turno hay MENOS tiempo. Hay que pensar rápido.',
      'ZOE puntúa qué tan bien pensaste, de 1 a 5 ⭐. Esas estrellas suman para tu equipo.',
      'Cada equipo tiene UN comodín ×2: úsenlo en el turno que quieran para duplicar las estrellas.',
      'Al final, ZOE les da un TEMA y cada equipo inventa su MEJOR pregunta. También suma estrellas.',
      '🏆 Gana el equipo con más estrellas. ¡El equipo campeón se lleva el trofeo y el orgullo!',
    ],
    start: '¡Empezar la competencia!', rules: 'Ver reglas', ready: '¡Entendido, a jugar!',
    turnOf: 'Turno de', round: 'Ronda', of: 'de', vs: 'vs', think: 'TIEMPO PARA PENSAR',
    question: 'LA PREGUNTA', listen: 'Escuchar', speakAns: '🎤 Toca y habla', writeAns: 'Escribe la respuesta del equipo…',
    respond: 'Responder →', use2x: '🃏 Usar comodín ×2', used2x: '×2 ACTIVADO', spent2x: 'Comodín usado',
    yourAns: 'RESPUESTA DEL EQUIPO', nextTurn: 'Siguiente turno →', hurry: '¡Rápido!',
    scoreboard: 'Marcador', pts: '⭐',
    bonusTitle: 'El desafío de ZOE 🦉', bonusIntro: 'Ahora al revés: yo les doy un tema y ustedes me hacen la MEJOR pregunta que se les ocurra. ¡La curiosidad suma estrellas!',
    topicFor: 'Tema para', writeQ: 'Escriban su mejor pregunta sobre el tema…', sendQ: 'Enviar pregunta →',
    winner: '¡Equipo campeón!', tie: '¡Empate! Los dos equipos pensaron genial 🤝',
    finalScore: 'Marcador final', playAgain: 'Jugar otra vez', backMenu: 'Volver al inicio', champion: '🏆 CAMPEÓN',
    timeUp: '¡Se acabó el tiempo! Sigamos. ⏱️', teamTurnHint: 'Que responda un jugador del equipo',
  },
  pt: {
    title: 'Competição por equipes', sub: 'Duas equipes, um vencedor. Pensar rápido!',
    format: 'Escolha o formato', f2: '2 vs 2', f5: '5 vs 5', quick: 'Rápido',
    age: 'Qual idade joga?', teamA: 'Equipe Azul', teamB: 'Equipe Vermelha', teamName: 'Nome da equipe',
    howTitle: 'Como se joga?',
    how: [
      'Joga-se por TURNOS no mesmo aparelho (celular, PC ou lousa). Vão passando entre os jogadores.',
      'Quando é a vez da sua equipe, um de vocês responde a pergunta. Vocês escolhem quem! (essa é a estratégia).',
      'Você tem 30 segundos… e a cada turno há MENOS tempo. Tem que pensar rápido.',
      'A ZOE pontua o quanto você pensou bem, de 1 a 5 ⭐. Essas estrelas somam para sua equipe.',
      'Cada equipe tem UM coringa ×2: usem no turno que quiserem para dobrar as estrelas.',
      'No final, a ZOE dá um TEMA e cada equipe inventa a MELHOR pergunta. Também soma estrelas.',
      '🏆 Vence a equipe com mais estrelas. A equipe campeã leva o troféu e o orgulho!',
    ],
    start: 'Começar a competição!', rules: 'Ver regras', ready: 'Entendi, bora jogar!',
    turnOf: 'Vez de', round: 'Rodada', of: 'de', vs: 'vs', think: 'TEMPO PARA PENSAR',
    question: 'A PERGUNTA', listen: 'Ouvir', speakAns: '🎤 Toque e fale', writeAns: 'Escreva a resposta da equipe…',
    respond: 'Responder →', use2x: '🃏 Usar coringa ×2', used2x: '×2 ATIVADO', spent2x: 'Coringa usado',
    yourAns: 'RESPOSTA DA EQUIPE', nextTurn: 'Próximo turno →', hurry: 'Rápido!',
    scoreboard: 'Placar', pts: '⭐',
    bonusTitle: 'O desafio da ZOE 🦉', bonusIntro: 'Agora ao contrário: eu dou um tema e vocês me fazem a MELHOR pergunta que imaginarem. A curiosidade soma estrelas!',
    topicFor: 'Tema para', writeQ: 'Escrevam a melhor pergunta sobre o tema…', sendQ: 'Enviar pergunta →',
    winner: 'Equipe campeã!', tie: 'Empate! As duas equipes pensaram demais 🤝',
    finalScore: 'Placar final', playAgain: 'Jogar de novo', backMenu: 'Voltar ao início', champion: '🏆 CAMPEÃ',
    timeUp: 'Acabou o tempo! Vamos seguir. ⏱️', teamTurnHint: 'Que responda um jogador da equipe',
  },
}

function Confetti({ n = 44 }) {
  const colors = ['#38BDF8', '#F43F5E', '#FBBF24', '#10B981', '#A855F7']
  const pieces = Array.from({ length: n }, (_, i) => ({ left: (i * 47) % 100, delay: (i % 7) * 0.12, dur: 1.9 + (i % 5) * 0.3, color: colors[i % colors.length], size: 7 + (i % 4) * 2 }))
  return pieces.map((p, i) => (<span key={i} className="confetti-piece" style={{ left: p.left + '%', width: p.size, height: p.size * 1.5, background: p.color, animationDuration: p.dur + 's', animationDelay: p.delay + 's' }} />))
}

export default function Competencia() {
  const { lang } = useLang()
  const L = DICT[lang] || DICT.es
  const nav = useNavigate()
  const { player } = usePlayer()

  const [phase, setPhase] = useState('setup') // setup | rules | play | bonus | winner
  const [format, setFormat] = useState('2v2')
  const [age, setAge] = useState(player.ageGroup || '9-11')
  const [teams, setTeams] = useState([
    { name: DICT[lang]?.teamA || 'Equipo Azul', ...TEAM_META[0], score: 0, boostUsed: false },
    { name: DICT[lang]?.teamB || 'Equipo Rojo', ...TEAM_META[1], score: 0, boostUsed: false },
  ])

  // Preguntas y temas fijados al empezar (según la edad elegida).
  const questionsRef = useRef([])
  const topicsRef = useRef([])

  const [turn, setTurn] = useState(0)          // 0..QTURNS-1 (fase play)
  const [bi, setBi] = useState(0)              // 0..1 (fase bonus, un tema por equipo)
  const [stage, setStage] = useState('answer') // answer | feedback
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [react, setReact] = useState('')
  const [gained, setGained] = useState(0)      // estrellas ganadas en este turno
  const [boostArmed, setBoostArmed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  const { listening, supported: micSupported, start: startListen, stop: stopListen } = useSpeech(lang === 'pt' ? 'pt-BR' : 'es-US')

  useEffect(() => { enterGameplay(); return () => exitGameplay() }, [])
  useEffect(() => () => stopSpeak(), [])

  const inGame = phase === 'play' || phase === 'bonus'
  const activeTeam = phase === 'bonus' ? bi : (turn % 2)   // qué equipo juega ahora
  const playerLabel = useMemo(() => {
    const perTeam = countTeamPlayers(format)
    const idxInTeam = Math.floor(turn / 2) % perTeam        // rota entre los jugadores del equipo
    return `${lang === 'pt' ? 'Jogador' : 'Jugador'} ${idxInTeam + 1}`
  }, [turn, format, lang])

  const q = questionsRef.current[turn]
  const qText = q ? (lang === 'pt' ? q.pt : q.es) : ''
  const topic = topicsRef.current[bi]
  const topicText = topic ? (lang === 'pt' ? topic.pt : topic.es) : ''
  const promptText = phase === 'bonus' ? topicText : qText

  // Lee en voz alta la consigna al entrar a cada turno + reinicia el reloj.
  useEffect(() => {
    if (!inGame || stage !== 'answer') return
    setTimeLeft(phase === 'bonus' ? BONUS_SECONDS : secondsForTurn(turn))
    setBoostArmed(false)
    if (promptText) { const tm = setTimeout(() => speak(promptText, lang), 350); return () => { clearTimeout(tm); stopSpeak() } }
    return () => stopSpeak()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn, bi, phase, stage])

  // Cuenta regresiva.
  useEffect(() => {
    if (!inGame || stage !== 'answer') return
    if (timeLeft <= 0) { handleTimeUp(); return }
    const id = setTimeout(() => setTimeLeft((s) => { const n = Math.max(0, s - 1); if (n > 0 && n <= 5) sfxTick(); return n }), 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, stage])

  const addToTeam = (idx, stars) => setTeams((ts) => ts.map((tm, i) => i === idx ? { ...tm, score: tm.score + stars } : tm))
  const secondsMax = phase === 'bonus' ? BONUS_SECONDS : secondsForTurn(turn)
  const timePct = Math.max(0, Math.round((timeLeft / secondsMax) * 100))

  // ---------- iniciar ----------
  const begin = () => {
    sfxPop()
    questionsRef.current = pickMixedQuestions(age, QTURNS)
    topicsRef.current = pickAskTopics(age, 2)
    setTeams((ts) => ts.map((tm) => ({ ...tm, score: 0, boostUsed: false })))
    setTurn(0); setBi(0); setStage('answer'); setAnswer(''); setReact(''); setGained(0)
    setPhase('rules')
  }
  const goPlay = () => { sfxPop(); setPhase('play') }

  // ---------- responder (fase play) ----------
  const respondAnswer = async () => {
    if (!answer.trim() || stage !== 'answer') return
    sfxSend(); if (listening) stopListen(); stopSpeak()
    setStage('feedback'); setLoading(true); setReact('')
    const teamName = teams[activeTeam].name
    const res = await callClaude(roundReactSystemPrompt(teamName, lang, age), `Pregunta: ${qText}\nRespuesta: ${answer}`, 120)
    const parsed = res ? parseReact(res) : localReact(teamName, answer, lang, age)
    const stars = parsed.stars
    const total = boostArmed ? stars * 2 : stars
    setGained(total); setReact(parsed.text)
    addToTeam(activeTeam, total)
    setLoading(false)
    stars >= 4 ? sfxCorrect() : stars >= 2 ? sfxCorrect() : sfxSparkle()
  }

  // ---------- enviar pregunta (fase bonus) ----------
  const respondQuestion = async () => {
    if (!answer.trim() || stage !== 'answer') return
    sfxSend(); if (listening) stopListen(); stopSpeak()
    setStage('feedback'); setLoading(true); setReact('')
    const teamName = teams[bi].name
    const { stars, feedback } = await evaluateQuestion(topicText, answer, age, lang, teamName)
    setGained(stars); setReact(feedback)
    addToTeam(bi, stars)
    setLoading(false)
    stars >= 3 ? sfxCorrect() : sfxSparkle()
  }

  const handleTimeUp = () => {
    if (!inGame || stage !== 'answer') return
    if (answer.trim()) { phase === 'bonus' ? respondQuestion() : respondAnswer(); return }
    if (listening) stopListen()
    stopSpeak(); sfxSparkle()
    setStage('feedback'); setLoading(false); setGained(0); setReact(L.timeUp)
  }

  const armBoost = () => { sfxPop(); setBoostArmed(true); setTeams((ts) => ts.map((tm, i) => i === activeTeam ? { ...tm, boostUsed: true } : tm)) }

  // ---------- avanzar ----------
  const next = () => {
    sfxPop(); setAnswer(''); setReact(''); setGained(0)
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (phase === 'play') {
      if (turn + 1 < QTURNS) { setTurn(turn + 1); setStage('answer') }
      else { setBi(0); setStage('answer'); setPhase('bonus') }
    } else { // bonus
      if (bi + 1 < 2) { setBi(bi + 1); setStage('answer') }
      else { sfxComplete(); setTimeout(() => sfxLevelUp(), 400); setPhase('winner'); window.scrollTo({ top: 0, behavior: 'instant' }) }
    }
  }

  // ============ SETUP ============
  if (phase === 'setup') {
    return (
      <div className="mx-auto max-w-md px-4 pt-14 pb-32 min-h-dvh safe-top">
        <button onClick={() => { sfxPop(); nav('/') }} aria-label="←" className="btn btn-ghost px-3 py-2 text-sm min-h-touch mb-3">←</button>
        <div className="text-center fade-in">
          <div className="floaty inline-block"><Zoe size={70} talking /></div>
          <h1 className="font-logo text-3xl grad-text mt-2">🏆 {L.title}</h1>
          <p className="text-sm text-[var(--text-dim)] mt-1">{L.sub}</p>
        </div>

        {/* Formato */}
        <div className="card p-4 mt-5 fade-in-d1">
          <div className="text-xs font-extrabold uppercase tracking-wide text-[var(--violet-light)] mb-2">{L.format}</div>
          <div className="grid grid-cols-2 gap-2">
            {[['2v2', L.f2, '👥'], ['5v5', L.f5, '👨‍👩‍👧‍👦']].map(([f, lbl, e]) => (
              <button key={f} onClick={() => { sfxPop(); setFormat(f) }}
                className="rounded-2xl px-3 py-4 font-black text-lg active:scale-95 transition min-h-touch"
                style={format === f ? { background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff', boxShadow: '0 8px 22px -8px rgba(124,58,237,0.9)' } : { background: 'rgba(255,255,255,0.06)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="text-2xl leading-none mb-1">{e}</div>{lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Edad */}
        <div className="card p-4 mt-3 fade-in-d1">
          <div className="text-xs font-extrabold uppercase tracking-wide text-[var(--violet-light)] mb-2">{L.age}</div>
          <div className="grid grid-cols-3 gap-2">
            {AGE_GROUPS.map((g) => (
              <button key={g} onClick={() => { sfxPop(); setAge(g) }}
                className="rounded-2xl px-2 py-3 font-black active:scale-95 transition min-h-touch"
                style={age === g ? { background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff' } : { background: 'rgba(255,255,255,0.06)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.12)' }}>{g}</button>
            ))}
          </div>
        </div>

        {/* Equipos */}
        <div className="grid grid-cols-2 gap-2 mt-3 fade-in-d2">
          {teams.map((tm, i) => (
            <div key={i} className="card p-3" style={{ boxShadow: `inset 0 0 0 1px ${tm.color}55` }}>
              <div className="text-2xl text-center">{tm.emoji}</div>
              <input value={tm.name} onChange={(e) => setTeams((ts) => ts.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                aria-label={L.teamName} maxLength={16}
                className="w-full bg-white/5 border border-white/12 rounded-xl px-2 py-2 mt-1 text-center text-sm font-extrabold outline-none focus:border-[var(--violet-light)]" />
            </div>
          ))}
        </div>

        <button onClick={begin} className="btn btn-gold w-full mt-5 text-lg min-h-touch" aria-label={L.start}>{L.start}</button>
      </div>
    )
  }

  // ============ RULES ============
  if (phase === 'rules') {
    return (
      <div className="mx-auto max-w-md px-4 pt-14 pb-32 min-h-dvh safe-top">
        <div className="text-center fade-in">
          <div className="floaty inline-block"><Zoe size={64} talking /></div>
          <h1 className="font-logo text-2xl grad-text mt-2">{L.howTitle}</h1>
          <div className="chip mx-auto mt-2 text-sm" style={{ background: 'rgba(124,58,237,0.18)', borderColor: 'rgba(168,85,247,0.5)' }}>
            {teams[0].emoji} {teams[0].name} <span className="text-[var(--text-dim)] mx-1">{L.vs}</span> {teams[1].emoji} {teams[1].name} · {format}
          </div>
        </div>
        <div className="card p-4 mt-4 fade-in-d1">
          <ol className="space-y-3">
            {L.how.map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-snug">
                <span className="shrink-0 grid place-items-center w-6 h-6 rounded-full font-black text-[12px]" style={{ background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff' }}>{i + 1}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
        <button onClick={goPlay} className="btn btn-gold w-full mt-5 text-lg min-h-touch" aria-label={L.ready}>{L.ready}</button>
        <button onClick={() => { sfxPop(); setPhase('setup') }} className="btn btn-ghost w-full mt-2 text-sm min-h-touch">←</button>
      </div>
    )
  }

  // ============ WINNER ============
  if (phase === 'winner') {
    const [a, b] = teams
    const tie = a.score === b.score
    const win = a.score >= b.score ? a : b
    return (
      <div className="relative mx-auto max-w-md px-4 pt-16 pb-32 min-h-dvh flex flex-col items-center justify-center text-center safe-top">
        <Confetti n={64} />
        <div className="card p-6 w-full bounce-in">
          <div className="text-6xl">{tie ? '🤝' : '🏆'}</div>
          {tie ? (
            <div className="font-logo text-2xl grad-text mt-2">{L.tie}</div>
          ) : (
            <>
              <div className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--gold)] mt-2">{L.champion}</div>
              <div className="font-logo text-3xl mt-1 leading-tight" style={{ color: win.color }}>{win.emoji} {win.name}</div>
            </>
          )}
          <div className="text-xs font-extrabold text-[var(--text-dim)] mt-3 uppercase tracking-wide">{L.finalScore}</div>
          <div className="flex items-center justify-center gap-4 mt-2">
            {teams.map((tm, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl">{tm.emoji}</span>
                <span className="font-black text-sm">{tm.name}</span>
                <span className="font-logo text-3xl" style={{ color: tm.color }}>{tm.score}⭐</span>
              </div>
            ))}
          </div>
          <button onClick={() => { setPhase('setup') }} className="btn btn-gold w-full mt-6 text-lg min-h-touch" aria-label={L.playAgain}>{L.playAgain}</button>
          <button onClick={() => { sfxPop(); nav('/') }} className="btn btn-ghost w-full mt-2 text-sm min-h-touch" aria-label={L.backMenu}>{L.backMenu}</button>
        </div>
      </div>
    )
  }

  // ============ PLAY / BONUS ============
  const team = teams[activeTeam]
  const canSend = answer.trim().length > 0
  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 min-h-dvh safe-top">
      {/* Marcador siempre visible */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <button onClick={() => { sfxPop(); stopSpeak(); nav('/') }} aria-label="🏠" className="btn btn-ghost px-3 py-2 text-base min-h-touch">🏠</button>
        <div className="flex-1 flex items-center justify-center gap-2">
          {teams.map((tm, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-black"
              style={{ background: i === activeTeam ? `${tm.color}2e` : 'rgba(255,255,255,0.05)', border: `1px solid ${tm.color}${i === activeTeam ? '99' : '33'}` }}>
              {tm.emoji} <span style={{ color: tm.color }}>{tm.score}⭐</span>
            </span>
          ))}
        </div>
        <span className="text-xs font-extrabold text-[var(--text-dim)] w-12 text-right">
          {phase === 'bonus' ? '🦉' : `${L.round} ${turn + 1}/${QTURNS}`}
        </span>
      </div>

      {/* De quién es el turno */}
      <div className="text-center mb-3 reel-in" key={phase + '-' + turn + '-' + bi}>
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-black" style={{ background: `${team.color}22`, border: `1px solid ${team.color}66`, color: team.color }}>
          {team.emoji} {L.turnOf} {team.name}
        </div>
        {phase === 'play' && <div className="text-[11px] text-[var(--text-dim)] mt-1">{playerLabel} · {L.teamTurnHint}</div>}
      </div>

      {stage === 'answer' && (
        <div className="space-y-4 fade-in">
          {/* Reloj */}
          <div className="card p-3" style={{ boxShadow: timeLeft <= 8 ? '0 0 0 1.5px rgba(244,63,94,0.55)' : undefined }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-extrabold uppercase tracking-wide" style={{ color: timeLeft <= 8 ? '#F43F5E' : 'var(--text-dim)' }}>⏱ {L.think}</span>
              <span className={'font-logo text-2xl ' + (timeLeft <= 5 && timeLeft > 0 ? 'happy-shake' : '')} style={{ color: timeLeft <= 8 ? '#F43F5E' : 'var(--gold)' }}>{timeLeft}s</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className={'h-full rounded-full transition-all duration-1000 ' + (timeLeft <= 8 ? 'timer-pulse' : '')} style={{ width: timePct + '%', background: timeLeft <= 8 ? 'linear-gradient(90deg,#F43F5E,#fb7185)' : `linear-gradient(90deg,${team.color},var(--gold))` }} />
            </div>
            {timeLeft <= 5 && timeLeft > 0 && <div className="text-center text-xs font-black text-[var(--rose)] mt-1.5">⚡ {L.hurry}</div>}
          </div>

          {/* Consigna: pregunta (play) o tema (bonus) */}
          <div className="card p-5" style={{ boxShadow: `inset 0 0 0 1px ${team.color}44` }}>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-extrabold uppercase tracking-wide" style={{ color: team.color }}>
                {phase === 'bonus' ? `${L.bonusTitle}` : L.question}
              </div>
              {speakSupported() && (
                <button onClick={() => speak(promptText, lang)} aria-label={L.listen} className="shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold active:scale-90 transition min-h-touch" style={{ background: `${team.color}22`, color: team.color, border: `1px solid ${team.color}55` }}>🔊 {L.listen}</button>
              )}
            </div>
            {phase === 'bonus' && <p className="text-[13px] text-[var(--text-dim)] mt-2 leading-snug">{L.bonusIntro}</p>}
            {phase === 'bonus' && <div className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--gold)] mt-3">{topic?.e} {L.topicFor} {team.name}:</div>}
            <p className="mt-2 text-lg font-extrabold leading-snug">{promptText}</p>
          </div>

          {/* Comodín x2 (solo en preguntas) */}
          {phase === 'play' && (
            team.boostUsed ? (
              <div className="text-center text-xs font-extrabold" style={{ color: boostArmed ? 'var(--gold)' : 'var(--text-dim)' }}>{boostArmed ? `🃏 ${L.used2x}` : `✓ ${L.spent2x}`}</div>
            ) : (
              <button onClick={armBoost} className="w-full rounded-2xl py-3 font-black active:scale-95 transition min-h-touch" style={{ background: 'linear-gradient(135deg,rgba(251,191,36,0.25),rgba(244,63,94,0.18))', border: '1px solid rgba(251,191,36,0.55)', color: 'var(--gold)' }}>{L.use2x}</button>
            )
          )}

          {/* Responder */}
          <div className="card p-4">
            {micSupported && (
              <button onClick={() => { if (listening) { sfxPop(); stopListen() } else { sfxPop(); const b = answer.trim() ? answer.trim() + ' ' : ''; startListen((tx) => setAnswer(b + tx)) } }}
                aria-label={L.speakAns}
                className={'w-full rounded-2xl py-3.5 px-4 flex items-center justify-center gap-3 font-extrabold text-white transition active:scale-[0.98] min-h-touch ' + (listening ? 'mic-pulse' : '')}
                style={{ background: listening ? 'linear-gradient(135deg,#FB7185,#E11D48)' : 'linear-gradient(135deg,#A855F7,#7C3AED)' }}>
                <span className="text-base">{L.speakAns}</span>
              </button>
            )}
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={micSupported ? 2 : 4}
              aria-label={phase === 'bonus' ? L.writeQ : L.writeAns} placeholder={phase === 'bonus' ? L.writeQ : L.writeAns}
              className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 mt-3 outline-none focus:border-[var(--violet-light)] resize-none text-base" />
            <button onClick={() => { if (listening) stopListen(); phase === 'bonus' ? respondQuestion() : respondAnswer() }} disabled={!canSend}
              className="btn btn-gold w-full mt-3 disabled:opacity-40 min-h-touch" aria-label={phase === 'bonus' ? L.sendQ : L.respond}>{phase === 'bonus' ? L.sendQ : L.respond}</button>
          </div>
        </div>
      )}

      {stage === 'feedback' && (
        <div className="space-y-4 fade-in">
          <div className="card p-4" style={{ boxShadow: `inset 0 0 0 1px ${team.color}33` }}>
            <div className="text-xs font-extrabold uppercase tracking-wide text-[var(--text-dim)]">{L.yourAns}</div>
            <blockquote className="mt-1 border-l-2 pl-3 italic text-[var(--text-dim)] text-sm" style={{ borderColor: team.color }}>{answer || '—'}</blockquote>
          </div>
          <div className="relative card p-5 text-center overflow-hidden" role="status" aria-live="polite"
            style={{ background: loading ? undefined : `linear-gradient(180deg, ${team.color}22, rgba(255,255,255,0.03))` }}>
            {!loading && gained >= 4 && <Confetti n={30} />}
            <div className="grid place-items-center"><Zoe size={70} talking={!loading} /></div>
            {loading ? (
              <div className="mt-2 text-[var(--text-dim)] text-sm font-bold">💭 …</div>
            ) : (
              <>
                {gained > 0 && (
                  <>
                    <div className="mt-1"><StarsReveal stars={gained} /></div>
                    <div className="mt-1 font-black text-sm" style={{ color: team.color }}>+{gained}⭐ {team.emoji} {team.name}{boostArmed ? ' ·  ×2 🃏' : ''}</div>
                  </>
                )}
                <p className="mt-2 text-[15px] font-bold leading-snug">{react}</p>
              </>
            )}
          </div>
          <button onClick={next} disabled={loading} className="btn btn-gold w-full disabled:opacity-40 min-h-touch">
            {(phase === 'play' && turn + 1 >= QTURNS) ? L.bonusTitle : (phase === 'bonus' && bi + 1 >= 2) ? '🏆' : L.nextTurn}
          </button>
        </div>
      )}
    </div>
  )
}
