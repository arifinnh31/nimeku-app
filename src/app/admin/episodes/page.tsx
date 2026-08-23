"use client";

import Link from "next/link";
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
import { Plus, Pencil, Trash2, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

import { getAllEpisodes, deleteEpisode } from "@/actions/episode";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";

export default function AdminEpisodeListPage() {
  const [allEpisodes, setAllEpisodes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [episodeToDelete, setEpisodeToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEpisodes = useCallback(() => {
    setLoading(true);
    getAllEpisodes().then((data) => {
      setAllEpisodes(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  // Reset page when search or pageSize changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  const filteredEpisodes = useMemo(() => {
    if (!searchQuery.trim()) return allEpisodes;
    const q = searchQuery.toLowerCase().trim();
    return allEpisodes.filter((ep) => {
      const animeTitle = ep.anime?.title?.toLowerCase() || "";
      const epNum = `ep ${ep.number} episode ${ep.number} ${ep.number}`;
      const epTitle = ep.title?.toLowerCase() || "";
      return animeTitle.includes(q) || epNum.includes(q) || epTitle.includes(q);
    });
  }, [allEpisodes, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredEpisodes.length / pageSize));
  const paginatedEpisodes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEpisodes.slice(start, start + pageSize);
  }, [currentPage, pageSize, filteredEpisodes]);

  const handleDeleteConfirm = async () => {
    if (!episodeToDelete) return;
    setDeleting(true);
    try {
      await deleteEpisode(episodeToDelete.id);
      setAllEpisodes((prev) => prev.filter((ep) => ep.id !== episodeToDelete.id));
      toast.success(`Episode ${episodeToDelete.number} (${episodeToDelete.anime?.title || ""}) berhasil dihapus.`);
      setEpisodeToDelete(null);
    } catch (error: any) {
      toast.error(`Gagal menghapus episode: ${error.message || "Terjadi kesalahan"}`);
    } finally {
      setDeleting(false);
    }
  };

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, filteredEpisodes.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold">
            Kelola Episode
          </h1>
          <p className="text-sm text-muted-foreground">
            {allEpisodes.length} total episode terdaftar
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/episodes/new">
            <Plus className="w-4 h-4" />
            Tambah Episode
          </Link>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari anime, no. episode, atau judul..."
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
              <TableHead>Anime</TableHead>
              <TableHead>Episode</TableHead>
              <TableHead>Tanggal Rilis</TableHead>
              <TableHead>Server</TableHead>
              <TableHead>Download</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="w-4 h-4 rounded" /></TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="w-40 h-4 rounded" />
                      <Skeleton className="w-24 h-3 rounded" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="w-16 h-5 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="w-24 h-4 rounded" /></TableCell>
                  <TableCell><Skeleton className="w-14 h-5 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="w-14 h-5 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="w-16 h-8 rounded-lg ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredEpisodes.length === 0 ? (

              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  {searchQuery ? "Tidak ada episode yang sesuai dengan pencarian." : "Belum ada episode terdaftar."}
                </TableCell>
              </TableRow>
            ) : (
              paginatedEpisodes.map((ep, i) => (
                <TableRow key={ep.id}>
                  <TableCell className="text-muted-foreground text-sm">
                    {(currentPage - 1) * pageSize + i + 1}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium line-clamp-1">
                      {ep.anime?.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {ep.title}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      Ep {ep.number}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(ep.releasedAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {ep._count?.servers || ep.servers?.length || 0} server
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {ep._count?.downloadLinks || ep.downloadLinks?.length || 0} link
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <Link href={`/admin/episodes/${ep.id}/edit`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setEpisodeToDelete(ep)}
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
      {filteredEpisodes.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Menampilkan {startIdx} - {endIdx} dari {filteredEpisodes.length} episode
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
        open={!!episodeToDelete}
        onOpenChange={(open) => {
          if (!open) setEpisodeToDelete(null);
        }}
        title="Hapus Episode"
        description={`Apakah Anda yakin ingin menghapus Episode ${episodeToDelete?.number} dari anime "${episodeToDelete?.anime?.title}"? Seluruh data server streaming dan link download pada episode ini akan terhapus secara permanen.`}
        confirmText="Hapus Episode"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}


