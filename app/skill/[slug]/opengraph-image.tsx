import { ImageResponse } from 'next/og'
import { getSkillBySlug } from '@/lib/data'
import { CATEGORY_MAP, installLabel } from '@/lib/categories'
import {
  OG,
  OG_SIZE,
  OG_CONTENT_TYPE,
  CATEGORY_COLORS,
  loadBrandFonts,
  Lockup,
  Pill,
  Star,
  Check,
  truncateWords,
  headlineSize,
} from '@/lib/og/brand'

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
  const catColor = skill ? CATEGORY_COLORS[skill.category] ?? OG.accent : OG.accent
  const installs = skill ? installLabel(skill.install_count) : null
  const rating = skill && skill.rating_count > 0 ? skill.rating_avg.toFixed(1) : null
  const author = skill?.author?.trim()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: OG.void,
          fontFamily: 'Inter',
          padding: 76,
          paddingTop: 70,
          position: 'relative',
        }}
      >
        {/* category-colored signature bar along the very top */}
        <div
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: catColor }}
        />
        {/* subtle category-tinted ambient so flat (thumbnail-less) cards still
            read as lit and on-brand rather than dead black */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -150,
            width: 680,
            height: 680,
            borderRadius: 9999,
            background: `radial-gradient(circle at center, ${catColor}24, ${catColor}00 70%)`,
          }}
        />
        {/* faint skill thumbnail as backdrop, if available */}
        {skill?.thumbnail_url && (
          <img
            src={skill.thumbnail_url}
            alt=""
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{ position: 'absolute', inset: 0, objectFit: 'cover', opacity: 0.14 }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(165deg, rgba(8,10,10,0.35), ${OG.void} 70%)`,
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
          <Lockup />
          {category && <Pill dot={catColor}>{category.label}</Pill>}
        </div>

        {/* air above the title block bottom-weights the composition */}
        <div style={{ display: 'flex', flex: 1 }} />

        {/* eyebrow + skill name + description */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: catColor,
              marginBottom: 22,
            }}
          >
            Agent Skill
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: headlineSize(name),
              fontWeight: 800,
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
              marginTop: 26,
              fontSize: 34,
              lineHeight: 1.34,
              color: OG.secondary,
              maxWidth: 1000,
            }}
          >
            {truncateWords(description, 144)}
          </div>
        </div>

        {/* footer: provenance + signals (left, never empty), CTA (right) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 54,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 28, color: OG.secondary }}>
            {author && <div style={{ display: 'flex' }}>{`by ${author}`}</div>}
            {skill?.verified && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: OG.accent }}>
                <Check size={26} /> Verified
              </div>
            )}
            {rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Star size={26} /> {rating}
              </div>
            )}
            {installs && <div style={{ display: 'flex' }}>{installs}</div>}
          </div>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: OG.accent }}>
            Install on skillme.dev
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  )
}
