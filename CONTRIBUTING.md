# Contributing to Skill Me

Thanks for helping grow the shelf. The most valuable contribution is a good
skill — but bug fixes and improvements to the catalog are equally welcome.

## Submitting a skill

Skills are accepted via pull request.

1. **Fork** this repository.
2. **Add your skill.** Skill Me–authored packs live as JSON in
   `scripts/expansion-data/*.json` and compile to portable
   `skills/<slug>/SKILL.md` files plus `lib/seed-data-expansion.ts` via
   `npx tsx scripts/build-expansion.ts` (don't hand-edit the generated files).
   Community single-skill submissions can go straight into `lib/seed-data.ts`.
   Either way, follow the existing shape:
   - `slug` — unique, lowercase, hyphenated.
   - `name` — short and human-readable.
   - `description` — one sentence, plain English, no buzzwords.
   - `category` — one of `coding`, `writing`, `research`, `productivity`,
     `data`, `design`, `business`, `personal`.
   - `tags` — 2–5 topical tags.
   - `skill_content` — the full `SKILL.md`, with YAML frontmatter (`name`,
     `description`) and genuinely useful instructions. Write real content; stubs
     are rejected.
   - `author` / `source_url` — attribution. Link the original repo if it exists.
3. **Open a PR** describing what the skill does and who it is for.

### What makes a good skill

- Clear, transparent instructions a person could read and follow.
- A specific job to be done, not a vague "be better at X".
- No instructions that try to override Claude's behavior, exfiltrate data, or
  hide content.

## Safety review

Every submitted skill is intended to run through a Claude-powered safety
classifier before merging. A skill is rejected if it:

- Instructs Claude to ignore prior instructions or override safety rules.
- Attempts to exfiltrate data to external URLs.
- Contains hidden, encoded, or obfuscated instructions.
- Tries to deceive the user or claims special permissions.

## Code contributions

```bash
npm install
npm run dev      # start the dev server
npm run lint     # lint
npm run build    # production build
```

- TypeScript strict mode — no `any`.
- Match the existing style and design tokens (`styles/tokens.css`).
- Keep diffs scoped to what the change requires.

## Reporting issues

Open a GitHub issue with steps to reproduce. For catalog data problems (a wrong
description, a dead source link), a PR is usually faster.

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](./LICENSE).
