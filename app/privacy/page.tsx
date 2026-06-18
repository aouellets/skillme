import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Skill Me handles your data: no login, no access to your chats or files — only the skills and packs you choose to install.',
}

const UPDATED = 'June 18, 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold text-shelf-text-primary">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-shelf-text-secondary">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-widest text-shelf-text-tertiary">
        Legal
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-shelf-text-primary">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-shelf-text-tertiary">Last updated: {UPDATED}</p>

      <p className="mt-8 text-sm leading-relaxed text-shelf-text-secondary">
        Skill Me is a catalog of Claude skills you can browse and install through an MCP
        connector. This policy explains what it stores and, just as importantly, what it
        never touches.
      </p>

      <Section title="No account required">
        <p>
          Skill Me does not require a login. When you connect, a stable per-connection token
          is derived from the session headers your MCP client sends, and your installed
          library is tied to that token. We do not collect your name, email, or any profile
          information through the connector.
        </p>
      </Section>

      <Section title="What we store">
        <p>
          Only what is needed to provide the service: which skills and packs you install, the
          ratings you submit, and the collections you create. These records are stored in our
          database (Supabase), keyed to your connection token, so your skills stay installed
          across sessions.
        </p>
      </Section>

      <Section title="What we never access">
        <p>
          Skill Me does not read your conversations, Claude memory, uploaded files, or any
          data outside the tool calls you make to it. Its tools act only on the public catalog
          and on your own library.
        </p>
      </Section>

      <Section title="Sharing">
        <p>
          We do not sell or share your data. Aggregate, non-identifying counts may be shown
          publicly in the catalog (for example, a skill&rsquo;s total install count). Collections
          are private unless you explicitly create a share link.
        </p>
      </Section>

      <Section title="Retention and deletion">
        <p>
          Library, rating, and collection records persist so your skills remain available. You
          can remove items at any time with the <code>uninstall_skill</code> and{' '}
          <code>manage_collection</code> tools; removed items are deleted from your library. To
          request deletion of all data tied to your connection, contact us.
        </p>
      </Section>

      <Section title="Third parties">
        <p>
          Hosting and the database are provided by Vercel and Supabase. The safety classifier
          used when reviewing submitted skills runs on the Anthropic API. Anonymous,
          privacy-friendly usage analytics are collected via Vercel Analytics.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions or data requests:{' '}
          <a
            href="mailto:support@skillshelf.ai"
            className="text-accent transition-colors hover:text-accent-hover"
          >
            support@skillshelf.ai
          </a>
          .
        </p>
      </Section>
    </div>
  )
}
