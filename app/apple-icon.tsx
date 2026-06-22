import { ImageResponse } from 'next/og'

// 180×180 apple-touch icon — the favicon mark rendered on an ink tile with
// rounded corners. Generated (not a committed PNG) so it always tracks the
// brand tokens. No font needed: pure geometry.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  const bar = (width: number, color: string) => ({
    width,
    height: 20,
    borderRadius: 10,
    backgroundColor: color,
  })
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#1C1A17',
          borderRadius: 40,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 48,
          gap: 10,
        }}
      >
        <div style={bar(66, '#FAF6F0')} />
        <div style={bar(84, '#EE4628')} />
        <div style={bar(51, '#FAF6F0')} />
      </div>
    ),
    { ...size }
  )
}
