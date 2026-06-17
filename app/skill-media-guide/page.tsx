import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Skill Media Guide',
  description: 'How to add thumbnails, GIFs, and animated previews to your Claude skill on SkillShelf.',
}

export default function SkillMediaGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <span className="eyebrow">Contributor guide</span>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-shelf-text-primary sm:text-5xl">
        Skill media guide
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-shelf-text-secondary">
        Add animated thumbnails, GIF previews, and video loops to your skills.
        They play on hover in the catalog, and a good preview converts browsers into installers.
      </p>

      {/* Quick start */}
      <section className="mt-10">
        <h2 className="text-xl font-medium text-shelf-text-primary">Quick start</h2>
        <p className="mt-2 text-shelf-text-secondary">
          Add a <code className="rounded border border-shelf-border bg-shelf-void px-1.5 py-0.5 font-mono text-sm text-shelf-text-primary">media</code> block to your SKILL.md frontmatter:
        </p>
        <pre className="skill-preview mt-4 overflow-auto rounded-lg border border-shelf-border bg-shelf-void p-4 font-mono text-sm text-shelf-text-secondary">
{`---
name: My Skill
description: What this skill does.
media:
  thumbnail: https://raw.githubusercontent.com/you/skill/main/assets/preview.png
  gif: https://raw.githubusercontent.com/you/skill/main/assets/preview.gif
  alt: "Short description of what the preview shows"
---`}
        </pre>
      </section>

      {/* Fields table */}
      <section className="mt-10">
        <h2 className="text-xl font-medium text-shelf-text-primary">Media fields</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-shelf-border text-left text-shelf-text-tertiary">
                <th className="pb-2 pr-4">Field</th>
                <th className="pb-2 pr-4">Format</th>
                <th className="pb-2 pr-4">Size</th>
                <th className="pb-2">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-shelf-text-secondary">
              {[
                ['thumbnail', 'PNG, JPG, WebP', '500 KB', 'Static preview + OG image'],
                ['gif', 'Animated GIF', '3 MB', 'Hover animation in catalog'],
                ['video', 'MP4 or WebM', '5 MB', 'Hover video loop (silent)'],
                ['lottie', 'Lottie JSON URL', '200 KB', 'Vector animation'],
                ['alt', 'Text (125 chars)', 'n/a', 'Screen reader description'],
              ].map(([field, format, size, purpose]) => (
                <tr key={field} className="border-b border-shelf-border/50">
                  <td className="py-2 pr-4 text-accent">{field}</td>
                  <td className="py-2 pr-4">{format}</td>
                  <td className="py-2 pr-4 text-shelf-text-tertiary">{size}</td>
                  <td className="py-2">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tools */}
      <section className="mt-10">
        <h2 className="text-xl font-medium text-shelf-text-primary">Recommended tools</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { name: 'Kap', url: 'https://getkap.co', desc: 'macOS screen recorder to GIF/MP4' },
            { name: 'LICEcap', url: 'https://www.cockos.com/licecap/', desc: 'Win/Mac direct GIF capture' },
            { name: 'Gifski', url: 'https://gif.ski', desc: 'Highest quality GIF from video' },
            { name: 'Ezgif', url: 'https://ezgif.com/optimize', desc: 'Web-based GIF optimizer' },
            { name: 'Figma', url: 'https://figma.com', desc: 'Design static thumbnails' },
            { name: 'Carbon', url: 'https://carbon.now.sh', desc: 'Code screenshot thumbnails' },
            { name: 'LottieFiles', url: 'https://lottiefiles.com', desc: 'Free Lottie animation library' },
            { name: 'Cloudinary', url: 'https://cloudinary.com', desc: 'Free tier CDN hosting' },
          ].map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 hover:border-shelf-muted"
            >
              <span className="text-sm font-medium text-shelf-text-primary">{tool.name}</span>
              <p className="mt-1 text-xs text-shelf-text-secondary">{tool.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Download raw guide */}
      <section className="mt-10 card p-5">
        <h2 className="text-base font-medium text-shelf-text-primary">Full guide</h2>
        <p className="mt-2 text-sm text-shelf-text-secondary">
          The complete media guide with hosting options, FFmpeg commands, and OG image specs
          is available as a Markdown file for contributors.
        </p>
        <div className="mt-4 flex gap-3">
          <a
            href="/SKILL_MEDIA_GUIDE.md"
            className="btn btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download guide (.md)
          </a>
          <Link href="/browse" className="btn btn-ghost">
            Browse catalog →
          </Link>
        </div>
      </section>
    </div>
  )
}
