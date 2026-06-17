import type { Metadata } from 'next'
import { CopyButton } from '@/components/CopyButton'
import { MCP_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Connect to Claude',
  description:
    'Add Skill Me to claude.ai in 30 seconds. Connect the MCP once and browse, install, and manage 300+ Claude skills from inside any Claude conversation.',
  twitter: {
    card: 'summary_large_image',
  },
}

// Screenshots are shown only once the files exist and the flag is enabled in
// Vercel. Keeps the page from rendering broken images before then.
const SHOW_SCREENSHOTS = process.env.NEXT_PUBLIC_SHOW_SCREENSHOTS === 'true'

const STEPS: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: 'Open claude.ai',
    body: 'Go to claude.ai and click your avatar in the bottom-left, then choose Settings.',
  },
  {
    title: 'Open Integrations',
    body: 'In the Settings sidebar, click "Integrations".',
  },
  {
    title: 'Add an integration',
    body: 'Click "+ Add integration" (also labeled "Add custom integration").',
  },
  {
    title: 'Paste the Skill Me URL',
    body: 'paste-url',
  },
  {
    title: 'Connect',
    body: 'Click Connect. You will see Skill Me appear in your integrations list.',
  },
  {
    title: 'Start a conversation',
    body: 'Open a new conversation and say "show me skills". Claude will search the catalog for you.',
  },
]

export default function ConnectPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <span className="eyebrow">Setup</span>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-shelf-text-primary sm:text-5xl">
        Connect in 30 seconds
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-shelf-text-secondary">
        Skill Me runs as an MCP integration inside claude.ai. Connect it once and your
        installed skills load in every conversation.
      </p>

      {/* Quick copy */}
      <div className="card mt-8 p-5">
        <p className="text-xs text-shelf-text-tertiary">MCP endpoint</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="flex-1 overflow-x-auto rounded-btn border border-shelf-border bg-shelf-void px-3 py-2 font-mono text-sm text-shelf-text-primary">
            {MCP_URL}
          </code>
          <CopyButton value={MCP_URL} label="Copy URL" className="btn btn-primary" />
        </div>
      </div>

      {/* Steps */}
      <ol className="mt-10 space-y-4">
        {STEPS.map((step, i) => (
          <li key={step.title} className="card flex gap-4 p-5">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-accent-border bg-accent-dim font-mono text-sm font-medium text-accent-hover">
              {i + 1}
            </span>
            <div className="w-full min-w-0">
              <h2 className="font-display text-base font-semibold text-shelf-text-primary">{step.title}</h2>
              {step.body === 'paste-url' ? (
                <>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <code className="flex-1 overflow-x-auto rounded-btn border border-shelf-border bg-shelf-void px-3 py-2 font-mono text-sm text-shelf-text-primary">
                      {MCP_URL}
                    </code>
                    <CopyButton value={MCP_URL} />
                  </div>
                  {SHOW_SCREENSHOTS && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-shelf-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/screenshots/add-integration.png"
                        alt="Paste the Skill Me URL and click Connect"
                        className="w-full"
                        loading="lazy"
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-1 text-sm leading-relaxed text-shelf-text-secondary">
                    {step.body}
                  </p>
                  {SHOW_SCREENSHOTS && i === 0 && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-shelf-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/screenshots/settings-avatar.png"
                        alt="Click your avatar in the bottom-left of claude.ai"
                        className="w-full"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {SHOW_SCREENSHOTS && i === 1 && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-shelf-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/screenshots/settings-integrations.png"
                        alt="Click Integrations in the Settings sidebar"
                        className="w-full"
                        loading="lazy"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="card mt-8 border-accent-border bg-accent-dim p-5">
        <p className="text-sm leading-relaxed text-accent-hover">
          Your MCP connection is permanent. Once connected, skills persist across all
          conversations. There is nothing to reinstall.
        </p>
      </div>
    </div>
  )
}
