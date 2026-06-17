import { ImageResponse } from 'next/og'
import { getSkillBySlug } from '@/lib/data'
import { CATEGORY_MAP, formatInstalls } from '@/lib/categories'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-dynamic'
export const alt = 'SkillShelf skill'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const skill = await getSkillBySlug(slug)

  const name = skill?.name ?? 'SkillShelf'
  const description =
    skill?.description ?? 'The App Store for Claude Skills. Install intelligence.'
  const category = skill ? CATEGORY_MAP[skill.category] : undefined
  const installs = skill ? `${formatInstalls(skill.install_count)} installs` : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0a0a0c',
          padding: '0',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background thumbnail image if available */}
        {skill?.thumbnail_url && (
          <img
            src={skill.thumbnail_url}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.25,
            }}
          />
        )}

        {/* Dark gradient overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0.96) 60%)',
          }}
        />

        {/* Content over the overlay */}
        <div
          style={{
            position: 'relative',
            padding: '72px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {category && (
              <div style={{ display: 'flex', fontSize: 28, color: '#9AA0AD' }}>
                {category.label}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 84,
                color: '#fafafa',
                lineHeight: 1.05,
                fontWeight: 700,
              }}
            >
              {name}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 32,
                color: '#9AA0AD',
                lineHeight: 1.4,
                maxWidth: '900px',
              }}
            >
              {description.length > 140 ? `${description.slice(0, 140)}…` : description}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', fontSize: 30, color: '#f0b429', fontWeight: 700 }}>
              SkillShelf
            </div>
            {installs && (
              <div style={{ display: 'flex', fontSize: 26, color: '#6c6c79' }}>{installs}</div>
            )}
          </div>
        </div>
      </div>
    ),
    size
  )
}
