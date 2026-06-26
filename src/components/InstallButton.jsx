import { useEffect, useState } from 'react'
import { useLang } from '../i18n'
import { sfxPop } from '../lib/sfx'

// Botón "Instalar app" — aparece cuando el navegador permite instalar (Android / Chrome de escritorio).
// En iPhone no existe este evento: ahí se instala con Compartir → "Agregar a inicio".
export default function InstallButton() {
  const { t } = useLang()
  const [deferred, setDeferred] = useState(null)

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); setDeferred(e) }
    const onInstalled = () => setDeferred(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!deferred) return null

  const install = async () => {
    sfxPop()
    deferred.prompt()
    try { await deferred.userChoice } catch { /* noop */ }
    setDeferred(null)
  }

  return (
    <button
      onClick={install}
      aria-label={t('installApp')}
      className="card w-full p-3 flex items-center justify-center gap-2 text-sm font-extrabold glow-violet active:scale-95 transition min-h-touch"
    >
      <span className="text-lg">📲</span> {t('installApp')}
    </button>
  )
}
