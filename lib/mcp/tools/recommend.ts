import { recommendSkills } from '../../recommend'
import { rerankRecommendations } from '../../recommend-rerank'
import { text, type Tool } from '../types'
import { track } from '../../telemetry/track'

interface RecommendArgs {
  task?: string
  limit?: number
}

/** First sentence of a description, minus the trigger clause, for a fallback reason. */
function firstSentence(desc: string): string {
  const trimmed = desc.replace(/\s+(Use|Triggers?) (when|on).*$/i, '').trim()
  const m = trimmed.match(/^.*?[.!?](?=\s|$)/)
  return (m ? m[0] : trimmed).trim()
}

export const recommendSkillsTool: Tool<RecommendArgs> = {
  definition: {
    name: 'recommend_skills',
    annotations: { title: 'Recommend skills for a task', readOnlyHint: true },
    description:
      'Recommend the most relevant Skill Me skills and the best-fit pack for what the user is ' +
      'trying to do. Pass the task in natural language (a sentence about the goal), NOT keywords — ' +
      'this does semantic matching, so "make my demo video less janky" finds the right motion-design ' +
      'skill even though those words are not in it. Returns a short ranked list, each with a reason ' +
      'and a skill_id (and a best-fit pack_id), ready to install. Call this proactively at the start ' +
      'of a non-trivial task to surface skills that would help, then install the clearly-relevant ones.',
    inputSchema: {
      type: 'object',
      required: ['task'],
      properties: {
        task: {
          type: 'string',
          description: 'What the user is trying to accomplish, in natural language.',
        },
        limit: {
          type: 'number',
          description: 'Max skills to recommend (default 5, max 8).',
        },
      },
    },
  },

  async handler(args, ctx) {
    const task = (args.task ?? '').trim()
    if (!task) {
      return text(
        "Describe the task — what you're trying to do — and I'll recommend the skills that fit.",
        true
      )
    }
    const max = Math.min(Math.max(args.limit ?? 5, 1), 8)

    // Retrieve a broad candidate set (semantic, or lexical fallback).
    const { skills, packs, mode } = await recommendSkills(task, {
      skillLimit: 12,
      packLimit: 4,
    })

    if (skills.length === 0 && packs.length === 0) {
      return text(
        `No skills matched that task. Try \`browse_skills\` with a keyword, or rephrase the goal.`
      )
    }

    // Rerank to the best few with written reasons (best-effort).
    const ranked = await rerankRecommendations(task, skills, packs, max)
    const usedRerank = ranked !== null

    let finalSkills: { id: string; name: string; category: string; reason: string }[]
    let finalPack: { id: string; name: string; reason: string } | null = null

    if (ranked) {
      const byId = new Map(skills.map((s) => [s.id, s]))
      finalSkills = ranked.skills
        .map((r) => {
          const s = byId.get(r.id)
          return s ? { id: s.id, name: s.name, category: s.category, reason: r.reason } : null
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)
      if (ranked.pack) {
        const p = packs.find((p) => p.id === ranked.pack!.id)
        if (p) finalPack = { id: p.id, name: p.name, reason: ranked.pack.reason }
      }
    } else {
      // Vector/lexical order with templated reasons.
      finalSkills = skills
        .slice(0, max)
        .map((s) => ({ id: s.id, name: s.name, category: s.category, reason: firstSentence(s.description) }))
      const p = packs[0]
      if (p) finalPack = { id: p.id, name: p.name, reason: firstSentence(p.tagline ?? p.description) }
    }

    if (finalSkills.length === 0 && !finalPack) {
      return text(
        `No skills matched that task. Try \`browse_skills\` with a keyword, or rephrase the goal.`
      )
    }

    void track(
      {
        name: 'skill_recommended',
        properties: { result_count: finalSkills.length, used_rerank: usedRerank, mode },
      },
      { source: 'mcp', userToken: ctx.userToken, sessionId: ctx.userToken }
    )

    const lines = finalSkills.map((s, i) =>
      [`${i + 1}. ${s.name} — ${s.category}`, `   ${s.reason}`, `   skill_id: ${s.id}`].join('\n')
    )
    const parts = [`For "${task}", these look most relevant:`, '', lines.join('\n\n')]
    if (finalPack) {
      parts.push(
        '',
        `Best-fit pack — ${finalPack.name}: ${finalPack.reason}`,
        `   pack_id: ${finalPack.id}`
      )
    }
    parts.push(
      '',
      'Install a skill with install_skill (skill_id), or the whole pack with install_pack (pack_id).'
    )
    return text(parts.join('\n'))
  },
}
