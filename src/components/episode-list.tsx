"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Calendar, Search } from "lucide-react";
import type { Episode } from "@prisma/client";

interface EpisodeListProps {
  episodes: Episode[];
  animeSlug: string;
  currentEpisode?: number;
}

const CHUNK_SIZE = 30;

export function EpisodeList({
  episodes,
  animeSlug,
  currentEpisode,
}: EpisodeListProps) {
  const [search, setSearch] = useState("");

  const sortedEpisodes = useMemo(() => {
    return [...episodes].sort((a, b) => b.number - a.number);
  }, [episodes]);

  const chunks = useMemo(() => {
    if (sortedEpisodes.length <= CHUNK_SIZE) return [];
    const result: { label: string; start: number; end: number }[] = [];
    // Split into chunks based on episode count
    for (let i = 0; i < sortedEpisodes.length; i += CHUNK_SIZE) {
      const slice = sortedEpisodes.slice(i, i + CHUNK_SIZE);
      const minEp = Math.min(...slice.map((e) => e.number));
      const maxEp = Math.max(...slice.map((e) => e.number));
      result.push({ label: `Ep ${minEp} - ${maxEp}`, start: minEp, end: maxEp });
    }
    return result;
  }, [sortedEpisodes]);

  const [activeChunk, setActiveChunk] = useState(0);

  const displayedEpisodes = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return sortedEpisodes.filter(
        (ep) =>
          ep.number.toString().includes(q) ||
          ep.title.toLowerCase().includes(q)
      );
    }
    if (chunks.length > 0) {
      const chunk = chunks[activeChunk] || chunks[0];
      return sortedEpisodes.filter(
        (ep) => ep.number >= chunk.start && ep.number <= chunk.end
      );
    }
    return sortedEpisodes;
  }, [sortedEpisodes, search, chunks, activeChunk]);

  if (episodes.length === 0) {
    return (
      <div className="p-8 text-center rounded-xl border border-border/40 bg-card/40 text-muted-foreground text-sm">
        Belum ada episode yang diunggah untuk anime ini.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls: Search & Chunks */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Total {episodes.length} Episode
        </div>
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Cari no. episode / judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs bg-secondary/50"
          />
        </div>
      </div>

      {/* Range tabs if many episodes */}
      {chunks.length > 0 && !search && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {chunks.map((chunk, idx) => (
            <Button
              key={chunk.label}
              variant={activeChunk === idx ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveChunk(idx)}
              className="text-xs h-7 px-3 whitespace-nowrap"
            >
              {chunk.label}
            </Button>
          ))}
        </div>
      )}

      {/* Episode list */}
      <div className="space-y-2">
        {displayedEpisodes.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            Tidak ada episode yang sesuai dengan &ldquo;{search}&rdquo;
          </p>
        ) : (
          displayedEpisodes.map((ep) => {
            const isCurrent = ep.number === currentEpisode;
            return (
              <Link
                key={ep.id}
                href={`/anime/${animeSlug}/watch/${ep.number}`}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group ${
                  isCurrent
                    ? "bg-primary/10 border-primary/50"
                    : "bg-card border-border/50 hover:border-primary/30 hover:bg-accent/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold shrink-0 ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                    }`}
                  >
                    {ep.number}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {ep.title}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(ep.releasedAt).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {isCurrent && (
                    <Badge className="bg-primary/20 text-primary border-0 text-[10px]">
                      Sedang Ditonton
                    </Badge>
                  )}
                  <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

