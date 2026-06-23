/**
 * Bounded inlining of skill bodies into an install tool-result.
 *
 * `install_skill`/`install_pack` inline skill content so a freshly installed
 * skill applies immediately (get_active_skills only reloads at session start).
 * But the claude.ai MCP connector rejects oversized tool results, and inlining
 * EVERY skill in a large pack produced 100KB–550KB responses (e.g. a 42-skill
 * pack = ~553KB / ~137K tokens) that the connector dropped as a failed install.
 *
 * So we keep the immediate-activation benefit but bound it: inline skill bodies
 * in order up to a byte budget, and just name the rest. The overflow skills are
 * still installed — they activate next session, or can be loaded now one at a
 * time with install_skill.
 */

// ~12K tokens of content. Comfortably under the connector's tool-result cap
// while still inlining a single skill or a small pack in full.
export const MAX_INLINE_BYTES = 48_000

export interface InlineSkill {
  id: string
  name: string
  skill_content: string | null
}

export interface InlineResult {
  /** Markdown of the inlined skill bodies; '' when nothing had content. */
  body: string
  /** Installed skills whose content didn't fit the budget (still saved). */
  overflow: InlineSkill[]
}

export function inlineSkills(
  skills: InlineSkill[],
  budget = MAX_INLINE_BYTES
): InlineResult {
  const parts: string[] = []
  const overflow: InlineSkill[] = []
  let used = 0

  for (const skill of skills) {
    if (!skill.skill_content) continue // nothing to inline; not an overflow
    const block = `## ${skill.name}\n\n${skill.skill_content}`

    // Once we've inlined something, stop adding blocks that would bust the
    // budget — name them as overflow instead.
    if (used > 0 && used + block.length > budget) {
      overflow.push(skill)
      continue
    }

    // First block exceeds the budget on its own (a single oversized skill):
    // inline a truncated copy so it still activates rather than failing.
    if (block.length > budget) {
      parts.push(
        block.slice(0, budget) +
          '\n\n…(truncated — open the skill page for the full text)'
      )
      used = budget
      continue
    }

    parts.push(block)
    used += block.length
  }

  return { body: parts.join('\n\n---\n\n'), overflow }
}
