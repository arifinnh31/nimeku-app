"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getAnimeByDay } from "@/actions/anime";
import { Anime } from "@prisma/client";
import { Clock, Star, Play } from "lucide-react";

const SCHEDULE_DAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
] as const;

export default function SchedulePage() {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  
  const [activeDay, setActiveDay] = useState("");
  const [animeForDay, setAnimeForDay] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    
    // Set default day only once when activeDay is not set
    let currentDay = activeDay;
    if (!currentDay) {
      const today = new Date().toLocaleDateString("id-ID", { weekday: "long" });
      currentDay = SCHEDULE_DAYS.find((d) => d === today) || "Senin";
      setTimeout(() => setActiveDay(currentDay), 0);
    }
    
    let isStale = false;
    
    getAnimeByDay(currentDay).then((data) => {
      if (!isStale) {
        setAnimeForDay(data);
        setIsLoading(false);
      }
    });

    return () => { isStale = true; };
  }, [mounted, activeDay]);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="py-20 text-center text-muted-foreground">Loading jadwal...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold">
          Jadwal Rilis Anime
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Jadwal tayang anime ongoing per hari
        </p>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SCHEDULE_DAYS.map((day) => (
          <button
            key={day}
            onClick={() => {
              setIsLoading(true);
              setActiveDay(day);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeDay === day
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Anime list for selected day */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Loading jadwal...</div>
        ) : animeForDay.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Tidak ada anime yang tayang pada hari {activeDay}</p>
          </div>
        ) : (
          animeForDay.map((anime) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.slug}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/80 hover:border-primary/30 hover:bg-accent/50 transition-all group"
            >
              {/* Cover */}
              <div className="relative w-16 h-22 md:w-20 md:h-28 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={anime.coverImage}
                  alt={anime.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors line-clamp-1">
                  {anime.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {anime.genres.slice(0, 3).map((g: string) => (
                    <Badge
                      key={g}
                      variant="outline"
                      className="text-[10px] py-0"
                    >
                      {g}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {anime.rating.toFixed(1)}
                  </span>
                  <span>Episode {anime.currentEpisode}</span>
                </div>
              </div>

              {/* Time */}
              <div className="text-right shrink-0">
                <Badge
                  variant="outline"
                  className="gap-1 bg-primary/5 border-primary/20 text-primary"
                >
                  <Clock className="w-3 h-3" />
                  {anime.airedTime} WIB
                </Badge>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
