import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Skill Me · The App Store for Claude Skills',
    short_name: 'Skill Me',
    description:
      'Browse and install curated Claude skills. Connect once, install anything.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080a0a',
    theme_color: '#080a0a',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'any' },
    ],
  }
}
