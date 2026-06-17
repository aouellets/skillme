import { ImageResponse } from 'next/og'
import { OG, OG_SIZE, OG_CONTENT_TYPE, loadBrandFonts, LogoBadge, Wordmark, Chip } from '@/lib/og/brand'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Skill Me, the App Store for Claude Skills'

export default async function Image() {
  const fonts = await loadBrandFonts()

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
        {/* lime ambient glow, top-right */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 720,
            height: 560,
            borderRadius: 9999,
            background:
              'radial-gradient(circle at center, rgba(180,243,62,0.20), rgba(180,243,62,0))',
          }}
        />

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <LogoBadge size={56} />
          <Wordmark size={30} />
        </div>

        {/* headline block */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              fontSize: 124,
              fontWeight: 900,
              letterSpacing: -4,
              lineHeight: 1.0,
              color: OG.text,
            }}
          >
            Install&nbsp;<span style={{ color: OG.gold }}>intelligence.</span>
          </div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 38, color: OG.secondary }}>
            The App Store for Claude skills. Connect once, install anything.
          </div>
        </div>

        {/* footer chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Chip>300+ curated skills</Chip>
          <Chip>Open source</Chip>
          <Chip>Works in every Claude chat</Chip>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  )
}
