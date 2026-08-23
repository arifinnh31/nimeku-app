import { AnimeCard } from "@/components/anime-card";
import type { Anime } from "@prisma/client";

interface AnimeGridProps {
  items: Anime[];
  showEpisode?: boolean;
}

export function AnimeGrid({ items, showEpisode }: AnimeGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} showEpisode={showEpisode} />
      ))}
    </div>
  );
}
