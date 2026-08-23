"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";
const ALL_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", 
  "Historical", "Horror", "Isekai", "Martial Arts", "Mecha", 
  "Military", "Music", "Mystery", "Psychological", "Romance", 
  "School", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
];

const SEASONS = [
  "Winter 2026", "Spring 2026", "Fall 2025", "Summer 2025",
  "Winter 2025", "Fall 2024", "Summer 2024", "Spring 2024"
];

interface SearchFiltersProps {
  onChange?: (filters: FilterState) => void;
}

export interface FilterState {
  query: string;
  genres: string[];
  season: string;
  type: string;
  status: string;
  sort: string;
}

export function SearchFilters({ onChange }: SearchFiltersProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [season, setSeason] = useState("all");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("latest");
  const [showAllGenres, setShowAllGenres] = useState(false);

  // Update local query if URL param changes (e.g. searching from navbar while already on catalog)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  // Notify parent of filter changes
  useEffect(() => {
    onChange?.({
      query,
      genres: selectedGenres,
      season,
      type,
      status,
      sort,
    });
  }, [query, selectedGenres, season, type, status, sort, onChange]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedGenres([]);
    setSeason("all");
    setType("all");
    setStatus("all");
    setSort("latest");
  };

  const displayedGenres = showAllGenres ? ALL_GENRES : ALL_GENRES.slice(0, 10);
  const hasActiveFilters =
    selectedGenres.length > 0 ||
    season !== "all" ||
    type !== "all" ||
    status !== "all";

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Cari judul anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11 h-12 text-base bg-secondary/50 border-border/50"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Genre chips */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Genre
        </label>
        <div className="flex flex-wrap gap-2">
          {displayedGenres.map((genre) => (
            <Badge
              key={genre}
              variant={selectedGenres.includes(genre) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllGenres(!showAllGenres)}
            className="text-xs text-primary h-6"
          >
            {showAllGenres ? "Lebih sedikit" : `+${ALL_GENRES.length - 10} lagi`}
          </Button>
        </div>
      </div>

      {/* Dropdowns row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-[140px]">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Season
          </label>
          <Select value={season} onValueChange={(v) => v && setSeason(v)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="Semua Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Season</SelectItem>
              {SEASONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[140px]">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Tipe
          </label>
          <Select value={type} onValueChange={(v) => v && setType(v)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="TV">TV</SelectItem>
              <SelectItem value="Movie">Movie</SelectItem>
              <SelectItem value="OVA">OVA</SelectItem>
              <SelectItem value="ONA">ONA</SelectItem>
              <SelectItem value="Special">Special</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[140px]">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Status
          </label>
          <Select value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[140px]">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Urutkan
          </label>
          <Select value={sort} onValueChange={(v) => v && setSort(v)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Terbaru</SelectItem>
              <SelectItem value="rating">Rating Tertinggi</SelectItem>
              <SelectItem value="title">Judul A-Z</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filter summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Filter aktif</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-destructive h-6"
          >
            <X className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
