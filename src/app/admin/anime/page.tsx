"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, Download, Loader2 } from "lucide-react";
import { getAnimeList, deleteAnime } from "@/actions/anime";
import { importTopAnime } from "@/actions/jikan";
import { Anime } from "@prisma/client";

export default function AdminAnimeListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [importing, setImporting] = useState(false);

  const fetchList = useCallback(() => {
    getAnimeList().then(setAnimeList);
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const filteredAnime = useMemo(() => {
    if (!searchQuery) return animeList;
    return animeList.filter((anime) =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, animeList]);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus anime ini? Seluruh episode di dalamnya juga akan terhapus.")) {
      await deleteAnime(id);
      setAnimeList(animeList.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold">
            Kelola Anime
          </h1>
          <p className="text-sm text-muted-foreground">
            {animeList.length} anime terdaftar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={async () => {
              setImporting(true);
              const res = await importTopAnime(1);
              if (res.success) {
                alert(`Berhasil mengimpor ${res.count} anime terpopuler!`);
                fetchList();
              } else {
                alert("Gagal mengimpor: " + res.error);
              }
              setImporting(false);
            }}
            disabled={importing}
          >
            {importing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Tarik Top Anime
          </Button>
          <Button asChild className="gap-2">
            <Link href="/admin/anime/new">
              <Plus className="w-4 h-4" />
              Tambah Anime
            </Link>
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Cari anime..." 
          className="pl-9 bg-secondary/50" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-12">#</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Season</TableHead>
              <TableHead>Episode</TableHead>
              <TableHead>Update</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnime.map((anime, i) => (
              <TableRow key={anime.id}>
                <TableCell className="text-muted-foreground text-sm">
                  {i + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={anime.coverImage}
                      alt={anime.title}
                      width={40}
                      height={56}
                      className="rounded object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-sm line-clamp-1">
                        {anime.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {anime.genres.join(", ")}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-[10px] border-0 ${
                      anime.status === "Ongoing"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    {anime.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{anime.type}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {anime.season} {anime.year}
                </TableCell>
                <TableCell className="text-sm">
                  {anime.currentEpisode}
                  {anime.totalEpisodes ? ` / ${anime.totalEpisodes}` : ""}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(anime.updatedAt).toLocaleDateString('id-ID')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/admin/anime/${anime.id}/edit`}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(anime.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
