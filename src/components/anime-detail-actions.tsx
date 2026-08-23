"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Check } from "lucide-react";
import { isBookmarked, toggleBookmark, STORAGE_EVENT } from "@/lib/storage";
import { toast } from "sonner";

interface AnimeDetailActionsProps {
  anime: {
    slug: string;
    title: string;
    coverImage: string;
    rating: number;
    type: string;
    status: string;
    totalEpisodes?: number | null;
    currentEpisode: number;
  };
}

export function AnimeDetailActions({ anime }: AnimeDetailActionsProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(anime.slug));
    const handleUpdate = () => setBookmarked(isBookmarked(anime.slug));
    window.addEventListener(STORAGE_EVENT, handleUpdate);
    return () => window.removeEventListener(STORAGE_EVENT, handleUpdate);
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
          title: anime.title,
          text: `Nonton anime ${anime.title} Subtitle Indonesia gratis di NimeKu`,
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
      toast.success("Link anime berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };


  return (
    <div className="flex items-center gap-2">
      <Button
        variant={bookmarked ? "default" : "outline"}
        size="lg"
        onClick={handleBookmarkToggle}
        className="gap-2"
      >
        <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} />
        {bookmarked ? "Tersimpan di Favorit" : "Tambah ke Favorit"}
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={handleShare}
        className="gap-2"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500">Link Tersalin!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </>
        )}
      </Button>
    </div>
  );
}
