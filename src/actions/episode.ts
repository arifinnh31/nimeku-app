'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'


export async function getEpisodeById(id: string) {
  return await prisma.episode.findUnique({
    where: { id },
    include: {
      anime: true,
      servers: true,
      downloadLinks: true,
    }
  })
}

export async function getAllEpisodes() {
  return await prisma.episode.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      anime: true,
      _count: {
        select: {
          servers: true,
          downloadLinks: true,
        }
      }
    }
  })
}

export async function getEpisodesByAnimeSlug(slug: string) {
  const anime = await prisma.anime.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (!anime) return []

  return await prisma.episode.findMany({
    where: { animeId: anime.id },
    orderBy: { number: 'desc' },
    include: {
      servers: true,
      downloadLinks: true,
    }
  })
}

export async function createEpisode(formData: FormData) {
  const animeId = formData.get('animeId') as string
  const number = parseInt(formData.get('number') as string)
  const title = formData.get('title') as string
  const releasedAt = new Date(formData.get('releasedAt') as string)

  // Servers and Download Links are passed as JSON strings from the client for simplicity here
  const servers = JSON.parse(formData.get('servers') as string || '[]')
  const downloadLinks = JSON.parse(formData.get('downloadLinks') as string || '[]')

  await prisma.episode.create({
    data: {
      animeId,
      number,
      title,
      releasedAt,
      servers: {
        create: servers.map((s: any) => ({
          name: s.name,
          type: s.type,
          url: s.url,
        }))
      },
      downloadLinks: {
        create: downloadLinks.map((d: any) => ({
          resolution: d.resolution,
          provider: d.provider,
          url: d.url,
        }))
      }
    }
  })

  revalidatePath('/admin/episodes')
  revalidatePath('/')
  revalidatePath('/anime', 'layout')
}

export async function updateEpisode(id: string, formData: FormData) {
  const number = parseInt(formData.get('number') as string)
  const title = formData.get('title') as string
  const releasedAt = new Date(formData.get('releasedAt') as string)

  const servers = JSON.parse(formData.get('servers') as string || '[]')
  const downloadLinks = JSON.parse(formData.get('downloadLinks') as string || '[]')

  // Sequential execution to prevent Supabase connection pool transaction timeout
  await prisma.streamServer.deleteMany({ where: { episodeId: id } })
  await prisma.downloadLink.deleteMany({ where: { episodeId: id } })

  // Update episode and create new relations
  await prisma.episode.update({
    where: { id },
    data: {
      number,
      title,
      releasedAt,
      servers: {
        create: servers.map((s: any) => ({
          name: s.name,
          type: s.type,
          url: s.url,
        }))
      },
      downloadLinks: {
        create: downloadLinks.map((d: any) => ({
          resolution: d.resolution,
          provider: d.provider,
          url: d.url,
        }))
      }
    }
  })

  revalidatePath('/admin/episodes')
  revalidatePath('/')
  revalidatePath('/anime', 'layout')
}


export async function deleteEpisode(id: string) {
  await prisma.episode.delete({
    where: { id },
  })

  revalidatePath('/admin/episodes')
  revalidatePath('/')
}
