"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play, Info, Star } from "lucide-react";
import type { Anime } from "@prisma/client";

interface HeroCarouselProps {
  items: Anime[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (!items || items.length === 0) return;
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items]);

  const prev = useCallback(() => {
    if (!items || items.length === 0) return;
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items]);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, items]);

  if (!items || items.length === 0) {
    return null;
  }

  const anime = items[current];


  return (
    <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden rounded-2xl">
      {/* Background */}
      {items.map((item, i) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={item.bannerImage || item.coverImage}
            alt={item.title}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="container mx-auto px-4 pb-12 md:pb-0">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/90 text-primary-foreground border-0">
                {anime.type}
              </Badge>
              <Badge
                variant="outline"
                className={`border-0 ${
                  anime.status === "Ongoing"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {anime.status}
              </Badge>
              <div className="flex items-center gap-1 ml-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold">
                  {anime.rating.toFixed(1)}
                </span>
              </div>
            </div>

            <h1 className="font-[var(--font-heading)] text-3xl md:text-5xl font-bold leading-tight">
              {anime.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {anime.genres.map((g: string) => (
                <span
                  key={g}
                  className="text-xs px-2 py-1 rounded-full bg-white/10 text-muted-foreground"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3 leading-relaxed">
              {anime.synopsis}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button asChild size="lg" className="gap-2">
                <Link href={`/anime/${anime.slug}/watch/1`}>
                  <Play className="w-4 h-4 fill-current" />
                  Tonton Sekarang
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href={`/anime/${anime.slug}`}>
                  <Info className="w-4 h-4" />
                  Detail
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full hidden md:flex"
        onClick={prev}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full hidden md:flex"
        onClick={next}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 h-2 bg-primary"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
