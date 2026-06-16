'use client'

import { useEffect, useState } from 'react'

/**
 * A looping, self-explanatory "install demo" for the hero. It mimics a Claude
 * conversation: the user asks for skills, results slide in, the user says
 * "install it", and an amber checkmark confirms. Pure state + CSS, no animation
 * library. Respects prefers-reduced-motion by rendering the finished state.
 */

const QUERY = 'show me writing skills'
const INSTALL = 'install it'

const DEMO_SKILLS = [
  { name: 'LinkedIn Post Writer', color: 'var(--cat-writing)' },
  { name: 'Cold Email Craft', color: 'var(--cat-writing)' },
  { name: 'Tweet Thread Builder', color: 'var(--cat-writing)' },
]

type Caret = 'query' | 'install' | null

interface DemoState {
  query: string
  install: string
  thinking: boolean
  cards: number
  confirmed: boolean
  caret: Caret
}

const EMPTY: DemoState = {
  query: '',
  install: '',
  thinking: false,
  cards: 0,
  confirmed: false,
  caret: 'query',
}

const FULL: DemoState = {
  query: QUERY,
  install: INSTALL,
  thinking: false,
  cards: DEMO_SKILLS.length,
  confirmed: true,
  caret: null,
}

export function HeroDemo() {
  const [s, setS] = useState<DemoState>(EMPTY)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setS(FULL)
      return
    }

    const ctrl = { cancelled: false }
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(() => {
          timers.delete(t)
          resolve()
        }, ms)
        timers.add(t)
      })

    const type = async (key: 'query' | 'install', text: string, per = 55) => {
      for (let i = 1; i <= text.length; i++) {
        if (ctrl.cancelled) return
        setS((p) => ({ ...p, [key]: text.slice(0, i) }))
        await wait(per)
      }
    }

    const run = async () => {
      while (!ctrl.cancelled) {
        setS(EMPTY)
        await wait(650)
        await type('query', QUERY)
        if (ctrl.cancelled) return
        await wait(420)
        setS((p) => ({ ...p, thinking: true, caret: null }))
        await wait(950)
        if (ctrl.cancelled) return
        setS((p) => ({ ...p, thinking: false }))
        for (let c = 1; c <= DEMO_SKILLS.length; c++) {
          if (ctrl.cancelled) return
          setS((p) => ({ ...p, cards: c }))
          await wait(300)
        }
        await wait(750)
        setS((p) => ({ ...p, caret: 'install' }))
        await type('install', INSTALL)
        if (ctrl.cancelled) return
        await wait(480)
        setS((p) => ({ ...p, confirmed: true, caret: null }))
        await wait(2800)
      }
    }

    run()

    return () => {
      ctrl.cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="card relative flex min-h-[340px] flex-col gap-4 overflow-hidden p-5 sm:p-6"
    >
      {/* window chrome */}
      <div className="flex items-center justify-between border-b border-shelf-border pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-mono text-xs text-shelf-text-secondary">Claude</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-shelf-text-tertiary">
          SkillShelf · MCP
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {/* user query */}
        <div className="flex items-center gap-2 font-mono text-sm text-shelf-text-primary">
          <span className="text-accent">›</span>
          <span>{s.query}</span>
          {s.caret === 'query' && <span className="demo-caret" />}
        </div>

        {/* thinking */}
        {s.thinking && (
          <div className="flex items-center gap-1.5 pl-5">
            <span className="demo-dot" />
            <span className="demo-dot" style={{ animationDelay: '0.15s' }} />
            <span className="demo-dot" style={{ animationDelay: '0.3s' }} />
          </div>
        )}

        {/* results */}
        {s.cards > 0 && (
          <div className="flex flex-col gap-2 pl-5">
            {DEMO_SKILLS.slice(0, s.cards).map((skill, i) => (
              <div
                key={skill.name}
                className="demo-result flex items-center justify-between rounded-md border border-shelf-border bg-shelf-elevated px-3 py-2"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="flex items-center gap-2 text-sm text-shelf-text-primary">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: skill.color }}
                  />
                  {skill.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-shelf-text-tertiary">
                  skill
                </span>
              </div>
            ))}
          </div>
        )}

        {/* install command */}
        {(s.install.length > 0 || s.caret === 'install') && (
          <div className="flex items-center gap-2 font-mono text-sm text-shelf-text-primary">
            <span className="text-accent">›</span>
            <span>{s.install}</span>
            {s.caret === 'install' && <span className="demo-caret" />}
          </div>
        )}

        {/* confirmation */}
        {s.confirmed && (
          <div className="demo-confirm mt-auto flex items-center gap-2 rounded-md border border-accent-border bg-accent-dim px-3 py-2 text-sm text-accent-hover">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-shelf-void">
              ✓
            </span>
            Added to your library — activates next session.
          </div>
        )}
      </div>
    </div>
  )
}
