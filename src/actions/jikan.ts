'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getJikanAnime(malId: string) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}/full`)
    
    if (!response.ok) {
      throw new Error('Gagal mengambil data dari MyAnimeList')
    }

    const { data } = await response.json()
    const mapped = mapJikanToAnime(data)

    return {
      success: true,
      data: mapped,
    }
  } catch (error: any) {
    console.error('Jikan Fetch Error:', error)
    return { success: false, error: error.message }
  }
}

export async function importTopAnime(page: number = 1) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=25&page=${page}`)
    
    if (!response.ok) {
      throw new Error('Gagal mengambil daftar top anime')
    }

    const { data } = await response.json()
    
    for (const animeData of data) {
      const mapped = mapJikanToAnime(animeData)
      
      await prisma.anime.upsert({
        where: { slug: mapped.slug },
        update: {
          ...mapped,
          updatedAt: new Date(),
        },
        create: mapped,
      })
    }

    revalidatePath('/admin/anime')
    revalidatePath('/')
    
    return { success: true, count: data.length }
  } catch (error: any) {
    console.error('Jikan Bulk Import Error:', error)
    return { success: false, error: error.message }
  }
}

function mapJikanToAnime(data: any) {
  // Map MAL status to our format
  const status = data.status === 'Currently Airing' ? 'Ongoing' : 'Completed'

  // Map Season & Year
  const season = data.season ? `${data.season.charAt(0).toUpperCase() + data.season.slice(1)} ${data.year}` : `${data.year || 'Unknown'}`

  // Map Genres
  const genres = data.genres.map((g: any) => g.name)

  // Map Studio
  const studio = data.studios?.[0]?.name || 'Unknown'

  // Map Rating
  const rating = data.score || 0

  // Map Type
  const type = data.type || 'TV'

  // Slug generation
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  return {
    title: data.title,
    titleJapanese: data.title_japanese || null,
    slug,
    synopsis: data.synopsis || "No synopsis available.",
    coverImage: data.images?.jpg?.large_image_url || data.images?.jpg?.image_url,
    bannerImage: data.trailer?.images?.maximum_image_url || null,
    rating,
    type,
    status,
    studio,
    season,
    year: data.year || new Date().getFullYear(),
    genres,
    totalEpisodes: data.episodes || null,
    malId: data.mal_id,
  }
}

export async function syncEpisodesFromMal(animeId: string, malId: number) {
  try {
    let allEpisodes: any[] = []
    let hasNextPage = true
    let page = 1

    while (hasNextPage) {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}/episodes?page=${page}`)
      
      if (!response.ok) {
        throw new Error('Gagal mengambil daftar episode dari MyAnimeList')
      }

      const { data, pagination } = await response.json()
      allEpisodes = [...allEpisodes, ...data]
      
      hasNextPage = pagination.has_next_page
      page++

      // Respect Jikan rate limit for huge lists (3 requests per second)
      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      // Limit to 500 episodes per sync for stability (approx 10 requests)
      if (page > 10) break
    }

    const upsertPromises = allEpisodes.map((ep: any) => {
      // Map Jikan episode data to our Episode schema
      // Jikan aired date format: "2024-04-07T00:00:00+00:00"
      const releasedAt = ep.aired ? new Date(ep.aired) : new Date()

      return prisma.episode.upsert({
        where: {
          animeId_number: {
            animeId,
            number: ep.mal_id // mal_id for episode is usually the episode number, but let's use MAL's number
          }
        },
        update: {
          title: ep.title || `Episode ${ep.mal_id}`,
          releasedAt,
        },
        create: {
          animeId,
          number: ep.mal_id,
          title: ep.title || `Episode ${ep.mal_id}`,
          releasedAt,
        }
      })
    })

    await Promise.all(upsertPromises)
    
    // Update anime's currentEpisode count based on the max episode number fetched
    const maxEpisode = Math.max(...allEpisodes.map((ep: any) => ep.mal_id), 0)
    if (maxEpisode > 0) {
      await prisma.anime.update({
        where: { id: animeId },
        data: { currentEpisode: maxEpisode }
      })
    }

    revalidatePath(`/admin/anime/${animeId}/edit`)
    revalidatePath(`/admin/anime`)
    revalidatePath(`/anime`)
    
    return { success: true, count: allEpisodes.length }
  } catch (error: any) {
    console.error('Jikan Episode Sync Error:', error)
    return { success: false, error: error.message }
  }
}
