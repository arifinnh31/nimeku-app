import { MetadataRoute } from 'next'
import { getAnimeList } from '@/actions/anime'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nimeku.vercel.app'
  
  try {
    const animeList = await getAnimeList()

    const animeEntries: MetadataRoute.Sitemap = animeList.map((anime) => ({
      url: `${baseUrl}/anime/${anime.slug}`,
      lastModified: anime.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/catalog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/schedule`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...animeEntries,
    ]
  } catch (error) {
    // Fallback if database is not accessible during build
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ]
  }
}
