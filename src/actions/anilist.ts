'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'


function safeRevalidate(path: string, type?: 'layout' | 'page') {
  try {
    revalidatePath(path, type)
  } catch {
    // Ignore outside request context
  }
}


export interface MappedAnimeData {
  title: string
  titleJapanese: string | null
  slug: string
  synopsis: string
  coverImage: string
  bannerImage: string | null
  rating: number
  type: string
  status: string
  studio: string
  season: string
  year: number
  genres: string[]
  totalEpisodes: number | null
  anilistId: number | null
  airedDay?: string
  airedTime?: string
}

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co'
const USER_AGENT = 'NimekuApp/1.0 (https://nimeku.app)'

/**
 * Terjemahkan sinopsis bahasa Inggris ke Bahasa Indonesia secara otomatis
 */
async function translateToIndonesian(text: string): Promise<string> {
  if (!text || text.trim().length === 0) return 'Sinopsis belum tersedia.'
  const clean = text
    .replace(/<[^>]*>/g, '')
    .replace(/\r?\n/g, ' ')
    .trim()

  try {
    const querySample = clean.length > 500 ? clean.slice(0, 500) : clean
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(querySample)}&langpair=en|id`)
    if (res.ok) {
      const json = await res.json()
      if (json.responseData?.translatedText && !json.responseData.translatedText.includes('QUERY LENGTH LIMIT')) {
        return json.responseData.translatedText
      }
    }
  } catch (err) {
    console.warn('Terjemahan warning, menggunakan teks asli:', err)
  }
  return clean
}

const SEASON_MAP: Record<string, string> = {
  WINTER: 'Winter',
  SPRING: 'Spring',
  SUMMER: 'Summer',
  FALL: 'Fall',
}

function mapAniListMedia(media: any, cleanSynopsis: string): MappedAnimeData {
  const title = media.title?.english || media.title?.romaji || media.title?.native || 'Unknown Anime'
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

  const seasonStr = media.season ? (SEASON_MAP[media.season] || 'Unknown') : 'Unknown'
  const status = media.status === 'RELEASING' ? 'Ongoing' : 'Completed'
  const type = media.format === 'MOVIE' ? 'Movie' : media.format === 'OVA' ? 'OVA' : media.format === 'ONA' ? 'ONA' : 'TV'
  const rating = media.averageScore ? parseFloat((media.averageScore / 10).toFixed(1)) : 0

  return {
    title,
    titleJapanese: media.title?.native || null,
    slug,
    synopsis: cleanSynopsis,
    coverImage: media.coverImage?.extraLarge || media.coverImage?.large || '',
    bannerImage: media.bannerImage || null,
    rating,
    type,
    status,
    studio: media.studios?.nodes?.[0]?.name || 'Unknown',
    season: seasonStr,
    year: media.startDate?.year || new Date().getFullYear(),
    genres: media.genres || [],
    totalEpisodes: media.episodes || null,
    anilistId: media.id || media.idMal || null,
    airedDay: '',
    airedTime: '23:00',
  }
}

/**
 * Native AniList GraphQL Single Media Query
 * Mendukung ID AniList, URL AniList, ataupun Judul Anime
 */
export async function getAniListAnime(input: string) {
  try {
    const cleanInput = input.trim()
    if (!cleanInput) {
      return { success: false, error: 'Masukkan ID, URL, atau Judul anime.' }
    }

    // 1. Ekstraksi ID jika input berupa link URL atau angka
    let extractedId: number | null = null
    const anilistUrlMatch = cleanInput.match(/anilist\.co\/anime\/(\d+)/i)
    const malUrlMatch = cleanInput.match(/myanimelist\.net\/anime\/(\d+)/i)

    if (anilistUrlMatch) {
      extractedId = parseInt(anilistUrlMatch[1], 10)
    } else if (malUrlMatch) {
      extractedId = parseInt(malUrlMatch[1], 10)
    } else if (/^\d+$/.test(cleanInput)) {
      extractedId = parseInt(cleanInput, 10)
    }

    const query = `
      query ($id: Int, $idMal: Int, $search: String) {
        Media (id: $id, idMal: $idMal, search: $search, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
            native
          }
          description
          coverImage {
            extraLarge
            large
          }
          bannerImage
          averageScore
          format
          status
          studios(isMain: true) {
            nodes {
              name
            }
          }
          season
          startDate {
            year
          }
          genres
          episodes
        }
      }
    `

    let variables: any = {}
    if (extractedId) {
      if (malUrlMatch) {
        variables = { idMal: extractedId }
      } else {
        variables = { id: extractedId }
      }
    } else {
      variables = { search: cleanInput }
    }

    let res = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify({ query, variables }),
    })

    if (extractedId && !malUrlMatch) {
      const json = await res.json()
      if (!json.data?.Media) {
        res = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': USER_AGENT,
          },
          body: JSON.stringify({ query, variables: { idMal: extractedId } }),
        })
      } else {
        const cleanSynopsis = await translateToIndonesian(json.data.Media.description || '')
        const mapped = mapAniListMedia(json.data.Media, cleanSynopsis)
        return { success: true, data: mapped }
      }
    }

    if (!res.ok) {
      return { success: false, error: 'Gagal mengambil data dari AniList API.' }
    }

    const json = await res.json()
    const media = json.data?.Media
    if (!media) {
      return { success: false, error: 'Anime tidak ditemukan di database AniList.' }
    }

    const cleanSynopsis = await translateToIndonesian(media.description || '')
    const mapped = mapAniListMedia(media, cleanSynopsis)

    return { success: true, data: mapped }
  } catch (error: any) {
    console.error('AniList Fetch Error:', error)
    return { success: false, error: error.message || 'Terjadi kesalahan saat memuat data anime.' }
  }
}

/**
 * Native AniList GraphQL Top 100 Popular Anime Query
 */
export async function importTopAnime(limit: number = 100) {
  try {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
          media (sort: POPULARITY_DESC, type: ANIME) {
            id
            idMal
            title {
              romaji
              english
              native
            }
            description
            coverImage {
              extraLarge
              large
            }
            bannerImage
            averageScore
            format
            status
            studios(isMain: true) {
              nodes {
                name
              }
            }
            season
            startDate {
              year
            }
            genres
            episodes
          }
        }
      }
    `

    // AniList perPage max is 50, fetch page 1 and page 2 to get top 100
    const pagesToFetch = limit <= 50 ? [1] : [1, 2]
    const fetchPromises = pagesToFetch.map(page =>
      fetch(ANILIST_GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': USER_AGENT,
        },
        body: JSON.stringify({ query, variables: { page, perPage: 50 } }),
      }).then(r => r.json())
    )

    const responses = await Promise.all(fetchPromises)
    const allMedia: any[] = []
    for (const res of responses) {
      const list = res?.data?.Page?.media
      if (Array.isArray(list)) {
        allMedia.push(...list)
      }
    }

    if (allMedia.length === 0) {
      throw new Error('Daftar anime kosong dari AniList.')
    }

    const uniqueMedia = Array.from(new Map(allMedia.map(m => [m.id, m])).values()).slice(0, limit)
    const usedSlugs = new Set<string>()

    for (const media of uniqueMedia) {
      const cleanSynopsis = await translateToIndonesian(media.description || '')
      const mapped = mapAniListMedia(media, cleanSynopsis)

      // Ensure slug uniqueness in the batch and in the database
      let finalSlug = mapped.slug
      let counter = 2

      while (usedSlugs.has(finalSlug)) {
        finalSlug = `${mapped.slug}-${counter}`
        counter++
      }

      // Check if existing anime with this slug belongs to a different anilistId
      const existingInDb = await prisma.anime.findUnique({
        where: { slug: finalSlug },
        select: { id: true, anilistId: true },
      })

      if (existingInDb && existingInDb.anilistId !== mapped.anilistId) {
        while (true) {
          finalSlug = `${mapped.slug}-${counter}`
          counter++
          if (usedSlugs.has(finalSlug)) continue
          const checkAgain = await prisma.anime.findUnique({
            where: { slug: finalSlug },
            select: { id: true },
          })
          if (!checkAgain) break
        }
      }

      usedSlugs.add(finalSlug)
      mapped.slug = finalSlug

      await prisma.anime.upsert({
        where: { slug: mapped.slug },
        update: {
          ...mapped,
          updatedAt: new Date(),
        },
        create: mapped,
      })
    }


    safeRevalidate('/admin/anime')
    safeRevalidate('/')
    safeRevalidate('/catalog')
    safeRevalidate('/schedule')


    return { success: true, count: uniqueMedia.length }
  } catch (error: any) {
    console.error('AniList Top Anime Import Error:', error)
    return { success: false, error: error.message || 'Gagal mengimpor top anime.' }
  }
}


/**
 * Native AniList Episode Synchronizer
 */
export async function syncEpisodesFromAniList(animeId: string, anilistId: number) {
  try {
    const anime = await prisma.anime.findUnique({
      where: { id: animeId },
      include: { episodes: true },
    })

    if (!anime) {
      return { success: false, error: 'Data anime tidak ditemukan di database.' }
    }

    let streamingEpisodes: { title: string }[] = []
    let totalEps = anime.totalEpisodes || anime.currentEpisode || (anime.type === 'Movie' ? 1 : 12)

    if (anilistId > 0) {
      try {
        const query = `
          query ($id: Int, $idMal: Int) {
            Media (id: $id, idMal: $idMal, type: ANIME) {
              episodes
              streamingEpisodes {
                title
              }
            }
          }
        `
        const res = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': USER_AGENT,
          },
          body: JSON.stringify({ query, variables: { id: anilistId, idMal: anilistId } }),
        })

        if (res.ok) {
          const json = await res.json()
          const media = json.data?.Media
          if (media) {
            if (media.episodes) totalEps = media.episodes
            if (Array.isArray(media.streamingEpisodes) && media.streamingEpisodes.length > 0) {
              streamingEpisodes = media.streamingEpisodes
            }
          }
        }
      } catch (err) {
        console.warn('AniList episode detail fetch warning:', err)
      }
    }

    const countToGenerate = Math.max(streamingEpisodes.length, totalEps, 1)
    const episodesToUpsert: { number: number; title: string; releasedAt: Date }[] = []

    for (let i = 1; i <= countToGenerate; i++) {
      let epTitle = `Episode ${i}`
      if (anime.type === 'Movie') {
        epTitle = `${anime.title} (Movie)`
      } else if (streamingEpisodes[i - 1]?.title) {
        epTitle = streamingEpisodes[i - 1].title
      }

      episodesToUpsert.push({
        number: i,
        title: epTitle,
        releasedAt: new Date(),
      })
    }

    // Upsert sekuensial
    for (const ep of episodesToUpsert) {
      await prisma.episode.upsert({
        where: {
          animeId_number: {
            animeId,
            number: ep.number,
          },
        },
        update: {
          title: ep.title,
          releasedAt: ep.releasedAt,
        },
        create: {
          animeId,
          number: ep.number,
          title: ep.title,
          releasedAt: ep.releasedAt,
        },
      })
    }

    const maxEpisode = Math.max(...episodesToUpsert.map(e => e.number), anime.currentEpisode || 0)
    await prisma.anime.update({
      where: { id: animeId },
      data: { currentEpisode: maxEpisode },
    })

    safeRevalidate(`/admin/anime/${animeId}/edit`)
    safeRevalidate(`/admin/anime`)
    safeRevalidate(`/anime/${anime.slug}`)
    safeRevalidate(`/anime`)
    safeRevalidate(`/`)


    return { success: true, count: episodesToUpsert.length }
  } catch (error: any) {
    console.error('AniList Episode Sync Error:', error)
    return { success: false, error: error.message || 'Gagal menyinkronkan episode.' }
  }
}
