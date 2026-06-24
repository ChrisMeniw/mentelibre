import { useLang } from '../i18n'

export default function WorldCard({ world, completed = 0, onClick }) {
  const { lang, t } = useLang()
  const name = lang === 'pt' ? world.name_pt : world.name_es
  return (
    <button
      type="button"
      onClick={onClick}
      className="card p-4 text-left active:scale-95 transition relative overflow-hidden fade-in"
      style={{ boxShadow: `inset 0 0 0 1px ${world.color}33` }}
    >
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-40"
        style={{ background: world.color }}
      />
      <div className="text-4xl mb-2">{world.emoji}</div>
      <div className="font-extrabold leading-tight text-[15px]">{name}</div>
      <div className="mt-2 chip" style={{ color: world.color }}>
        {completed} {t('completed')}
      </div>
    </button>
  )
}
