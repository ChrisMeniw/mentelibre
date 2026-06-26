import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { AGE_GROUPS, pickMixedQuestions } from '../data/challenges'
import { callClaude, scoreSystemPrompt, parseScore } from '../lib/claude'
import { useSpeech } from '../hooks/useSpeech'
import { speak, stopSpeak, speakSupported } from '../lib/speak'
import { sfxPop, sfxSend, sfxCorrect, sfxSparkle, sfxComplete } from '../lib/sfx'
import { enterGameplay, exitGameplay } from '../lib/musicBus'
import { loadScores, saveScore, schoolRanking } from '../lib/classroom'
import Zoe from '../components/Zoe'

const N = 20
const SECONDS = 30
const STAR_POINTS = { 1: 20, 2: 50, 3: 90 }

export default function Classroom() {
  const { t, lang } = useLang()
  const { player } = usePlayer()
  const nav = useNavigate()
  const location = useLocation()

  // Si venís desde "Ranking de escuelas" en el inicio, abre directo la tabla.
  const [phase, setPhase] = useState(location.state?.view === 'board' ? 'board' : 'setup')   // setup | playing | results | board
  const [school, setSchool] = useState(player.school || '')
  const [group, setGroup] = useState('')
  const [age, setAge] = useState(player.ageGroup || '9-11')

  const [questions, setQuestions] = useState([])
  const [qi, setQi] = useState(0)
  const [stage, setStage] = useState('answer')  // answer | scoring | feedback
  const [answer, setAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(SECONDS)
  const [score, setScore] = useState(0)
  const [fb, setFb] = useState({ stars: 0, points: 0, timeout: false })
  const [results, setResults] = useState(null)
  const [boardTab, setBoardTab] = useState('groups')
  const usedSecondsRef = useRef(SECONDS)

  const { listening, supported: micSupported, start: startListen, stop: stopListen } = useSpeech(lang === 'pt' ? 'pt-BR' : 'es-US')

  const q = questions[qi]
  const qText = q ? (lang === 'pt' ? q.pt : q.es) : ''

  // Timer de 30s basado en reloj real (inmune al doble montaje de StrictMode).
  // Se rearma solo al cambiar de pregunta o de etapa, no en cada tick.
  useEffect(() => {
    if (phase !== 'playing' || stage !== 'answer') return
    setTimeLeft(SECONDS)
    const end = Date.now() + SECONDS * 1000
    const id = setInterval(() => {
      const left = Math.ceil((end - Date.now()) / 1000)
      if (left <= 0) { clearInterval(id); setTimeLeft(0); handleTimeout() }
      else setTimeLeft(left)
    }, 250)
    let tts
    if (age === '6-8' && qText) tts = setTimeout(() => speak(qText, lang), 300)
    return () => { clearInterval(id); if (tts) clearTimeout(tts); stopSpeak() }
  }, [qi, phase, stage]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => stopSpeak(), [])

  // La música del menú se calla mientras se está jugando la tanda.
  useEffect(() => {
    if (phase !== 'playing') return
    enterGameplay()
    return () => exitGameplay()
  }, [phase])

  const begin = () => {
    if (school.trim().length < 2 || group.trim().length < 1) return
    sfxPop()
    setQuestions(pickMixedQuestions(age, N))
    setQi(0); setScore(0); setAnswer(''); setStage('answer'); setTimeLeft(SECONDS)
    setPhase('playing')
  }

  const toggleVoice = () => {
    if (listening) { sfxPop(); stopListen(); return }
    sfxPop()
    const base = answer.trim() ? answer.trim() + ' ' : ''
    startListen((text) => setAnswer(base + text))
  }

  const respond = async () => {
    if (!answer.trim() || stage !== 'answer') return
    usedSecondsRef.current = timeLeft
    if (listening) stopListen()
    stopSpeak(); sfxSend()
    setStage('scoring')
    const res = await callClaude(scoreSystemPrompt(lang), `Pregunta: ${qText}\nRespuesta: ${answer}`, 5)
    const stars = res ? parseScore(res) : 2
    const points = STAR_POINTS[stars] + Math.max(0, usedSecondsRef.current) // base + bonus por rapidez
    setScore((s) => s + points)
    setFb({ stars, points, timeout: false })
    setStage('feedback')
    stars >= 2 ? sfxCorrect() : sfxSparkle()
  }

  function handleTimeout() {
    if (stage !== 'answer') return
    stopSpeak()
    setFb({ stars: 0, points: 0, timeout: true })
    setStage('feedback')
  }

  const next = () => {
    sfxPop()
    if (qi + 1 < N) {
      setTimeLeft(SECONDS) // reset ANTES de volver a 'answer' (evita timeout instantáneo si la anterior se agotó)
      setQi(qi + 1); setAnswer(''); setStage('answer')
      window.scrollTo({ top: 0, behavior: 'instant' })
    } else {
      finish()
    }
  }

  const finish = () => {
    sfxComplete()
    const entry = { school: school.trim(), group: group.trim(), score, date: new Date().toLocaleDateString() }
    saveScore(entry)
    setResults(entry)
    setPhase('results')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  // ---------- SETUP ----------
  if (phase === 'setup') {
    const ready = school.trim().length >= 2 && group.trim().length >= 1
    return (
      <div className="mx-auto max-w-md px-4 pt-14 pb-32 safe-top">
        <button onClick={() => { sfxPop(); nav('/') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-sm min-h-touch mb-3">←</button>
        <div className="text-center fade-in">
          <div className="chip mx-auto mb-2 text-xs" style={{ background: 'rgba(168,85,247,0.16)', borderColor: 'rgba(168,85,247,0.5)', color: '#E9D5FF' }}>{t('groupBadge')}</div>
          <div className="floaty inline-block"><Zoe size={76} talking /></div>
          <h1 className="font-logo text-3xl grad-text mt-2">{t('classroomMode')}</h1>
          <p className="text-sm text-[var(--text-dim)] mt-2 leading-relaxed">{t('classroomDesc')}</p>
        </div>

        <div className="card p-4 mt-5 space-y-4 fade-in-d1">
          <div>
            <label className="text-sm font-extrabold">{t('caSchoolLabel')}</label>
            <input value={school} onChange={(e) => setSchool(e.target.value)} placeholder={t('caSchoolPh')} className="input mt-1" aria-label={t('caSchoolLabel')} />
          </div>
          <div>
            <label className="text-sm font-extrabold">{t('caGroupLabel')}</label>
            <input value={group} onChange={(e) => setGroup(e.target.value)} placeholder={t('caGroupPh')} className="input mt-1" aria-label={t('caGroupLabel')} />
          </div>
          <div>
            <label className="text-sm font-extrabold">{t('caAgeLabel')}</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {AGE_GROUPS.map((g) => (
                <button key={g} onClick={() => { sfxPop(); setAge(g) }} className="btn text-sm min-h-touch"
                  style={age === g ? { background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff' } : { background: 'rgba(255,255,255,0.06)', color: 'var(--text)' }}>{g}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs leading-snug rounded-xl px-3 py-2 fade-in-d1" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#A7F3D0' }}>🏆 {t('caSchoolNote')}</div>
        <button onClick={begin} disabled={!ready} className="btn btn-gold w-full mt-4 text-lg min-h-touch disabled:opacity-40" aria-label={t('caStart')}>{t('caStart')}</button>
        <button onClick={() => { sfxPop(); setPhase('board') }} className="btn btn-ghost w-full mt-2 text-sm min-h-touch" aria-label={t('caViewRanking')}>{t('caViewRanking')}</button>
      </div>
    )
  }

  // ---------- RESULTS ----------
  if (phase === 'results' && results) {
    return (
      <div className="mx-auto max-w-md px-4 pt-16 pb-32 min-h-dvh flex flex-col items-center justify-center text-center safe-top">
        <div className="card p-6 w-full bounce-in">
          <div className="grid place-items-center"><Zoe size={92} talking /></div>
          <div className="font-logo text-2xl grad-text mt-2">{t('caResultsTitle')}</div>
          <div className="text-sm font-bold mt-1">{results.group} · <span className="text-[var(--text-dim)]">{results.school}</span></div>
          <div className="count-pop mt-4">
            <div className="text-[11px] uppercase tracking-widest text-[var(--gold)] font-extrabold">{t('caFinalScore')}</div>
            <div className="font-logo text-5xl text-[var(--gold)] text-glow">{results.score}</div>
            <div className="text-xs text-[var(--text-dim)]">{t('caPoints')}</div>
          </div>
          <button onClick={() => { sfxPop(); setPhase('board') }} className="btn btn-gold w-full mt-6 min-h-touch">{t('caViewRanking')}</button>
          <button onClick={() => { sfxPop(); setGroup(''); setAnswer(''); setPhase('setup') }} className="btn btn-ghost w-full mt-2 text-sm min-h-touch">{t('caPlayAgain')}</button>
        </div>
      </div>
    )
  }

  // ---------- BOARD (ranking) ----------
  if (phase === 'board') {
    const scores = loadScores()
    const schools = schoolRanking(scores)
    const medal = (i) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`)
    return (
      <div className="mx-auto max-w-md px-4 pt-14 pb-32 safe-top">
        <button onClick={() => { sfxPop(); setPhase('setup') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-sm min-h-touch mb-3">←</button>
        <h1 className="font-logo text-2xl grad-text text-center">🏆 {t('caRankingTitle')}</h1>

        <div className="card flex p-1 gap-1 mt-4">
          {[['groups', t('caTabGroups')], ['schools', t('caTabSchools')]].map(([id, label]) => (
            <button key={id} onClick={() => { sfxPop(); setBoardTab(id) }} className="flex-1 btn text-sm py-2 min-h-touch"
              style={boardTab === id ? { background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff' } : { background: 'transparent', color: 'var(--text-dim)' }}>{label}</button>
          ))}
        </div>

        {scores.length === 0 ? (
          <div className="card p-6 text-center text-sm text-[var(--text-dim)] mt-4">{t('caNoScores')}</div>
        ) : boardTab === 'groups' ? (
          <div className="card overflow-hidden mt-4">
            {scores.slice(0, 20).map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0" style={{ background: i < 3 ? 'rgba(251,191,36,0.10)' : 'transparent' }}>
                <span className="w-7 text-center font-extrabold text-lg">{medal(i)}</span>
                <span className="flex-1 min-w-0">
                  <span className="font-bold truncate block">{s.group}</span>
                  <span className="text-[11px] text-[var(--text-dim)] truncate block">{s.school}</span>
                </span>
                <span className="font-logo text-lg text-[var(--gold)] tabular-nums">{s.score}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden mt-4">
            {schools.slice(0, 20).map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0" style={{ background: i < 3 ? 'rgba(251,191,36,0.10)' : 'transparent' }}>
                <span className="w-7 text-center font-extrabold text-lg">{medal(i)}</span>
                <span className="flex-1 min-w-0">
                  <span className="font-bold truncate block">🏫 {s.school}</span>
                  <span className="text-[11px] text-[var(--text-dim)]">{s.groups} {t('caGroupsWord')} · {t('caBestWord')} {s.best}</span>
                </span>
                <span className="font-logo text-lg text-[var(--gold)] tabular-nums">{s.best}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => { sfxPop(); setPhase('setup') }} className="btn btn-gold w-full mt-5 min-h-touch">{t('caNewGroup')}</button>
      </div>
    )
  }

  // ---------- PLAYING ----------
  const timePct = Math.max(0, Math.round((timeLeft / SECONDS) * 100))
  const low = timeLeft <= 10
  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 min-h-dvh safe-top">
      {/* Banner de modo: deja claro que es competencia en grupo por tu escuela */}
      <div className="card px-3 py-1.5 mb-2 flex items-center justify-center gap-2 text-[11px] font-extrabold" style={{ background: 'rgba(168,85,247,0.14)', borderColor: 'rgba(168,85,247,0.4)' }}>
        <span style={{ color: '#E9D5FF' }}>{t('groupBadge')}</span>
        <span className="text-[var(--text-dim)]">·</span>
        <span className="text-[var(--text-dim)] truncate">🏫 {school}</span>
      </div>
      {/* Header: progreso + puntaje */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="font-extrabold text-sm text-[var(--text-dim)]">{group}</div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-dim)]">{qi + 1}/{N}</span>
          <span className="chip" style={{ borderColor: 'rgba(251,191,36,0.5)' }}>🏆 <span className="text-[var(--gold)] font-black tabular-nums">{score}</span></span>
        </div>
      </div>

      {/* TIMER grande */}
      <div className="card p-3 mb-3" style={{ boxShadow: low ? 'inset 0 0 0 1px rgba(244,63,94,0.6)' : undefined }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className={'text-xs font-extrabold ' + (low ? 'text-[var(--rose)]' : 'text-[var(--text-dim)]')}>{low && stage === 'answer' ? t('caHurry') : '⏱️'}</span>
          <span className={'font-logo text-2xl tabular-nums ' + (low ? 'text-[var(--rose)]' : 'text-[var(--sky)]')}>{stage === 'answer' ? timeLeft : 0}s</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: (stage === 'answer' ? timePct : 0) + '%', background: low ? 'linear-gradient(90deg,#FB7185,#E11D48)' : 'linear-gradient(90deg,var(--sky),var(--violet-light))' }} />
        </div>
      </div>

      {/* Pregunta */}
      <div className="card p-4" style={{ boxShadow: `inset 0 0 0 1px ${q?.color || '#7C3AED'}44` }}>
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-extrabold uppercase tracking-wide" style={{ color: q?.color }}>{q?.emoji} {t('question')}</div>
          {speakSupported() && (
            <button onClick={() => { sfxPop(); speak(qText, lang) }} aria-label={t('listenQuestion')} className="shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold active:scale-90 transition min-h-touch" style={{ background: `${q?.color}22`, color: q?.color, border: `1px solid ${q?.color}55` }}>🔊 {t('listenQuestion')}</button>
          )}
        </div>
        <p className="mt-2 text-lg font-extrabold leading-snug">{qText}</p>
      </div>

      {stage === 'answer' && (
        <div className="card p-4 mt-3 fade-in">
          {micSupported && (
            <button onClick={toggleVoice} aria-label={listening ? t('listening') : t('tapToSpeak')} className={'w-full rounded-2xl py-3.5 px-4 flex items-center justify-center gap-3 font-extrabold text-white transition active:scale-[0.98] min-h-touch ' + (listening ? 'mic-pulse' : '')} style={{ background: listening ? 'linear-gradient(135deg,#FB7185,#E11D48)' : 'linear-gradient(135deg,#A855F7,#7C3AED)' }}>
              {listening ? <span className="text-sm">{t('listening')}</span> : <span className="text-base">{t('tapToSpeak')}</span>}
            </button>
          )}
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={micSupported ? 2 : 4} aria-label={t('writeYourAnswer')} placeholder={micSupported ? t('orTypeHint') : t('writeYourAnswer')} className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 mt-3 outline-none focus:border-[var(--violet-light)] resize-none text-base" />
          <button onClick={respond} disabled={!answer.trim()} className="btn btn-primary w-full mt-3 disabled:opacity-40 min-h-touch" aria-label={t('respondBtn')}>{t('respondBtn')}</button>
        </div>
      )}

      {stage === 'scoring' && (
        <div className="card p-6 mt-3 text-center"><div className="text-[var(--text-dim)] text-sm caret">{t('aiThinking')}</div></div>
      )}

      {stage === 'feedback' && (
        <div className="card p-5 mt-3 text-center fade-in" style={{ background: fb.timeout ? 'linear-gradient(180deg, rgba(244,63,94,0.16), rgba(255,255,255,0.03))' : (fb.stars >= 2 ? 'linear-gradient(180deg, rgba(16,185,129,0.16), rgba(255,255,255,0.03))' : 'linear-gradient(180deg, rgba(251,191,36,0.14), rgba(255,255,255,0.03))') }}>
          {fb.timeout ? (
            <div className="font-extrabold text-[var(--rose)] text-lg">{t('caTimeUp')}</div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3].map((s) => <span key={s} className="text-2xl count-pop" style={{ animationDelay: `${s * 0.1}s`, filter: s <= fb.stars ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>)}
              </div>
              <div className="font-logo text-3xl text-[var(--gold)] text-glow mt-1 count-pop">+{fb.points}</div>
              <div className="text-xs text-[var(--text-dim)]">{t('caPoints')}</div>
            </>
          )}
          <button onClick={next} className="btn btn-gold w-full mt-4 min-h-touch">{qi + 1 < N ? t('nextQuestion') : t('seeResults')}</button>
        </div>
      )}
    </div>
  )
}
