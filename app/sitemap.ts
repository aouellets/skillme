import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/data'
import { CATEGORIES } from '@/lib/categories'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/browse`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/connect`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/browse?category=${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  let skillRoutes: MetadataRoute.Sitemap = []
  try {
    const slugs = await getAllSlugs()
    skillRoutes = slugs.map((slug) => ({
      url: `${SITE_URL}/skill/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch {
    // If the catalog can't be read, still return the static routes.
  }

  return [...staticRoutes, ...categoryRoutes, ...skillRoutes]
}
