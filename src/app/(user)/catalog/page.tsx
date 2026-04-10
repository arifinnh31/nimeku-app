"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { SearchFilters, FilterState } from "@/components/search-filters";
import { AnimeGrid } from "@/components/anime-grid";
import { Button } from "@/components/ui/button";
import { getAnimeList } from "@/actions/anime";
import { Anime } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12 text-center text-muted-foreground animate-pulse">Memuat Katalog...</div>}>
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
        result = result.filter(a => `${a.season} ${a.year}` === filters.season);
      }
      if (filters.type !== "all") {
        result = result.filter(a => a.type === filters.type);
      }
      if (filters.status !== "all") {
        result = result.filter(a => a.status === filters.status);
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
        <div className="py-20 text-center">Loading anime...</div>
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
