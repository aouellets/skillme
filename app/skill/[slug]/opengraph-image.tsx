import { ImageResponse } from 'next/og'
import { getSkillBySlug } from '@/lib/data'
import { CATEGORY_MAP, formatInstalls } from '@/lib/categories'
import { OG, OG_SIZE, OG_CONTENT_TYPE, loadBrandFonts, LogoBadge, Wordmark, Star, clean } from '@/lib/og/brand'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const dynamic = 'force-dynamic'
export const alt = 'Skill Me skill'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)
  const fonts = await loadBrandFonts()

  const name = skill?.name ?? 'Skill Me'
  const description =
    skill?.description ?? 'The App Store for Claude skills. Install intelligence.'
  const category = skill ? CATEGORY_MAP[skill.category] : undefined
  const installs = skill ? formatInstalls(skill.install_count) : null
  const rating = skill && skill.rating_count > 0 ? skill.rating_avg.toFixed(1) : null

  // Scale the headline so long names still fit on two lines.
  const nameSize = name.length > 34 ? 64 : name.length > 22 ? 80 : 96
  const cleaned = clean(description)
  const desc = cleaned.length > 150 ? `${cleaned.slice(0, 150)}…` : cleaned

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
        {/* faint skill thumbnail as backdrop, if available */}
        {skill?.thumbnail_url && (
          <img
            src={skill.thumbnail_url}
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{ position: 'absolute', inset: 0, objectFit: 'cover', opacity: 0.16 }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(10,10,12,0.55), ${OG.void} 72%)`,
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
          {category && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                border: `1px solid ${OG.border}`,
                backgroundColor: OG.surface,
                borderRadius: 999,
                padding: '10px 22px',
                fontSize: 26,
                color: OG.secondary,
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: OG.gold }} />
              {category.label}
            </div>
          )}
        </div>

        {/* skill name + description */}
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
            {desc}
          </div>
        </div>

        {/* footer: rating + installs, brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 28, color: OG.secondary }}>
            {rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Star size={28} /> {rating}
              </div>
            )}
            {installs && <div style={{ display: 'flex' }}>{installs} installs</div>}
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
