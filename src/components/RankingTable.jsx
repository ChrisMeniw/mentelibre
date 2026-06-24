import { useLang } from '../i18n'

const SCHOOLS = [
  'Esc. San Martín (AR)', 'Colégio Dom Bosco (BR)', 'Liceo Bolívar (VE)', 'Esc. Benito Juárez (MX)',
  'Colégio Tiradentes (BR)', 'Inst. Gabriela Mistral (CL)', 'Esc. Simón Rodríguez (CO)', 'Col. Eloy Alfaro (EC)',
  'Esc. Artigas (UY)', 'Col. Mariscal Sucre (PE)',
]

export default function RankingTable({ yourSchool, yourXP = 0 }) {
  const { t } = useLang()
  const base = SCHOOLS.map((n, i) => ({ name: n, xp: 4200 - i * 290 + ((i * 137) % 80), you: false }))
  const mine = { name: yourSchool || t('you'), xp: yourXP, you: true }
  const rows = [...base, mine].sort((a, b) => b.xp - a.xp).slice(0, 11)
  return (
    <div className="card overflow-hidden">
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 border-b border-white/5 last:border-0"
          style={{ background: r.you ? 'rgba(251,191,36,0.12)' : 'transparent' }}
        >
          <span className={'w-7 text-center font-extrabold ' + (r.you ? 'text-[var(--gold)]' : 'text-[var(--text-dim)]')}>
            {i + 1}
          </span>
          <span className={'flex-1 truncate font-bold ' + (r.you ? 'text-[var(--gold)]' : '')}>
            {r.name}{r.you ? ' ⭐' : ''}
          </span>
          <span className="font-extrabold tabular-nums">{r.xp.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}
