import { useEffect, useState } from 'react'

// Efecto typewriter para la respuesta de la IA.
export default function AIResponse({ text = '' }) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    setShown('')
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      i += 2
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [text])

  const typing = shown.length < text.length
  return (
    <div className="flex gap-3 items-start">
      <div
        className="w-9 h-9 shrink-0 rounded-full grid place-items-center text-lg"
        style={{ background: 'linear-gradient(135deg,var(--violet-light),var(--violet))' }}
      >
        🤖
      </div>
      <p className={'leading-relaxed whitespace-pre-wrap text-[15px] ' + (typing ? 'caret' : '')}>{shown}</p>
    </div>
  )
}
