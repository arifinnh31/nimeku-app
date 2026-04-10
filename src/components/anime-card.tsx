import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star, Play } from "lucide-react";
import type { Anime } from "@prisma/client";

interface AnimeCardProps {
  anime: Anime;
  showEpisode?: boolean;
}

export function AnimeCard({ anime, showEpisode = true }: AnimeCardProps) {
  return (
    <Link
      href={`/anime/${anime.slug}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={anime.coverImage}
          alt={anime.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Status badge */}
        <Badge
          className={`absolute top-2 left-2 text-[10px] font-semibold border-0 ${
            anime.status === "Ongoing"
              ? "bg-emerald-500/90 text-white"
              : "bg-blue-500/90 text-white"
          }`}
        >
          {anime.status}
        </Badge>

        {/* Type badge */}
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 text-[10px] bg-black/60 text-white border-0"
        >
          {anime.type}
        </Badge>

        {/* Rating */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-white">
            {anime.rating.toFixed(1)}
          </span>
        </div>

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
        {showEpisode && (
          <p className="text-xs text-muted-foreground mt-1">
            Episode {anime.currentEpisode}
            {anime.totalEpisodes ? ` / ${anime.totalEpisodes}` : ""}
          </p>
        )}
      </div>
    </Link>
  );
}
