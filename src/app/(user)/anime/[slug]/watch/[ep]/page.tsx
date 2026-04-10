import { notFound } from "next/navigation";
import { WatchClient } from "@/components/watch-client";
import { getAnimeBySlug } from "@/actions/anime";
import { getEpisodesByAnimeSlug } from "@/actions/episode";

export async function generateStaticParams() {
  return [];
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string; ep: string }>;
}) {
  const { slug, ep } = await params;
  const epNum = parseInt(ep, 10);
  const anime = await getAnimeBySlug(slug);

  if (!anime) return notFound();

  const episodes = await getEpisodesByAnimeSlug(slug);
  const currentEpisode = episodes.find((e: any) => e.number === epNum);

  // If episode doesn't exist, we can redirect or show not found
  if (!currentEpisode) return notFound();

  return (
    <WatchClient 
      anime={anime} 
      activeEpisode={currentEpisode} 
      allEpisodes={episodes}
    />
  );
}
