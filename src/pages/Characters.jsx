import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CHAR_NAMES, LEVEL_NAMES, getCharacterComp } from '../components/characters/CharacterSystem'
import { sfxPop } from '../lib/sfx'

// Vitrina para revisar los personajes (Grupo C — shonen, bucket 12-15).
const MOODS = ['idle', 'happy', 'thinking', 'excited', 'sad']

export default function Characters() {
  const nav = useNavigate()
  const [mood, setMood] = useState('idle')
  const names = CHAR_NAMES['12-15']
  const titles = LEVEL_NAMES['12-15']

  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 safe-top">
      <button onClick={() => { sfxPop(); nav('/') }} aria-label="Volver" className="btn btn-ghost px-3 py-2 text-sm min-h-touch mb-3">←</button>
      <h1 className="font-logo text-2xl grad-text text-center">Personajes · 13-15 (shonen)</h1>
      <p className="text-xs text-[var(--text-dim)] text-center mt-1">SVG inline · cambian de personaje al subir de nivel</p>

      {/* selector de mood */}
      <div className="card flex p-1 gap-1 mt-4">
        {MOODS.map((m) => (
          <button key={m} onClick={() => { sfxPop(); setMood(m) }} className="flex-1 btn text-[11px] py-2 min-h-touch capitalize"
            style={mood === m ? { background: 'linear-gradient(135deg,var(--violet-light),var(--violet))', color: '#fff' } : { background: 'transparent', color: 'var(--text-dim)' }}>{m}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {names.map((name, i) => {
          const Comp = getCharacterComp('12-15', i)
          return (
            <div key={name} className="card p-3 flex flex-col items-center text-center">
              <Comp mood={mood} size={104} />
              <div className="font-extrabold mt-2">{name}</div>
              <div className="text-[11px] text-[var(--text-dim)]">Nivel {i + 1} · {titles[i]}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
