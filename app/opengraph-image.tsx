import { ImageResponse } from 'next/og'
import { OG, OG_SIZE, OG_CONTENT_TYPE, loadBrandFonts, LogoBadge, Wordmark } from '@/lib/og/brand'
import { getSkillCount, formatSkillCount } from '@/lib/data'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Skill Me, the App Store for Claude Skills'

export default async function Image() {
  const [fonts, skillCount] = await Promise.all([loadBrandFonts(), getSkillCount()])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 30,
          backgroundColor: OG.paper,
          fontFamily: 'Inter',
          padding: 80,
          position: 'relative',
        }}
      >
        {/* faint vermilion wash, bottom-right — warmth without a gradient blob */}
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -160,
            width: 680,
            height: 520,
            borderRadius: 9999,
            background:
              'radial-gradient(circle at center, rgba(238,70,40,0.12), rgba(238,70,40,0))',
          }}
        />

        {/* eyebrow */}
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: OG.accent,
          }}
        >
          Install Intelligence
        </div>

        {/* mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <LogoBadge size={132} tile={OG.ink} bar={OG.paper} />
          <Wordmark size={104} color={OG.ink} />
        </div>

        {/* tagline */}
        <div style={{ display: 'flex', fontSize: 38, color: OG.inkMuted }}>
          The App Store for Claude skills.
        </div>

        {/* count line */}
        <div style={{ display: 'flex', fontSize: 27, fontWeight: 600, color: OG.ink }}>
          {`${formatSkillCount(skillCount)} curated skills · Connect once, install anything`}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  )
}
