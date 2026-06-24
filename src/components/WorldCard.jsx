import { useLang } from '../i18n'

export default function WorldCard({ world, completed = 0, onClick }) {
  const { lang, t } = useLang()
  const name = lang === 'pt' ? world.name_pt : world.name_es
  return (
    <button
      type="button"
      onClick={onClick}
      className="card lift p-4 text-left relative overflow-hidden fade-in group"
    >
      <div
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity"
        style={{ background: world.color }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${world.color}, transparent)`, opacity: 0.5 }}
      />
      <div
        className="w-12 h-12 rounded-2xl grid place-items-center text-3xl mb-2.5 relative"
        style={{
          background: `linear-gradient(135deg, ${world.color}38, ${world.color}10)`,
          boxShadow: `0 10px 22px -10px ${world.color}, inset 0 0 0 1px ${world.color}44`,
        }}
      >
        {world.emoji}
      </div>
      <div className="font-extrabold leading-tight text-[15px]">{name}</div>
      <div className="mt-2 chip" style={{ color: world.color, borderColor: `${world.color}55` }}>
        ● {completed} {t('completed')}
      </div>
    </button>
  )
}
