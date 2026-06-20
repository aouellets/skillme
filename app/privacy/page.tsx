import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Skill Me handles your data: optional sign-in, no access to your chats or files — only the skills and packs you choose to install.',
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
        connector, or use signed in on the website. This policy explains what it stores and,
        just as importantly, what it never touches.
      </p>

      <Section title="Using the connector — no account required">
        <p>
          Using Skill Me through the MCP connector does not require a login. When you connect, a
          stable per-connection token is derived from the session headers your MCP client sends,
          and your installed library is tied to that token. We do not collect your name, email,
          or any profile information through the connector.
        </p>
      </Section>

      <Section title="Signing in on the website">
        <p>
          The website offers an optional sign-in (email magic link or GitHub) so you can manage
          your library, favorites, reviews, and collections from a browser. Authentication is
          handled by Supabase Auth; when you sign in we store your account identifier and email,
          and — if you sign in with GitHub — the public profile name GitHub provides. If you
          never sign in on the website, none of this is collected.
        </p>
      </Section>

      <Section title="What we store">
        <p>
          Only what is needed to provide the service: which skills and packs you install, the
          ratings and written reviews you submit, the skills you favorite, and the collections
          you create. These records are stored in our database (Supabase), keyed to your
          connection token or signed-in account, so they persist across sessions.
        </p>
        <p>
          Written reviews are public: each review is shown on the skill&rsquo;s page alongside a
          display name (your GitHub username or name when available, otherwise
          &ldquo;Anonymous&rdquo;). We never display your email address. If you join the
          newsletter, we store the email address you enter so we can notify you about new skills
          and packs; you can ask us to remove it at any time.
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
          Library, rating, review, favorite, and collection records persist so your skills
          remain available. In Claude you can remove items with the <code>uninstall_skill</code>{' '}
          and <code>manage_collection</code> tools; on the website you can unfavorite skills,
          edit your reviews, and delete collections directly. To request deletion of your
          newsletter signup or of all data tied to your connection or account, contact us.
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
            href="mailto:support@skillme.dev"
            className="text-accent transition-colors hover:text-accent-hover"
          >
            support@skillme.dev
          </a>
          .
        </p>
      </Section>
    </div>
  )
}
