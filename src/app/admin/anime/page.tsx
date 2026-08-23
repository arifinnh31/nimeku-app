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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Download, Loader2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getAnimeList, deleteAnime } from "@/actions/anime";
import { importTopAnime } from "@/actions/anilist";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";


import { Anime } from "@prisma/client";
import { toast } from "sonner";
import { formatSeasonYear } from "@/lib/constants";


export default function AdminAnimeListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [animeToDelete, setAnimeToDelete] = useState<Anime | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = useCallback(() => {
    setLoading(true);
    getAnimeList().then((data) => {
      setAnimeList(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  const filteredAnime = useMemo(() => {
    if (!searchQuery.trim()) return animeList;
    const q = searchQuery.toLowerCase().trim();
    return animeList.filter(
      (anime) =>
        anime.title.toLowerCase().includes(q) ||
        (anime.titleJapanese && anime.titleJapanese.toLowerCase().includes(q)) ||
        anime.genres.some((g) => g.toLowerCase().includes(q)) ||
        anime.studio.toLowerCase().includes(q)
    );
  }, [searchQuery, animeList]);

  const totalPages = Math.max(1, Math.ceil(filteredAnime.length / pageSize));
  const paginatedAnime = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAnime.slice(start, start + pageSize);
  }, [currentPage, pageSize, filteredAnime]);

  const handleDeleteConfirm = async () => {
    if (!animeToDelete) return;
    setDeleting(true);
    try {
      await deleteAnime(animeToDelete.id);
      setAnimeList((prev) => prev.filter((a) => a.id !== animeToDelete.id));
      toast.success(`Anime "${animeToDelete.title}" berhasil dihapus.`);
      setAnimeToDelete(null);
    } catch (error: any) {
      toast.error(`Gagal menghapus anime: ${error.message || "Terjadi kesalahan"}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleImportTop = async () => {
    setImporting(true);
    const toastId = toast.loading("Sedang menarik 100 anime terpopuler dari AniList...");

    try {
      const res = await importTopAnime(100);
      if (res.success) {
        toast.success(`Berhasil mengimpor ${res.count} anime terpopuler!`, { id: toastId });
        fetchList();
      } else {
        toast.error(`Gagal mengimpor: ${res.error}`, { id: toastId });
      }
    } catch (err: any) {
      toast.error(`Terjadi kesalahan: ${err.message}`, { id: toastId });
    } finally {
      setImporting(false);
    }
  };

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, filteredAnime.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold">
            Kelola Anime
          </h1>
          <p className="text-sm text-muted-foreground">
            {animeList.length} total anime terdaftar
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleImportTop}
            disabled={importing}
          >
            {importing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Tarik Top 100 Anime
          </Button>

          <Button asChild className="gap-2">
            <Link href="/admin/anime/new">
              <Plus className="w-4 h-4" />
              Tambah Anime
            </Link>
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari anime, genre, studio..." 
            className="pl-9 pr-8 bg-secondary/50" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground self-end sm:self-auto">
          <span>Tampilkan</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(val) => {
              if (val) setPageSize(parseInt(val, 10));
            }}
          >

            <SelectTrigger className="w-20 h-8 text-xs bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>per halaman</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden bg-card/50">
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
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-4 h-4 rounded" /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-14 rounded-md shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="w-40 h-4 rounded" />
                        <Skeleton className="w-24 h-3 rounded" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="w-12 h-5 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="w-16 h-5 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="w-16 h-4 rounded" /></TableCell>
                  <TableCell><Skeleton className="w-12 h-4 rounded" /></TableCell>
                  <TableCell><Skeleton className="w-20 h-4 rounded" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="w-16 h-8 rounded-lg ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredAnime.length === 0 ? (

              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  {searchQuery
                    ? `Tidak ada anime yang cocok dengan "${searchQuery}".`
                    : "Belum ada anime terdaftar."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedAnime.map((anime, i) => (
                <TableRow key={anime.id}>
                  <TableCell className="text-muted-foreground text-sm">
                    {(currentPage - 1) * pageSize + i + 1}
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
                    {formatSeasonYear(anime.season, anime.year)}
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
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setAnimeToDelete(anime)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {filteredAnime.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Menampilkan {startIdx} - {endIdx} dari {filteredAnime.length} anime
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2.5 gap-1 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // Show current page, edges, and adjacent pages
                  return (
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                  );
                })
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;
                  return (
                    <div key={p} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-1 text-xs text-muted-foreground">
                          ...
                        </span>
                      )}
                      <Button
                        variant={currentPage === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(p)}
                        className="w-8 h-8 p-0 text-xs"
                      >
                        {p}
                      </Button>
                    </div>
                  );
                })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 px-2.5 gap-1 text-xs"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!animeToDelete}
        onOpenChange={(open) => {
          if (!open) setAnimeToDelete(null);
        }}
        title="Hapus Anime"
        description={`Apakah Anda yakin ingin menghapus "${animeToDelete?.title}"? Tindakan ini akan menghapus seluruh data anime beserta seluruh episode, server, dan link download di dalamnya secara permanen.`}
        confirmText="Hapus Anime"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

