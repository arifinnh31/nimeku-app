'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'


export async function getAnimeList() {
  return await prisma.anime.findMany({
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getAnimeById(id: string) {
  return await prisma.anime.findUnique({
    where: { id },
  })
}

export async function getFeaturedAnime() {
  // Since there is no `isFeatured` flag, we'll arbitrarily take 5 anime with the highest ratings
  return await prisma.anime.findMany({
    orderBy: { rating: 'desc' },
    take: 5,
  })
}

export async function getOngoingAnime() {
  return await prisma.anime.findMany({
    where: { status: 'Ongoing' },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getCompletedAnime() {
  return await prisma.anime.findMany({
    where: { status: 'Completed' },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getLatestUpdatedAnime() {
  return await prisma.anime.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 12, // Arbitrary limit for frontpage use
  })
}

export async function getAnimeBySlug(slug: string) {
  return await prisma.anime.findUnique({
    where: { slug },
    include: {
      episodes: {
        orderBy: { number: 'desc' }
      }
    }
  })
}

export async function getAnimeByDay(day: string) {
  return await prisma.anime.findMany({
    where: { 
      status: 'Ongoing',
      airedDay: day 
    },
    orderBy: { title: 'asc' },
  })
}

export async function createAnime(formData: FormData) {
  try {
    const rawTitle = (formData.get('title') as string || '').trim()
    let rawSlug = (formData.get('slug') as string || '').trim()
    if (!rawSlug && rawTitle) {
      rawSlug = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }
    if (!rawSlug) {
      rawSlug = `anime-${Date.now()}`
    }

    // Auto-resolve duplicate slug if it exists
    let finalSlug = rawSlug
    let counter = 1
    while (await prisma.anime.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${rawSlug}-${counter}`
      counter++
    }

    const rawGenres = (formData.get('genres') as string || '')
    const genres = rawGenres
      ? rawGenres.split(',').map(g => g.trim()).filter(Boolean)
      : []

    const rawRating = parseFloat(formData.get('rating') as string)
    const rating = isNaN(rawRating) ? 0 : rawRating

    const rawYear = parseInt(formData.get('year') as string)
    const year = isNaN(rawYear) ? new Date().getFullYear() : rawYear

    const rawTotalEpisodes = parseInt(formData.get('totalEpisodes') as string)
    const totalEpisodes = isNaN(rawTotalEpisodes) ? null : rawTotalEpisodes

    const rawAnilistId = parseInt(formData.get('anilistId') as string)
    const anilistId = isNaN(rawAnilistId) ? null : rawAnilistId


    const data = {
      title: rawTitle || 'Untitled Anime',
      slug: finalSlug,
      titleJapanese: (formData.get('titleJapanese') as string)?.trim() || null,
      synopsis: (formData.get('synopsis') as string || 'Sinopsis belum tersedia.').trim(),
      coverImage: (formData.get('coverImage') as string || '').trim(),
      bannerImage: (formData.get('bannerImage') as string)?.trim() || null,
      rating,
      type: (formData.get('type') as string || 'TV').trim(),
      status: (formData.get('status') as string || 'Ongoing').trim(),
      studio: (formData.get('studio') as string || 'Unknown').trim(),
      season: (formData.get('season') as string || 'Unknown').trim(),
      year,
      genres,
      totalEpisodes,
      airedDay: (formData.get('airedDay') as string)?.trim() || null,
      airedTime: (formData.get('airedTime') as string)?.trim() || null,
      anilistId,
    }

    const created = await prisma.anime.create({ data })

    revalidatePath('/admin/anime')
    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/schedule')
    revalidatePath('/anime', 'layout')

    return { success: true, anime: created }
  } catch (error: any) {
    console.error('Create Anime Error:', error)
    return { success: false, error: error?.message || 'Gagal menambahkan anime ke database.' }
  }
}

export async function updateAnime(id: string, formData: FormData) {
  try {
    const rawTitle = (formData.get('title') as string || '').trim()
    const rawSlug = (formData.get('slug') as string || '').trim()

    const rawGenres = (formData.get('genres') as string || '')
    const genres = rawGenres
      ? rawGenres.split(',').map(g => g.trim()).filter(Boolean)
      : []

    const rawRating = parseFloat(formData.get('rating') as string)
    const rating = isNaN(rawRating) ? 0 : rawRating

    const rawYear = parseInt(formData.get('year') as string)
    const year = isNaN(rawYear) ? new Date().getFullYear() : rawYear

    const rawTotalEpisodes = parseInt(formData.get('totalEpisodes') as string)
    const totalEpisodes = isNaN(rawTotalEpisodes) ? null : rawTotalEpisodes

    const rawAnilistId = parseInt(formData.get('anilistId') as string)
    const anilistId = isNaN(rawAnilistId) ? null : rawAnilistId

    const data = {
      title: rawTitle || 'Untitled Anime',
      slug: rawSlug,
      titleJapanese: (formData.get('titleJapanese') as string)?.trim() || null,
      synopsis: (formData.get('synopsis') as string || 'Sinopsis belum tersedia.').trim(),
      coverImage: (formData.get('coverImage') as string || '').trim(),
      bannerImage: (formData.get('bannerImage') as string)?.trim() || null,
      rating,
      type: (formData.get('type') as string || 'TV').trim(),
      status: (formData.get('status') as string || 'Ongoing').trim(),
      studio: (formData.get('studio') as string || 'Unknown').trim(),
      season: (formData.get('season') as string || 'Unknown').trim(),
      year,
      genres,
      totalEpisodes,
      airedDay: (formData.get('airedDay') as string)?.trim() || null,
      airedTime: (formData.get('airedTime') as string)?.trim() || null,
      anilistId,
    }


    const updated = await prisma.anime.update({
      where: { id },
      data,
    })

    revalidatePath('/admin/anime')
    revalidatePath(`/anime/${data.slug}`)
    revalidatePath('/')
    revalidatePath('/catalog')
    revalidatePath('/schedule')
    revalidatePath('/anime', 'layout')

    return { success: true, anime: updated }
  } catch (error: any) {
    console.error('Update Anime Error:', error)
    return { success: false, error: error?.message || 'Gagal menyimpan perubahan anime.' }
  }
}



export async function deleteAnime(id: string) {
  await prisma.anime.delete({
    where: { id },
  })

  revalidatePath('/admin/anime')
  revalidatePath('/')
}

export async function recordPageView(path: string, animeId?: string) {
  try {
    await prisma.pageView.create({
      data: {
        path,
        animeId: animeId || undefined,
      },
    });

    if (animeId) {
      await prisma.anime.update({
        where: { id: animeId },
        data: { views: { increment: 1 } },
      });
    }
  } catch (err) {
    console.error("Failed to track view:", err);
  }
}

export async function getAdminStats(period: 'today' | '7d' | '30d' | 'year' | 'all' = 'all') {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let dateFilter: Date | undefined;
  let prevDateFilter: Date | undefined;
  let prevDateEnd: Date | undefined;

  if (period === 'today') {
    dateFilter = startOfToday;
    prevDateFilter = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    prevDateEnd = startOfToday;
  } else if (period === '7d') {
    dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    prevDateFilter = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    prevDateEnd = dateFilter;
  } else if (period === '30d') {
    dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    prevDateFilter = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    prevDateEnd = dateFilter;
  } else if (period === 'year') {
    dateFilter = new Date(now.getFullYear(), 0, 1);
    prevDateFilter = new Date(now.getFullYear() - 1, 0, 1);
    prevDateEnd = dateFilter;
  }

  const [
    totalAnime,
    totalEpisodes,
    viewsCount,
    prevViewsCount,
    todayViewsCount,
  ] = await Promise.all([
    prisma.anime.count(),
    prisma.episode.count(),
    dateFilter
      ? prisma.pageView.count({ where: { createdAt: { gte: dateFilter } } })
      : prisma.pageView.count(),
    prevDateFilter && prevDateEnd
      ? prisma.pageView.count({ where: { createdAt: { gte: prevDateFilter, lt: prevDateEnd } } })
      : 0,
    prisma.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
  ]);

  // Calculate real growth rate percentage
  let growthPercentage = 0;
  if (prevViewsCount > 0) {
    growthPercentage = Math.round(((viewsCount - prevViewsCount) / prevViewsCount) * 100 * 10) / 10;
  } else if (viewsCount > 0) {
    growthPercentage = 100;
  }

  return {
    totalAnime,
    totalEpisodes,
    viewsCount,
    todayViewsCount,
    growthPercentage,
  };
}



export async function searchAnime(query: string) {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim();

  return await prisma.anime.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { titleJapanese: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q.toLowerCase(), mode: 'insensitive' } },
      ]
    },
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      rating: true,
      type: true,
      status: true,
      currentEpisode: true,
    }
  });
}


