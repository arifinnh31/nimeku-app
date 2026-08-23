"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { SearchFilters, FilterState } from "@/components/search-filters";
import { AnimeGrid } from "@/components/anime-grid";
import { Button } from "@/components/ui/button";
import { getAnimeList } from "@/actions/anime";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Anime } from "@prisma/client";
import CatalogLoading from "./loading";


const ITEMS_PER_PAGE = 12;

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogLoading />}>
      <CatalogContent />
    </Suspense>
  );
}


function CatalogContent() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState | null>(null);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAnimeList().then(data => {
      setAnimeList(data);
      setIsLoading(false);
    });
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const filteredAnime = useMemo(() => {
    let result = [...animeList];
    
    if (filters) {
      if (filters.query) {
        result = result.filter(a => a.title.toLowerCase().includes(filters.query.toLowerCase()));
      }
      if (filters.genres.length > 0) {
        result = result.filter(a => filters.genres.every(g => a.genres.includes(g)));
      }
      if (filters.season !== "all") {
        result = result.filter(a => a.season?.toLowerCase().startsWith(filters.season.toLowerCase()));
      }

      if (filters.type !== "all") {
        result = result.filter(a => a.type === filters.type);
      }
      if (filters.status !== "all") {
        result = result.filter(a => a.status === filters.status);
      }
      if (filters.sort) {
        if (filters.sort === "rating" || filters.sort === "trending") {
          result.sort((a, b) => b.rating - a.rating);
        } else if (filters.sort === "title") {
          result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (filters.sort === "oldest") {
          result.sort((a, b) => (a.year - b.year) || (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
        } else if (filters.sort === "latest") {
          result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        }
      }
    }
    
    return result;
  }, [filters, animeList]);

  const totalPages = Math.max(1, Math.ceil(filteredAnime.length / ITEMS_PER_PAGE));
  const paginatedAnime = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredAnime.slice(start, start + ITEMS_PER_PAGE);
  }, [page, filteredAnime]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold">
          Katalog Anime
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Jelajahi {animeList.length} anime yang tersedia
        </p>
      </div>

      {/* Filters */}
      <SearchFilters onChange={setFilters} />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan {paginatedAnime.length > 0 ? ((page - 1) * ITEMS_PER_PAGE) + 1 : 0} - {Math.min(page * ITEMS_PER_PAGE, filteredAnime.length)} dari {filteredAnime.length} anime
        </p>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="space-y-2.5">
              <div className="w-full aspect-[3/4] rounded-xl bg-muted/60 animate-pulse" />
              <div className="w-4/5 h-4 rounded bg-muted/60 animate-pulse" />
              <div className="w-1/2 h-3 rounded bg-muted/60 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <AnimeGrid items={paginatedAnime} />
      )}


      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            variant={page === i + 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(i + 1)}
            className="w-9"
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
