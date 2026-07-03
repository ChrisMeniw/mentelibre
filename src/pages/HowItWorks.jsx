import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../i18n'
import { usePlayer } from '../hooks/usePlayer'
import { sfxPop } from '../lib/sfx'
import ModeIcon from '../components/ModeIcon'
import LogoHero from '../components/LogoHero'
import { POWERS } from '../data/powers'
import { GUARDIANS } from '../data/guardians'

// 📖 MANUAL COMPLETO del juego: qué es, cómo se juega cada modo, cómo se ganan las
// estrellas (rúbrica con ejemplos), niveles, monedas, poderes, cofres, guardianes,
// competencia por equipos, guía docente y preguntas frecuentes. Secciones desplegables.
const MODES = [
  { icon: 'solo', accent: '#FBBF24', t: 'modeSoloTitle', d: 'modeSoloDesc' },
  { icon: 'group', accent: '#A855F7', t: 'modeGroupTitle', d: 'modeGroupDesc' },
  { icon: 'ask', accent: '#C084FC', t: 'modeAskTitle', d: 'modeAskDesc' },
  { icon: 'daily', accent: '#FB7185', t: 'modeDailyTitle', d: 'modeDailyDesc' },
]

const M = {
  es: {
    manualTitle: '📖 Manual del juego',
    manualSub: 'Todo lo que hay que saber, explicado fácil.',
    stars: {
      title: '⭐ Cómo se ganan las estrellas',
      intro: 'ZOE lee tu respuesta y la puntúa de 1 a 5 estrellas. No importa "acertar": importa CÓMO piensas. Esta es la regla, con ejemplos reales:',
      rows: [
        ['⭐', 'Muy poquito, sin explicar', '"no sé" · "el agua"'],
        ['⭐⭐', 'Una idea corta, sin el porqué', '"Cerraría la canilla"'],
        ['⭐⭐⭐', 'Una idea con cuerpo o un porqué breve', '"Cerraría la canilla porque se gasta agua"'],
        ['⭐⭐⭐⭐', 'Explicaste bien tus razones', '"La cerraría porque el agua se desperdicia y otros la necesitan"'],
        ['⭐⭐⭐⭐⭐', 'Pensaste, explicaste Y desarrollaste', '"La cerraría porque se desperdicia, y además le enseñaría a mi familia a cuidarla"'],
      ],
      tip: '💡 El secreto: usa "porque…", "además…", "por ejemplo…". ¡El listón se adapta a tu edad!',
    },
    levels: {
      title: '🏆 Niveles y XP',
      intro: 'Cada estrella da XP (⭐=5 · ⭐⭐=10 · ⭐⭐⭐=18 · ⭐⭐⭐⭐=30 · ⭐⭐⭐⭐⭐=45). Con XP subes de nivel y tu personaje EVOLUCIONA:',
      rows: [['🐣 Aprendiz', '0'], ['🔍 Curioso', '200'], ['💭 Pensador', '500'], ['🧠 Crítico', '900'], ['🦉 Filósofo', '1400']],
    },
    coins: {
      title: '🪙 Monedas, tienda y poderes',
      intro: 'Las monedas se ganan jugando y abriendo cofres. En la Tienda puedes comprar:',
      powersLabel: '⚡ PODERES (se usan en plena ronda — ¡estrategia!):',
      after: 'Y también avatares premium, mascotas que te acompañan en el mapa y marcos para tu perfil.',
    },
    chests: {
      title: '🎁 Cofres sorpresa',
      body: 'Al terminar cada ronda se abre un cofre. Mientras mejor pensaste, mejor el cofre: 🥉 Bronce → 🥈 Plata → 🥇 ORO. Traen monedas y a veces un poder. Los de ORO SIEMPRE traen un poder.',
    },
    guardians: {
      title: '⚔️ Los Guardianes (los jefes)',
      intro: 'Cada planeta tiene un guardián: un enemigo del buen pensar. Completa los 5 niveles del planeta y podrás desafiarlo: 3 preguntas, 20 segundos, y cada ⭐ tuya le quita vida. Hazle 9 de daño y el planeta queda CORONADO 👑 (botín: XP + monedas + un poder).',
    },
    streak: {
      title: '🔥 Rachas y misiones diarias',
      body: 'Jugar días seguidos enciende tu racha 🔥. Cada día hay 3 misiones (responder preguntas, ganar estrellas, completar rondas) con premio en monedas. Y el Reto del Día es una pregunta única para toda LATAM: ¡compártela con tus amigos!',
    },
    ask: {
      title: '🦉 El arte de preguntar',
      body: 'El desafío maestro: se desbloquea al responder 20 preguntas. Aquí NO respondes: ZOE te da un TEMA y tú inventas las MEJORES preguntas. Las abiertas y con "¿qué pasaría si…?" ganan más estrellas. Saber preguntar es la forma más alta de pensar.',
    },
    teams: {
      title: '🏟️ Competencia por equipos (reglas)',
      rules: [
        'Formato 2v2 o 5v5, en un mismo aparato (se lo van pasando).',
        'Partida de 10 minutos (el reloj ⏳ está arriba; tócalo para finalizar antes).',
        'Por turnos: el equipo elige quién responde cada pregunta (estrategia).',
        '30 segundos por pregunta, y cada turno da MENOS tiempo.',
        'ZOE puntúa 1-5 ⭐ y las estrellas suman al equipo.',
        'Cada equipo tiene UN comodín ×2: duplica las estrellas de un turno.',
        'Cierre: ZOE da un TEMA y cada equipo inventa su MEJOR pregunta (también puntúa).',
        '🏆 Gana el equipo con más estrellas.',
      ],
    },
    teachers: {
      title: '👩‍🏫 Para docentes',
      body: '10 minutos al día alcanzan: proyecta el juego, elige el rango de edad y deja que la clase debata antes de responder. El modo "Desafío de colegio" dura 45 minutos, suma al ranking de escuelas y funciona en cualquier aparato sin instalar nada. En el Portal Docente hay guías listas para el aula.',
      btn: 'Ir al Portal Docente',
    },
    faq: {
      title: '❓ Preguntas frecuentes',
      qa: [
        ['¿Es gratis?', 'Sí, 100% gratis, para siempre. Es una iniciativa sin fines de lucro de Chris Meniw Foundation.'],
        ['¿Hay respuestas incorrectas?', 'No. Se premia CÓMO piensas: tus razones, tu imaginación y tus ejemplos.'],
        ['¿Pide datos de los chicos?', 'Solo un nombre o apodo para que ZOE lo salude. Todo el progreso queda guardado en el propio aparato.'],
        ['¿Sirve para la casa y la escuela?', 'Sí: hay modo individual, competencia por equipos y desafío de colegio con ranking.'],
        ['¿Puedo hablar en vez de escribir?', 'Sí, toca el micrófono 🎤 y di tu respuesta. También ZOE lee las preguntas en voz alta 🔊.'],
        ['¿Para qué edades es?', 'De 6 a 15 años: las preguntas, el tiempo y la exigencia se adaptan a cada edad (6-8, 9-11, 12-15).'],
      ],
    },
  },
  pt: {
    manualTitle: '📖 Manual do jogo',
    manualSub: 'Tudo o que você precisa saber, explicado fácil.',
    stars: {
      title: '⭐ Como ganhar as estrelas',
      intro: 'A ZOE lê sua resposta e dá de 1 a 5 estrelas. Não importa "acertar": importa COMO você pensa. Esta é a regra, com exemplos:',
      rows: [
        ['⭐', 'Muito pouco, sem explicar', '"não sei" · "a água"'],
        ['⭐⭐', 'Uma ideia curta, sem o porquê', '"Fecharia a torneira"'],
        ['⭐⭐⭐', 'Uma ideia com corpo ou um porquê breve', '"Fecharia a torneira porque gasta água"'],
        ['⭐⭐⭐⭐', 'Você explicou bem seus motivos', '"Fecharia porque a água se desperdiça e outros precisam dela"'],
        ['⭐⭐⭐⭐⭐', 'Pensou, explicou E desenvolveu', '"Fecharia porque se desperdiça, e além disso ensinaria minha família a cuidar dela"'],
      ],
      tip: '💡 O segredo: use "porque…", "além disso…", "por exemplo…". O nível se adapta à sua idade!',
    },
    levels: {
      title: '🏆 Níveis e XP',
      intro: 'Cada estrela dá XP (⭐=5 · ⭐⭐=10 · ⭐⭐⭐=18 · ⭐⭐⭐⭐=30 · ⭐⭐⭐⭐⭐=45). Com XP você sobe de nível e seu personagem EVOLUI:',
      rows: [['🐣 Aprendiz', '0'], ['🔍 Curioso', '200'], ['💭 Pensador', '500'], ['🧠 Crítico', '900'], ['🦉 Filósofo', '1400']],
    },
    coins: {
      title: '🪙 Moedas, loja e poderes',
      intro: 'As moedas se ganham jogando e abrindo baús. Na Loja você pode comprar:',
      powersLabel: '⚡ PODERES (usados durante a rodada — estratégia!):',
      after: 'E também avatares premium, mascotes que te acompanham no mapa e molduras para o seu perfil.',
    },
    chests: {
      title: '🎁 Baús surpresa',
      body: 'Ao terminar cada rodada abre-se um baú. Quanto melhor você pensou, melhor o baú: 🥉 Bronze → 🥈 Prata → 🥇 OURO. Trazem moedas e às vezes um poder. Os de OURO SEMPRE trazem um poder.',
    },
    guardians: {
      title: '⚔️ Os Guardiões (os chefes)',
      intro: 'Cada planeta tem um guardião: um inimigo do bom pensar. Complete os 5 níveis do planeta e você poderá desafiá-lo: 3 perguntas, 20 segundos, e cada ⭐ sua tira vida dele. Cause 9 de dano e o planeta fica COROADO 👑 (recompensa: XP + moedas + um poder).',
    },
    streak: {
      title: '🔥 Sequências e missões diárias',
      body: 'Jogar dias seguidos acende sua sequência 🔥. Cada dia tem 3 missões (responder perguntas, ganhar estrelas, completar rodadas) com prêmio em moedas. E o Desafio do Dia é uma pergunta única para toda a América Latina: compartilhe com seus amigos!',
    },
    ask: {
      title: '🦉 A arte de perguntar',
      body: 'O desafio mestre: desbloqueia ao responder 20 perguntas. Aqui você NÃO responde: a ZOE dá um TEMA e você inventa as MELHORES perguntas. As abertas e com "o que aconteceria se…?" ganham mais estrelas. Saber perguntar é a forma mais alta de pensar.',
    },
    teams: {
      title: '🏟️ Competição por equipes (regras)',
      rules: [
        'Formato 2v2 ou 5v5, no mesmo aparelho (vão passando).',
        'Partida de 10 minutos (o relógio ⏳ fica em cima; toque nele para finalizar antes).',
        'Por turnos: a equipe escolhe quem responde cada pergunta (estratégia).',
        '30 segundos por pergunta, e cada turno dá MENOS tempo.',
        'A ZOE pontua 1-5 ⭐ e as estrelas somam para a equipe.',
        'Cada equipe tem UM coringa ×2: dobra as estrelas de um turno.',
        'Final: a ZOE dá um TEMA e cada equipe inventa sua MELHOR pergunta (também pontua).',
        '🏆 Vence a equipe com mais estrelas.',
      ],
    },
    teachers: {
      title: '👩‍🏫 Para professores',
      body: '10 minutos por dia bastam: projete o jogo, escolha a faixa de idade e deixe a turma debater antes de responder. O modo "Desafio da escola" dura 45 minutos, soma no ranking de escolas e funciona em qualquer aparelho sem instalar nada. No Portal do Professor há guias prontos para a aula.',
      btn: 'Ir ao Portal do Professor',
    },
    faq: {
      title: '❓ Perguntas frequentes',
      qa: [
        ['É grátis?', 'Sim, 100% grátis, para sempre. É uma iniciativa sem fins lucrativos da Chris Meniw Foundation.'],
        ['Existem respostas erradas?', 'Não. Premia-se COMO você pensa: seus motivos, sua imaginação e seus exemplos.'],
        ['Pede dados das crianças?', 'Só um nome ou apelido para a ZOE cumprimentar. Todo o progresso fica salvo no próprio aparelho.'],
        ['Serve para casa e escola?', 'Sim: há modo individual, competição por equipes e desafio da escola com ranking.'],
        ['Posso falar em vez de escrever?', 'Sim, toque no microfone 🎤 e fale sua resposta. A ZOE também lê as perguntas em voz alta 🔊.'],
        ['Para quais idades?', 'De 6 a 15 anos: as perguntas, o tempo e a exigência se adaptam a cada idade (6-8, 9-11, 12-15).'],
      ],
    },
  },
}

// Sección desplegable del manual (nativa <details> = accesible, sin JS extra).
function Section({ title, children, accent = '#A855F7', open = false }) {
  return (
    <details className="card overflow-hidden group" open={open}
      style={{ boxShadow: `inset 0 0 0 1px ${accent}33` }}>
      <summary className="cursor-pointer select-none list-none p-4 flex items-center justify-between gap-2 font-extrabold text-[15px] min-h-touch">
        <span>{title}</span>
        <span className="text-[var(--text-dim)] transition-transform group-open:rotate-180" aria-hidden>⌄</span>
      </summary>
      <div className="px-4 pb-4 -mt-1 text-sm leading-relaxed">{children}</div>
    </details>
  )
}

export default function HowItWorks() {
  const { t, lang } = useLang()
  const { hasProfile } = usePlayer()
  const nav = useNavigate()
  const L = M[lang] || M.es

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])

  return (
    <div className="mx-auto max-w-md px-4 pt-14 pb-32 safe-top">
      <button onClick={() => { sfxPop(); nav('/') }} aria-label={t('back')} className="btn btn-ghost px-3 py-2 text-sm min-h-touch mb-3">←</button>

      {/* Hero */}
      <LogoHero showTagline={false} />
      <div className="text-center">
        <h1 className="font-logo text-2xl mt-1 grad-text leading-tight">{t('hiwTitle')}</h1>
        <p className="text-sm text-[var(--text-dim)] mt-2 leading-relaxed">{t('hiwSub')}</p>
      </div>

      {/* De qué se trata + objetivo */}
      <div className="card p-4 mt-6 fade-in-d1" style={{ boxShadow: 'inset 0 0 0 1px rgba(124,58,237,0.33)' }}>
        <h2 className="font-extrabold text-[15px] text-[var(--violet-light)] mb-1.5">💜 {t('hiwWhatTitle')}</h2>
        <p className="text-sm leading-relaxed">{t('hiwWhatText')}</p>
        <p className="text-sm leading-relaxed mt-2"><span className="font-extrabold text-[var(--gold)]">🎯 {t('goalLabel')}:</span> {t('goalText')}</p>
      </div>

      {/* Quién es ZOE */}
      <div className="card p-4 mt-4 flex items-start gap-3 fade-in-d1" style={{ boxShadow: 'inset 0 0 0 1px rgba(168,85,247,0.33)' }}>
        <img src="/zoe-portal-v10.webp" alt="ZOE" width="52" height="52"
          className="shrink-0 rounded-full object-cover" style={{ width: 52, height: 52, boxShadow: '0 0 0 2px rgba(168,85,247,0.7)' }} />
        <div>
          <h2 className="font-extrabold text-[15px] text-[var(--violet-light)] mb-1">🦉 {t('hiwZoeTitle')}</h2>
          <p className="text-sm leading-relaxed">{t('hiwZoeText')}</p>
        </div>
      </div>

      {/* Los modos, de un vistazo */}
      <div className="mt-6 fade-in-d2">
        <h2 className="font-logo text-xl grad-text text-center mb-3">🎮 {t('hiwPlayTitle')}</h2>
        <div className="space-y-2.5">
          {MODES.map((m) => (
            <div key={m.icon} className="card p-3.5 flex items-center gap-3.5">
              <span className="shrink-0 w-12 h-12 rounded-2xl grid place-items-center"
                style={{ background: `linear-gradient(140deg, ${m.accent}2e, ${m.accent}10)`, border: `1px solid ${m.accent}40` }}>
                <ModeIcon name={m.icon} accent={m.accent} size={26} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-extrabold text-[15px] leading-tight">{t(m.t)}</span>
                <span className="block text-[12px] text-[var(--text-dim)] leading-snug mt-0.5">{t(m.d)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 📖 MANUAL COMPLETO */}
      <div className="text-center mt-8 mb-3">
        <h2 className="font-logo text-2xl grad-text">{L.manualTitle}</h2>
        <p className="text-xs text-[var(--text-dim)] mt-1">{L.manualSub}</p>
      </div>

      <div className="space-y-2.5 fade-in-d2">
        {/* ⭐ Rúbrica de estrellas con ejemplos */}
        <Section title={L.stars.title} accent="#FBBF24" open>
          <p>{L.stars.intro}</p>
          <div className="mt-3 space-y-2">
            {L.stars.rows.map(([s, d, e], i) => (
              <div key={i} className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.09)' }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-[13px] shrink-0">{s}</span>
                  <span className="text-[12.5px] font-bold flex-1 text-right">{d}</span>
                </div>
                <div className="text-[11.5px] text-[var(--text-dim)] italic mt-0.5">{e}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] font-bold text-[var(--gold)]">{L.stars.tip}</p>
        </Section>

        {/* 🏆 Niveles */}
        <Section title={L.levels.title} accent="#A855F7">
          <p>{L.levels.intro}</p>
          <div className="mt-3 grid grid-cols-1 gap-1.5">
            {L.levels.rows.map(([n, xp], i) => (
              <div key={i} className="flex items-center justify-between rounded-xl px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.045)' }}>
                <span className="font-extrabold text-[13px]">{n}</span>
                <span className="text-[12px] font-black text-[var(--violet-light)]">{xp} XP</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 🪙 Monedas y poderes */}
        <Section title={L.coins.title} accent="#FBBF24">
          <p>{L.coins.intro}</p>
          <p className="mt-2 font-bold text-[13px]">{L.coins.powersLabel}</p>
          <div className="mt-1.5 space-y-1.5">
            {POWERS.map((pw) => (
              <div key={pw.id} className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12.5px]" style={{ background: 'rgba(255,255,255,0.045)' }}>
                <span className="text-lg shrink-0">{pw.emoji}</span>
                <span className="font-extrabold shrink-0">{lang === 'pt' ? pw.name_pt : pw.name_es}:</span>
                <span className="text-[var(--text-dim)]">{lang === 'pt' ? pw.desc_pt : pw.desc_es}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[12.5px]">{L.coins.after}</p>
        </Section>

        {/* 🎁 Cofres */}
        <Section title={L.chests.title} accent="#CD7F32">
          <p>{L.chests.body}</p>
        </Section>

        {/* ⚔️ Guardianes */}
        <Section title={L.guardians.title} accent="#F43F5E">
          <p>{L.guardians.intro}</p>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {Object.entries(GUARDIANS).map(([id, g]) => (
              <div key={id} className="rounded-xl px-2.5 py-2 text-center" style={{ background: 'rgba(255,255,255,0.045)', border: `1px solid ${g.color}33` }}>
                <div className="text-2xl">{g.emoji}</div>
                <div className="text-[11px] font-extrabold leading-tight mt-0.5">{lang === 'pt' ? g.name_pt : g.name_es}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* 🦉 El arte de preguntar */}
        <Section title={L.ask.title} accent="#C084FC">
          <p>{L.ask.body}</p>
        </Section>

        {/* 🔥 Rachas */}
        <Section title={L.streak.title} accent="#FB7185">
          <p>{L.streak.body}</p>
        </Section>

        {/* 🏟️ Competencia */}
        <Section title={L.teams.title} accent="#38BDF8">
          <ol className="space-y-1.5">
            {L.teams.rules.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] leading-snug">
                <span className="shrink-0 grid place-items-center w-5 h-5 rounded-full font-black text-[10px]" style={{ background: 'rgba(56,189,248,0.25)', color: '#7DD3FC' }}>{i + 1}</span>
                <span>{r}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* 👩‍🏫 Docentes */}
        <Section title={L.teachers.title} accent="#10B981">
          <p>{L.teachers.body}</p>
          <button onClick={() => { sfxPop(); nav('/docentes') }} className="btn btn-ghost w-full mt-3 text-sm min-h-touch" style={{ boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.4)' }}>
            🎓 {L.teachers.btn}
          </button>
        </Section>

        {/* ❓ FAQ */}
        <Section title={L.faq.title} accent="#C084FC">
          <div className="space-y-3">
            {L.faq.qa.map(([q, a], i) => (
              <div key={i}>
                <div className="font-extrabold text-[13.5px]">{q}</div>
                <div className="text-[12.5px] text-[var(--text-dim)] leading-snug mt-0.5">{a}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Qué entrena */}
      <div className="card p-4 mt-4 fade-in-d3">
        <h2 className="font-extrabold text-[15px] text-[var(--sky)] mb-2.5">🚀 {t('hiwSkillsTitle')}</h2>
        <div className="grid grid-cols-2 gap-2">
          {[{ e: '🧠', k: 'hiwSkill1' }, { e: '💡', k: 'hiwSkill2' }, { e: '❓', k: 'hiwSkill3' }, { e: '🗣️', k: 'hiwSkill4' }].map((s) => (
            <div key={s.k} className="rounded-2xl px-3 py-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-xl shrink-0" aria-hidden>{s.e}</span>
              <span className="text-[12.5px] font-bold leading-tight">{t(s.k)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="card p-5 mt-6 text-center fade-in-d3" style={{ background: 'linear-gradient(180deg, rgba(251,191,36,0.14), rgba(124,58,237,0.08))', boxShadow: 'inset 0 0 0 1px rgba(251,191,36,0.4)' }}>
        <h2 className="font-logo text-xl grad-text leading-tight">{t('hiwStartTitle')}</h2>
        <button onClick={() => { sfxPop(); nav(hasProfile ? '/hub' : '/empezar') }} className="btn btn-gold w-full mt-3 text-lg min-h-touch"
          aria-label={hasProfile ? t('continueCta') : t('playCta')}>
          {hasProfile ? t('continueCta') : t('playCta')}
        </button>
        <div className="flex gap-2 mt-2">
          <button onClick={() => { sfxPop(); nav('/mision') }} className="btn btn-ghost flex-1 text-sm min-h-touch" aria-label={t('ourMission')}>{t('ourMission')}</button>
          <button onClick={() => { sfxPop(); nav('/docentes') }} className="btn btn-ghost flex-1 text-sm min-h-touch" aria-label={t('forTeachers')}>{t('forTeachers')}</button>
        </div>
      </div>

      <footer className="text-center pt-5 leading-relaxed">
        <div className="text-xs text-[var(--text-dim)]">
          Chris Meniw Foundation ·{' '}
          <a className="text-[var(--violet-light)]" href="https://www.chrismeniwfoundation.org" target="_blank" rel="noopener noreferrer">www.chrismeniwfoundation.org</a>
        </div>
      </footer>
    </div>
  )
}
