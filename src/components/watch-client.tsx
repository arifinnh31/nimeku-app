"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ServerSelector } from "@/components/server-selector";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Lightbulb,
  Download,
  ExternalLink,
  ArrowLeft,
  Bookmark,
  Share2,
  Check,
  Search,
} from "lucide-react";
import type { Anime, StreamServer, Episode, DownloadLink } from "@prisma/client";
import {
  saveWatchHistory,
  isBookmarked,
  toggleBookmark,
  STORAGE_EVENT,
} from "@/lib/storage";
import { recordPageView } from "@/actions/anime";
import { toast } from "sonner";

interface WatchClientProps {
  anime: Anime;
  activeEpisode: Episode & { servers: StreamServer[]; downloadLinks: DownloadLink[] };
  allEpisodes: (Episode & { servers: StreamServer[]; downloadLinks: DownloadLink[] })[];
}

const EPISODES_PER_CHUNK = 50;

export function WatchClient({ anime, activeEpisode, allEpisodes }: WatchClientProps) {
  const [lightsOff, setLightsOff] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeServer, setActiveServer] = useState<StreamServer | null>(
    activeEpisode.servers[0] || null
  );
  const [episodeSearch, setEpisodeSearch] = useState("");

  const epNum = activeEpisode.number;
  const maxEp = anime.currentEpisode;
  const hasPrev = epNum > 1;
  const hasNext = epNum < maxEp;

  // Record watch history automatically on mount / episode change
  useEffect(() => {
    saveWatchHistory({
      animeSlug: anime.slug,
      animeTitle: anime.title,
      coverImage: anime.coverImage,
      episodeNumber: epNum,
      episodeTitle: activeEpisode.title,
    });
    recordPageView(`/anime/${anime.slug}/watch/${epNum}`, anime.id);
  }, [anime, epNum, activeEpisode]);


  // Sync bookmark state
  useEffect(() => {
    setBookmarked(isBookmarked(anime.slug));
    const handleStorage = () => setBookmarked(isBookmarked(anime.slug));
    window.addEventListener(STORAGE_EVENT, handleStorage);
    return () => window.removeEventListener(STORAGE_EVENT, handleStorage);
  }, [anime.slug]);

  const handleBookmarkToggle = () => {
    const nextState = toggleBookmark({
      animeSlug: anime.slug,
      animeTitle: anime.title,
      coverImage: anime.coverImage,
      rating: anime.rating,
      type: anime.type,
      status: anime.status,
      totalEpisodes: anime.totalEpisodes,
      currentEpisode: anime.currentEpisode,
    });
    setBookmarked(nextState);
    if (nextState) {
      toast.success(`"${anime.title}" ditambahkan ke favorit.`);
    } else {
      toast.info(`"${anime.title}" dihapus dari favorit.`);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${anime.title} - Episode ${epNum}`,
          text: `Nonton ${anime.title} Episode ${epNum} Subtitle Indonesia di NimeKu`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link episode berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };


  const allNumbers = useMemo(() => {
    return allEpisodes.map((e) => e.number).sort((a, b) => a - b);
  }, [allEpisodes]);

  // Group into chunks if there are more than 50 episodes
  const chunks = useMemo(() => {
    if (allNumbers.length <= EPISODES_PER_CHUNK) return [];
    const result: { label: string; start: number; end: number }[] = [];
    for (let i = 0; i < allNumbers.length; i += EPISODES_PER_CHUNK) {
      const start = allNumbers[i];
      const end = allNumbers[Math.min(i + EPISODES_PER_CHUNK - 1, allNumbers.length - 1)];
      result.push({ label: `${start} - ${end}`, start, end });
    }
    return result;
  }, [allNumbers]);

  const [activeChunkIndex, setActiveChunkIndex] = useState(() => {
    if (allNumbers.length <= EPISODES_PER_CHUNK) return 0;
    const index = Math.floor((epNum - 1) / EPISODES_PER_CHUNK);
    return index >= 0 ? index : 0;
  });

  const displayedNumbers = useMemo(() => {
    if (episodeSearch.trim()) {
      return allNumbers.filter((n) => n.toString().includes(episodeSearch.trim()));
    }
    if (chunks.length > 0) {
      const chunk = chunks[activeChunkIndex] || chunks[0];
      return allNumbers.filter((n) => n >= chunk.start && n <= chunk.end);
    }
    return allNumbers;
  }, [allNumbers, chunks, activeChunkIndex, episodeSearch]);

  return (
    <>
      {lightsOff && (
        <div
          className="fixed inset-0 bg-black/90 z-40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setLightsOff(false)}
        />
      )}

      <div
        className={`container mx-auto px-4 py-6 space-y-5 ${
          lightsOff ? "relative z-50" : ""
        }`}
      >
        {/* Breadcrumb & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Link
              href={`/anime/${anime.slug}`}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              {anime.title}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary font-semibold">Episode {epNum}</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant={bookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmarkToggle}
              className="gap-1.5 h-8 text-xs"
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-current" : ""}`} />
              {bookmarked ? "Tersimpan" : "Simpan"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 h-8 text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl shadow-primary/5 border border-border/40">
          {activeServer ? (
            activeServer.type === "embed" ? (
              <iframe
                src={activeServer.url}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <video
                  src={activeServer.url}
                  controls
                  className="w-full h-full"
                  poster={anime.bannerImage || anime.coverImage}
                />
              </div>
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-white/80">Server video tidak tersedia</p>
                <p className="text-xs text-white/50">Silakan pilih server lain atau gunakan link download di bawah.</p>
              </div>
            </div>
          )}
        </div>

        {/* Server selector + Lights */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <ServerSelector
            servers={activeEpisode.servers}
            activeId={activeServer?.id}
            onSelect={setActiveServer}
          />
          <Button
            variant={lightsOff ? "default" : "outline"}
            size="sm"
            onClick={() => setLightsOff(!lightsOff)}
            className="gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            {lightsOff ? "Nyalakan Lampu" : "Matikan Lampu"}
          </Button>
        </div>

        {/* Episode navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrev}
            asChild={hasPrev}
            className="gap-1"
          >
            {hasPrev ? (
              <Link href={`/anime/${anime.slug}/watch/${epNum - 1}`}>
                <ChevronLeft className="w-4 h-4" />
                Episode {epNum - 1}
              </Link>
            ) : (
              <span>
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </span>
            )}
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link href={`/anime/${anime.slug}`}>
              <List className="w-4 h-4" />
              Daftar Episode
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNext}
            asChild={hasNext}
            className="gap-1"
          >
            {hasNext ? (
              <Link href={`/anime/${anime.slug}/watch/${epNum + 1}`}>
                Episode {epNum + 1}
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span>
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>

        <Separator />

        {/* Download links */}
        <div>
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            Download Episode {epNum}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {activeEpisode.downloadLinks.length > 0 ? (
              activeEpisode.downloadLinks.map((dl) => (
                <div
                  key={dl.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card/80 hover:border-primary/40 transition-colors"
                >
                  <Badge variant="secondary" className="font-mono text-xs">
                    {dl.resolution}
                  </Badge>
                  <a
                    href={dl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                  >
                    <span>{dl.provider}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic col-span-full">
                Link download belum tersedia untuk episode ini.
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Episode quick select with search & range tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-semibold text-sm">Pilih Episode</h3>
            
            {/* Quick search input */}
            <div className="relative w-full sm:w-44">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Cari no. episode..."
                className="pl-8 h-8 text-xs bg-secondary/50"
                value={episodeSearch}
                onChange={(e) => setEpisodeSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Range tabs for anime with 50+ episodes */}
          {chunks.length > 0 && !episodeSearch && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {chunks.map((chunk, idx) => (
                <Button
                  key={chunk.label}
                  variant={activeChunkIndex === idx ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveChunkIndex(idx)}
                  className="text-xs h-7 px-2.5 whitespace-nowrap"
                >
                  {chunk.label}
                </Button>
              ))}
            </div>
          )}

          {/* Episode number buttons grid */}
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5">
            {displayedNumbers.map((num) => (
              <Button
                key={num}
                variant={num === epNum ? "default" : "outline"}
                size="sm"
                asChild
                className={`h-9 text-xs font-semibold ${
                  num === epNum ? "shadow-md shadow-primary/20" : ""
                }`}
              >
                <Link href={`/anime/${anime.slug}/watch/${num}`}>{num}</Link>
              </Button>
            ))}
          </div>

          {displayedNumbers.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Episode tidak ditemukan untuk kata kunci &ldquo;{episodeSearch}&rdquo;
            </p>
          )}
        </div>
      </div>
    </>
  );
}

