import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar } from "lucide-react";
import type { Episode } from "@prisma/client";

interface EpisodeListProps {
  episodes: Episode[];
  animeSlug: string;
  currentEpisode?: number;
}

export function EpisodeList({
  episodes,
  animeSlug,
  currentEpisode,
}: EpisodeListProps) {
  return (
    <div className="space-y-2">
      {episodes.map((ep) => {
        const isCurrent = ep.number === currentEpisode;
        return (
          <Link
            key={ep.id}
            href={`/anime/${animeSlug}/watch/${ep.number}`}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 group ${
              isCurrent
                ? "bg-primary/10 border-primary/50"
                : "bg-card border-border/50 hover:border-primary/30 hover:bg-accent/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                }`}
              >
                {ep.number}
              </div>
              <div>
                <p className="text-sm font-medium">{ep.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(ep.releasedAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isCurrent && (
                <Badge className="bg-primary/20 text-primary border-0 text-[10px]">
                  Sedang Ditonton
                </Badge>
              )}
              <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
