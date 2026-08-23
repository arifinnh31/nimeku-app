"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { History, Play, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  getWatchHistory,
  removeWatchHistory,
  STORAGE_EVENT,
  WatchHistoryItem,
} from "@/lib/storage";
import { toast } from "sonner";


export function ContinueWatching() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadHistory = () => {
    setHistory(getWatchHistory().slice(0, 6));
  };

  useEffect(() => {
    setMounted(true);
    loadHistory();
    const handleUpdate = () => loadHistory();
    window.addEventListener(STORAGE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(STORAGE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  if (!mounted || history.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h2 className="font-[var(--font-heading)] text-lg md:text-xl font-bold">
            Lanjut Menonton
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {history.map((item) => (
          <div
            key={item.animeSlug}
            className="group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            <Link
              href={`/anime/${item.animeSlug}/watch/${item.episodeNumber}`}
              className="relative aspect-[16/10] overflow-hidden bg-muted"
            >
              <Image
                src={item.coverImage}
                alt={item.animeTitle}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold bg-primary/90 text-primary-foreground px-1.5 py-0.5 rounded">
                  Ep {item.episodeNumber}
                </span>
              </div>
            </Link>

            <div className="p-2.5 flex items-center justify-between gap-1">
              <Link
                href={`/anime/${item.animeSlug}/watch/${item.episodeNumber}`}
                className="flex-1 min-w-0"
              >
                <h3 className="text-xs font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                  {item.animeTitle}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Lanjut episode {item.episodeNumber}
                </p>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  removeWatchHistory(item.animeSlug);
                  toast.success(`"${item.animeTitle}" dihapus dari lanjut menonton.`);
                }}
                title="Hapus dari daftar"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

