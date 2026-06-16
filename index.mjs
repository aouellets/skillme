import { streamText } from 'ai'

// With the Vercel AI SDK v5+, a plain "creator/model" string routes through the
// Vercel AI Gateway automatically — no provider package or API key needed when
// VERCEL_OIDC_TOKEN is present (pulled via `vc env pull .env.local`).
const result = streamText({
  model: 'anthropic/claude-opus-4-8',
  // Swap to any gateway model, e.g.: model: 'openai/gpt-5.5'
  prompt: 'Explain quantum computing in simple terms.',
})

for await (const chunk of result.textStream) {
  process.stdout.write(chunk)
}

process.stdout.write('\n')
