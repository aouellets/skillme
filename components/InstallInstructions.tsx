import Link from 'next/link'
import { CopyButton } from './CopyButton'
import { MCP_URL } from '@/lib/site'

export function InstallInstructions({ skillName }: { skillName: string }) {
  return (
    <div className="card p-5">
      <h2 className="text-lg font-medium text-shelf-text-primary">Install via Claude</h2>
      <ol className="mt-4 space-y-3 text-sm text-shelf-text-secondary">
        <li className="flex gap-3">
          <span className="font-mono text-accent">1.</span>
          <span>
            Make sure the SkillShelf MCP is connected.{' '}
            <Link href="/connect" className="text-accent hover:text-accent-hover">
              Connect in 30 seconds →
            </Link>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-accent">2.</span>
          <span>
            In any Claude conversation, say:
            <span className="mt-1 block rounded-btn border border-shelf-border bg-shelf-void px-3 py-2 font-mono text-shelf-text-primary">
              Install the {skillName} skill
            </span>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-accent">3.</span>
          <span>It activates automatically in your next session.</span>
        </li>
      </ol>

      <div className="mt-5 border-t border-shelf-border pt-4">
        <p className="text-xs text-shelf-text-tertiary">MCP endpoint</p>
        <div className="mt-2 flex items-center gap-2">
          <code className="flex-1 overflow-x-auto rounded-btn border border-shelf-border bg-shelf-void px-3 py-2 font-mono text-sm text-shelf-text-primary">
            {MCP_URL}
          </code>
          <CopyButton value={MCP_URL} />
        </div>
      </div>
    </div>
  )
}
