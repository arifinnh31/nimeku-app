"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import type { Anime, StreamServer, Episode, DownloadLink } from "@prisma/client";

interface WatchClientProps {
  anime: Anime;
  activeEpisode: Episode & { servers: StreamServer[]; downloadLinks: DownloadLink[] };
  allEpisodes: (Episode & { servers: StreamServer[]; downloadLinks: DownloadLink[] })[];
}

// Remove mockServers constant

export function WatchClient({ anime, activeEpisode, allEpisodes }: WatchClientProps) {
  const [lightsOff, setLightsOff] = useState(false);
  const [activeServer, setActiveServer] = useState<StreamServer | null>(
    activeEpisode.servers[0] || null
  );

  const epNum = activeEpisode.number;
  const maxEp = anime.currentEpisode;
  const hasPrev = epNum > 1;
  const hasNext = epNum < maxEp;

  const episodeNumbers = allEpisodes.map((e: any) => e.number).sort((a: number, b: number) => b - a);

  return (
    <>
      {lightsOff && <div className="lights-off-overlay" />}

      <div
        className={`container mx-auto px-4 py-6 space-y-5 ${lightsOff ? "relative z-50" : ""}`}
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link
            href={`/anime/${anime.slug}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {anime.title}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-primary font-medium">Episode {epNum}</span>
        </div>

        {/* Video Player */}
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-2xl shadow-primary/5">
          {activeServer ? (
            activeServer.type === "embed" ? (
              <iframe
                src={activeServer.url}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <video 
                  src={activeServer.url} 
                  controls 
                  className="w-full h-full"
                  poster={anime.bannerImage || ""}
                />
              </div>
            )
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
              <div className="text-center space-y-3">
                <p className="text-white/60">Server tidak tersedia</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeEpisode.downloadLinks.length > 0 ? (
              activeEpisode.downloadLinks.map((dl: any) => (
                <div
                  key={dl.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/80"
                >
                  <Badge variant="secondary" className="font-mono text-xs">
                    {dl.resolution}
                  </Badge>
                  <div className="flex gap-2">
                    <a
                      href={dl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {dl.provider}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">Link download belum tersedia.</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Episode quick select */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Pilih Episode</h3>
          <div className="flex flex-wrap gap-2">
            {episodeNumbers.map((num) => (
              <Button
                key={num}
                variant={num === epNum ? "default" : "outline"}
                size="sm"
                asChild
                className="w-11 h-9 text-xs"
              >
                <Link href={`/anime/${anime.slug}/watch/${num}`}>{num}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
