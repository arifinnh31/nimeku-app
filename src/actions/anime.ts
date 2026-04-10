'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    titleJapanese: formData.get('titleJapanese') as string,
    synopsis: formData.get('synopsis') as string,
    coverImage: formData.get('coverImage') as string,
    bannerImage: formData.get('bannerImage') as string,
    rating: parseFloat(formData.get('rating') as string) || 0,
    type: formData.get('type') as string,
    status: formData.get('status') as string,
    studio: formData.get('studio') as string,
    season: formData.get('season') as string,
    year: parseInt(formData.get('year') as string) || new Date().getFullYear(),
    genres: (formData.get('genres') as string).split(',').map(g => g.trim()),
    totalEpisodes: parseInt(formData.get('totalEpisodes') as string) || null,
    malId: parseInt(formData.get('malId') as string) || null,
  }

  await prisma.anime.create({ data })
  revalidatePath('/admin/anime')
  revalidatePath('/')
  redirect('/admin/anime')
}

export async function updateAnime(id: string, formData: FormData) {
  const data = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    titleJapanese: formData.get('titleJapanese') as string,
    synopsis: formData.get('synopsis') as string,
    coverImage: formData.get('coverImage') as string,
    bannerImage: formData.get('bannerImage') as string,
    rating: parseFloat(formData.get('rating') as string) || 0,
    type: formData.get('type') as string,
    status: formData.get('status') as string,
    studio: formData.get('studio') as string,
    season: formData.get('season') as string,
    year: parseInt(formData.get('year') as string) || new Date().getFullYear(),
    genres: (formData.get('genres') as string).split(',').map(g => g.trim()),
    totalEpisodes: parseInt(formData.get('totalEpisodes') as string) || null,
    malId: parseInt(formData.get('malId') as string) || null,
  }

  await prisma.anime.update({
    where: { id },
    data,
  })

  revalidatePath('/admin/anime')
  revalidatePath(`/anime/${data.slug}`)
  revalidatePath('/')
  redirect('/admin/anime')
}

export async function deleteAnime(id: string) {
  await prisma.anime.delete({
    where: { id },
  })

  revalidatePath('/admin/anime')
  revalidatePath('/')
}

export async function getAdminStats() {
  const [totalAnime, totalEpisodes] = await Promise.all([
    prisma.anime.count(),
    prisma.episode.count(),
  ])

  return {
    totalAnime,
    totalEpisodes,
    // Placeholder values for now, as we don't have view tracking yet
    viewsToday: 128, 
    weeklyGrowth: 12.5,
  }
}
