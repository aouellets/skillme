import { ImageResponse } from 'next/og'
import {
  OG,
  OG_SIZE,
  OG_CONTENT_TYPE,
  CATEGORY_COLORS,
  loadBrandFonts,
  Lockup,
  monogram,
  readableOn,
} from '@/lib/og/brand'
import { getSkills, getSkillCount, formatSkillCount } from '@/lib/data'
import { getPacks } from '@/lib/packs'
import type { Skill } from '@/lib/types'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const dynamic = 'force-dynamic'
export const alt = 'Skill Me, the App Store for Claude Skills'

const TILES = 9

/** Round-robin across categories so the tile grid shows the full brand spectrum
 *  instead of nine cyan coding tiles. */
function pickDiverse(skills: Skill[], n: number): Skill[] {
  const byCat = new Map<string, Skill[]>()
  const seen = new Set<string>()
  for (const s of skills) {
    if (seen.has(s.slug)) continue
    seen.add(s.slug)
    if (!byCat.has(s.category)) byCat.set(s.category, [])
    byCat.get(s.category)!.push(s)
  }
  const cats = [...byCat.keys()]
  const out: Skill[] = []
  for (let i = 0; out.length < n && cats.some((c) => byCat.get(c)!.length); i++) {
    const bucket = byCat.get(cats[i % cats.length])!
    if (bucket.length) out.push(bucket.shift()!)
  }
  return out
}

export default async function Image() {
  const [fonts, skillCount, packPage, featured, trending] = await Promise.all([
    loadBrandFonts(),
    getSkillCount(),
    getPacks({ limit: 1 }),
    getSkills({ featured: true, limit: 40 }),
    getSkills({ sort: 'hot', limit: 30 }),
  ])

  const tiles = pickDiverse([...featured.skills, ...trending.skills], TILES)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: OG.void,
          fontFamily: 'Inter',
          padding: 72,
          position: 'relative',
        }}
      >
        {/* vermilion signature bar + a soft warm glow behind the tile shelf */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: OG.accent }} />
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: 'radial-gradient(circle at center, rgba(238,70,40,0.16), rgba(238,70,40,0))',
          }}
        />

        {/* left column: lockup, headline + proof, CTA */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: 560,
            paddingRight: 36,
            position: 'relative',
          }}
        >
          <Lockup mark={62} word={34} />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 66,
                fontWeight: 800,
                letterSpacing: -2.5,
                lineHeight: 1.04,
                color: OG.text,
              }}
            >
              The App Store for Claude skills.
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 24,
                fontSize: 30,
                lineHeight: 1.32,
                color: OG.secondary,
                maxWidth: 520,
              }}
            >
              Connect once, install anything. Claude just knows how.
            </div>

            {/* social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 30 }}>
              <Stat value={formatSkillCount(skillCount)} label="skills" />
              <Stat value={formatSkillCount(packPage.total)} label="packs" />
              <Stat value="free" label="to start" accent />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 30, fontWeight: 700, color: OG.accent }}>
            skillme.dev
            <span style={{ display: 'flex', color: OG.secondary, fontWeight: 400 }}>→</span>
          </div>
        </div>

        {/* right column: the app-store shelf */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, width: 486 }}>
            {tiles.map((s) => {
              const color = CATEGORY_COLORS[s.category] ?? OG.accent
              return (
                <div
                  key={s.slug}
                  style={{
                    display: 'flex',
                    position: 'relative',
                    width: 150,
                    height: 150,
                    borderRadius: 34,
                    backgroundColor: color,
                    boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
                  }}
                >
                  {/* glossy sheen → base depth: color-agnostic so every tile reads
                      as a crafted app icon rather than a flat swatch */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 34,
                      background:
                        'linear-gradient(157deg, rgba(255,255,255,0.30), rgba(255,255,255,0.05) 44%, rgba(0,0,0,0.26))',
                    }}
                  />
                  {/* crisp top rim-light */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 34,
                      border: '1px solid rgba(255,255,255,0.20)',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 54,
                      fontWeight: 800,
                      letterSpacing: -1.5,
                      color: readableOn(color),
                    }}
                  >
                    {monogram(s.name)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts }
  )
}

function Stat({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        border: `1px solid ${accent ? OG.accentDim : OG.border}`,
        backgroundColor: accent ? 'rgba(238,70,40,0.10)' : OG.surface,
        borderRadius: 14,
        padding: '11px 16px',
      }}
    >
      <div style={{ display: 'flex', fontSize: 26, fontWeight: 800, color: accent ? OG.accent : OG.text }}>{value}</div>
      <div style={{ display: 'flex', fontSize: 21, color: OG.secondary }}>{label}</div>
    </div>
  )
}
