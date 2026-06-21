'use client'

import { useEffect, useState } from 'react'
import { CATEGORY_MAP } from '@/lib/categories'
import type { SkillCategory } from '@/lib/types'

/**
 * A looping, self-running demo for the hero that shows the recommender, not a
 * catalog browser: each cycle it types a real-world task into a prompt, then
 * slides in the skills Claude recommends for it (each with a one-line reason)
 * and applies the top one. The task→skill pairs are real catalog skills and
 * mirror what `recommend_skills` actually returns. Pure state + CSS — no
 * animation library. Respects prefers-reduced-motion with a static state.
 */

interface Rec {
  name: string
  cat: SkillCategory
  why: string
}

interface Task {
  task: string
  recs: Rec[]
}

// Real tasks → real catalog skills, matching the live recommender's output.
const TASKS: Task[] = [
  {
    task: 'make my demo video less janky',
    recs: [
      { name: 'Motion Design Principles', cat: 'design', why: 'easing & timing that kill the jank' },
      { name: 'Product Demo Director', cat: 'design', why: 'cursor & zoom choreography' },
      { name: 'Video Storyboard', cat: 'design', why: 'a tight beat sheet first' },
    ],
  },
  {
    task: 'raise a seed round',
    recs: [
      { name: 'Fundraising Stage Selector', cat: 'business', why: 'size the round & valuation' },
      { name: 'Pitch Deck Builder', cat: 'business', why: 'the narrative and the deck' },
      { name: 'Investor Targeting', cat: 'business', why: 'a ranked list of the right VCs' },
    ],
  },
  {
    task: 'ship CI/CD on Vercel',
    recs: [
      { name: 'Vercel Deploy Pipeline', cat: 'coding', why: 'preview → prod, with rollbacks' },
      { name: 'GitHub Actions', cat: 'coding', why: 'wire up the pipeline' },
    ],
  },
  {
    task: 'find my first customers',
    recs: [
      { name: 'Cold Email Craft', cat: 'writing', why: 'outreach that actually converts' },
      { name: 'Go-to-Market Planner', cat: 'business', why: 'a 30-day launch plan' },
    ],
  },
  {
    task: "analyze last quarter's sales",
    recs: [
      { name: 'SQL to Insights', cat: 'data', why: 'query → plain-English findings' },
      { name: 'Pandas Expert', cat: 'data', why: 'wrangle the numbers' },
    ],
  },
  {
    task: 'plan a week of healthy meals',
    recs: [{ name: 'Meal Planner', cat: 'personal', why: 'a full week, macro-aware' }],
  },
]

interface View {
  task: string
  query: string
  caret: boolean
  recs: Rec[]
  shown: number
  addedIdx: number | null
  cycle: number
  fading: boolean
}

const INITIAL: View = {
  task: TASKS[0].task,
  query: '',
  caret: false,
  recs: [],
  shown: 0,
  addedIdx: null,
  cycle: 0,
  fading: false,
}

const STATIC: View = {
  task: TASKS[0].task,
  query: TASKS[0].task,
  caret: false,
  recs: TASKS[0].recs,
  shown: TASKS[0].recs.length,
  addedIdx: 0,
  cycle: 0,
  fading: false,
}

function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function HeroDemo() {
  const [v, setV] = useState<View>(INITIAL)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(STATIC)
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

    const typeQuery = async (text: string, per = 46) => {
      for (let i = 1; i <= text.length; i++) {
        if (ctrl.cancelled) return
        setV((p) => ({ ...p, query: text.slice(0, i) }))
        await wait(per)
      }
    }

    const run = async () => {
      let order = shuffle(TASKS)
      let idx = 0
      let cycle = 0

      while (!ctrl.cancelled) {
        if (idx >= order.length) {
          order = shuffle(TASKS)
          idx = 0
        }
        const t = order[idx++]

        setV({
          task: t.task,
          query: '',
          caret: true,
          recs: t.recs,
          shown: 0,
          addedIdx: null,
          cycle: ++cycle,
          fading: false,
        })
        await wait(420)
        await typeQuery(t.task)
        if (ctrl.cancelled) return
        setV((p) => ({ ...p, caret: false }))
        await wait(520) // brief "matching" beat

        for (let i = 0; i < t.recs.length; i++) {
          if (ctrl.cancelled) return
          setV((p) => ({ ...p, shown: i + 1 }))
          await wait(360)
        }

        await wait(640)
        if (ctrl.cancelled) return
        setV((p) => ({ ...p, addedIdx: 0 }))
        await wait(2200)

        if (ctrl.cancelled) return
        setV((p) => ({ ...p, fading: true }))
        await wait(400)
      }
    }

    run()

    return () => {
      ctrl.cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  const matching = v.query.length > 0 && v.shown === 0

  return (
    <div
      aria-hidden
      className="demo-panel glass edge-light relative flex min-h-[340px] flex-col gap-4 overflow-hidden rounded-lg p-5 sm:min-h-[380px] sm:p-6"
    >
      {/* header / window chrome */}
      <div className="flex items-center justify-between border-b border-shelf-border pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-accent text-[11px] font-bold text-accent-contrast">
            S
          </span>
          <span className="text-sm font-medium text-shelf-text-primary">Skill Me</span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-shelf-text-tertiary">
          <span className="demo-live inline-block h-1.5 w-1.5 rounded-full bg-success" />
          Recommending
        </span>
      </div>

      <div
        className={`flex flex-1 flex-col gap-4 transition-opacity duration-300 ${
          v.fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* the task, framed as a prompt to Claude */}
        <div className="flex items-start gap-2 rounded-md border border-shelf-border bg-shelf-void px-3 py-2.5">
          <span className="select-none font-mono text-sm text-accent">›</span>
          <span className="text-sm leading-relaxed text-shelf-text-primary">
            {v.query}
            {v.caret && <span className="demo-caret" />}
          </span>
        </div>

        {/* recommender label */}
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-shelf-text-tertiary">
          {matching ? (
            <>
              <span className="demo-live inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Matching skills to your task…
            </>
          ) : v.shown > 0 ? (
            'Recommended for your task'
          ) : (
            ' '
          )}
        </div>

        {/* recommended skills */}
        <div className="flex flex-col gap-2">
          {v.recs.slice(0, v.shown).map((rec, i) => {
            const added = v.addedIdx === i
            const color = CATEGORY_MAP[rec.cat]?.color
            return (
              <div
                key={`${v.cycle}-${i}`}
                className={`demo-result flex items-center justify-between gap-3 rounded-md border bg-shelf-elevated px-3 py-2.5 transition-colors duration-300 ${
                  added ? 'border-accent-border' : 'border-shelf-border'
                }`}
                style={{
                  animationDelay: `${i * 60}ms`,
                  boxShadow: added ? 'var(--shadow-glow)' : undefined,
                }}
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate text-sm font-medium text-shelf-text-primary">
                      {rec.name}
                    </span>
                  </div>
                  <div className="truncate pl-4 font-mono text-[11px] text-shelf-text-tertiary">
                    {rec.why}
                  </div>
                </div>

                {added ? (
                  <span className="demo-installed flex shrink-0 items-center gap-1 rounded-md bg-accent px-2.5 py-1.5 text-xs font-medium text-accent-contrast">
                    <span className="text-[11px] font-bold">✓</span> Added
                  </span>
                ) : (
                  <span className="shrink-0 rounded-md border border-shelf-muted px-2.5 py-1.5 text-xs font-medium text-shelf-text-secondary">
                    Add
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
