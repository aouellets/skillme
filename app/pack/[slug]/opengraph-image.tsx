import { ImageResponse } from 'next/og'
import { getPackBySlug } from '@/lib/packs'
import { formatInstalls } from '@/lib/categories'
import { OG, OG_SIZE, OG_CONTENT_TYPE, loadBrandFonts, LogoBadge, Wordmark, clean } from '@/lib/og/brand'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const dynamic = 'force-dynamic'
export const alt = 'Skill Me pack'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pack = await getPackBySlug(slug)
  const fonts = await loadBrandFonts()

  const name = pack?.name ?? 'Skill Me'
  const tagline = pack?.tagline ?? 'A themed bundle of curated Claude skills.'
  const skillCount = pack?.skill_count ?? 0
  const installs = pack ? formatInstalls(pack.install_count) : null

  const nameSize = name.length > 34 ? 64 : name.length > 22 ? 80 : 96
  const cleanedTag = clean(tagline)
  const tag = cleanedTag.length > 150 ? `${cleanedTag.slice(0, 150)}…` : cleanedTag

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: OG.void,
          fontFamily: 'Geist',
          padding: 80,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 720,
            height: 560,
            borderRadius: 9999,
            background:
              'radial-gradient(circle at center, rgba(180,243,62,0.18), rgba(180,243,62,0))',
          }}
        />

        {/* header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <LogoBadge size={56} />
            <Wordmark size={30} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: `1px solid #5a440f`,
              backgroundColor: '#241c0c',
              borderRadius: 999,
              padding: '10px 22px',
              fontSize: 26,
              color: OG.gold,
            }}
          >
            {`Pack of ${skillCount} skills`}
          </div>
        </div>

        {/* pack name + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              fontSize: nameSize,
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1.02,
              color: OG.text,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontSize: 34,
              lineHeight: 1.35,
              color: OG.secondary,
              maxWidth: 1000,
            }}
          >
            {tag}
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', fontSize: 28, color: OG.secondary }}>
            {installs ? `${installs} installs` : 'Install the whole set in one command'}
          </div>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, color: OG.gold }}>
            Install on Skill Me
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  )
}
