import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { callClaude, roundReactSystemPrompt, parseReact, fallbackReact } from '../lib/claude'
import { useSpeech } from '../hooks/useSpeech'
import { speak, stopSpeak, speakSupported } from '../lib/speak'
import { sfxPop, sfxSend, sfxCorrect, sfxSparkle, sfxCoins } from '../lib/sfx'
import { enterGameplay, exitGameplay } from '../lib/musicBus'
import { dailyQuestion, dailyStatus, markDailyDone, prettyDate, todayKey } from '../lib/dailyChallenge'
import Zoe from '../components/Zoe'

const SITE = 'https://mentelibre.chrismeniwfoundation.org'

function Stars({ value }) {
  return (
    <div className="flex items-center justify-center gap-1" aria-label={`${value} de 3 estrellas`}>
      {[1, 2, 3].map((s) => (
        <span key={s} className="text-3xl count-pop" style={{ animationDelay: `${0.1 + s * 0.1}s`, filter: s <= value ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
      ))}
    </div>
  )
}

export default function Daily() {
  const { t, lang } = useLang()
  const { player, addXP, addCoins, incrementAI, trackDaily } = usePlayer()
  const nav = useNavigate()

  const ageGroup = player.ageGroup || '9-11'
  const q = useRef(dailyQuestion(ageGroup)).current
  const qText = q ? (lang === 'pt' ? q.pt : q.es) : ''
  const childName = player.name || (lang === 'pt' ? 'amigo' : 'amigo')

  const status = dailyStatus()
  const [phase, setPhase] = useState(status.done ? 'done' : 'answer') // answer | scoring | done
  const [answer, setAnswer] = useState('')
  const [stars, setStars] = useState(status.stars || 0)
  const [react, setReact] = useState('')
  const [toast, setToast] = useState('')

  const { listening, supported: micSupported, start: startListen, stop: stopListen } = useSpeech(lang === 'pt' ? 'pt-BR' : 'es-US')

  // Estás jugando el reto → la música del menú se calla (quedan los efectos de sonido).
  useEffect(() => { enterGameplay(); return () => exitGameplay() }, [])

  // Lee la pregunta en voz alta a los más chicos al entrar.
  useEffect(() => {
    if (phase === 'answer' && player.ageGroup === '6-8' && qText) {
      const tm = setTimeout(() => speak(qText, lang), 450)
      return () => { clearTimeout(tm); stopSpeak() }
    }
    return () => stopSpeak()
  }, [phase, qText, lang, player.ageGroup])

  const toggleVoice = () => {
    if (listening) { sfxPop(); stopListen(); return }
    sfxPop()
    const base = answer.trim() ? answer.trim() + ' ' : ''
    startListen((text) => setAnswer(base + text))
  }

  const respond = async () => {
    if (!answer.trim()) return
    sfxSend(); if (listening) stopListen(); stopSpeak()
    setPhase('scoring'); incrementAI()
    const res = await callClaude(roundReactSystemPrompt(childName, lang), `Pregunta: ${qText}\nRespuesta: ${answer}`, 120)
    const parsed = res ? parseReact(res) : { stars: 2, text: fallbackReact(childName, lang) }
    const st = parsed.stars || 2
    setStars(st); setReact(parsed.text || fallbackReact(childName, lang))
    // Recompensa del reto: bonus fijo + por estrellas.
    addXP(15 + st * 5); addCoins(st * 2); trackDaily({ answers: 1, stars: st })
    markDailyDone(st)
    setPhase('done')
    if (st >= 2) sfxCorrect(); else sfxSparkle()
    setTimeout(() => sfxCoins(), 400)
  }

  const shareText = () => {
    const stxt = '⭐'.repeat(Math.max(1, stars))
    return lang === 'pt'
      ? `Resolvi o Desafio do Dia (${prettyDate()}) com ${stxt} no Mente Livre 🧠 Jogue você:`
      : `Resolví el Reto del Día (${prettyDate()}) con ${stxt} en Mente Libre 🧠 Juega tú:`
  }

  const share = async () => {
    sfxPop()
    const text = shareText()
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mente Libre', text, url: SITE })
        return
      }
    } catch { /* el usuario canceló: seguimos al fallback */ }
    try {
      await navigator.clipboard.writeText(`${text} ${SITE}`)
      setToast(t('retoShareCopied')); setTimeout(() => setToast(''), 2500)
    } catch { /* noop */ }
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 min-h-dvh safe-top">
      <button onClick={() => { sfxPop(); stopSpeak(); nav('/') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-sm min-h-touch mb-3">←</button>

      <div className="text-center fade-in">
        <div className="chip mx-auto mb-2 text-xs" style={{ background: 'rgba(251,191,36,0.16)', borderColor: 'rgba(251,191,36,0.5)', color: 'var(--gold)' }}>{t('retoBadge')}</div>
        <div className="floaty inline-block"><Zoe size={72} talking speakable /></div>
        <h1 className="font-logo text-3xl grad-text mt-2">{t('retoTitle')}</h1>
        <p className="text-sm text-[var(--text-dim)] mt-1">{t('retoSub')}</p>
        <div className="text-[11px] text-[var(--text-dim)] mt-1">{prettyDate()}</div>
      </div>

      {/* Pregunta del día */}
      <div className="card p-4 mt-4 fade-in-d1" style={{ boxShadow: `inset 0 0 0 1px ${q?.color || '#7C3AED'}44` }}>
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-extrabold uppercase tracking-wide" style={{ color: q?.color }}>{q?.emoji} {t('retoToday')}</div>
          {speakSupported() && (
            <button onClick={() => { sfxPop(); speak(qText, lang) }} aria-label={t('listenQuestion')} className="shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold active:scale-90 transition min-h-touch" style={{ background: `${q?.color}22`, color: q?.color, border: `1px solid ${q?.color}55` }}>🔊 {t('listenQuestion')}</button>
          )}
        </div>
        <p className="mt-2 text-lg font-extrabold leading-snug">{qText}</p>
      </div>

      {/* RESPONDER */}
      {phase === 'answer' && (
        <div className="card p-4 mt-3 fade-in-d2">
          {micSupported && (
            <button onClick={toggleVoice} aria-label={listening ? t('listening') : t('tapToSpeak')} className={'w-full rounded-2xl py-3.5 px-4 flex items-center justify-center gap-3 font-extrabold text-white transition active:scale-[0.98] min-h-touch ' + (listening ? 'mic-pulse' : '')} style={{ background: listening ? 'linear-gradient(135deg,#FB7185,#E11D48)' : 'linear-gradient(135deg,#A855F7,#7C3AED)' }}>
              <span className="text-base">{listening ? t('listening') : t('tapToSpeak')}</span>
            </button>
          )}
          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={micSupported ? 2 : 4} aria-label={t('writeYourAnswer')} placeholder={micSupported ? t('orTypeHint') : t('writeYourAnswer')} className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 mt-3 outline-none focus:border-[var(--violet-light)] resize-none text-base" />
          <button onClick={respond} disabled={!answer.trim()} className="btn btn-gold w-full mt-3 disabled:opacity-40 min-h-touch" aria-label={t('respondBtn')}>{t('respondBtn')}</button>
        </div>
      )}

      {phase === 'scoring' && (
        <div className="card p-6 mt-3 text-center"><div className="text-[var(--text-dim)] text-sm caret">{t('aiThinking')}</div></div>
      )}

      {/* RESULTADO + COMPARTIR */}
      {phase === 'done' && (
        <div className="card p-5 mt-3 text-center fade-in" role="status" aria-live="polite" style={{ background: 'linear-gradient(180deg, rgba(251,191,36,0.14), rgba(255,255,255,0.03))' }}>
          <div className="font-logo text-xl grad-text">{t('retoDoneTitle')}</div>
          <div className="mt-2"><Stars value={stars} /></div>
          {react && <p className="mt-2 text-[15px] font-bold leading-snug">{react}</p>}
          <button onClick={share} className="btn btn-gold w-full mt-4 min-h-touch" aria-label={t('retoShare')}>{t('retoShare')}</button>
          <div className="text-xs text-[var(--text-dim)] mt-3">{t('retoCome')}</div>
        </div>
      )}

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-[90] px-4 py-2 rounded-full text-sm font-bold xp-toast" style={{ background: 'rgba(16,185,129,0.95)', color: '#04140d' }}>{toast}</div>
      )}
    </div>
  )
}
