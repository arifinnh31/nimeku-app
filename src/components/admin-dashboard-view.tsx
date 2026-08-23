"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Film,
  Tv,
  Eye,
  TrendingUp,
  Star,
  Calendar,
  Pencil,
  Trash2,
  ChevronRight,
} from "lucide-react";

import { getAdminStats, deleteAnime } from "@/actions/anime";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Anime } from "@prisma/client";
import { toast } from "sonner";

interface AdminDashboardViewProps {
  initialStats: {
    totalAnime: number;
    totalEpisodes: number;
    viewsCount: number;
    todayViewsCount: number;
    growthPercentage: number;
  };
  initialAnime: Anime[];
}

export function AdminDashboardView({
  initialStats,
  initialAnime,
}: AdminDashboardViewProps) {
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "year" | "all">("all");
  const [stats, setStats] = useState(initialStats);
  const [animeList, setAnimeList] = useState<Anime[]>(initialAnime);
  const [animeToDelete, setAnimeToDelete] = useState<Anime | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStats = useCallback(async (selectedPeriod: "today" | "7d" | "30d" | "year" | "all") => {
    try {
      const data = await getAdminStats(selectedPeriod);
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }, []);


  useEffect(() => {
    fetchStats(period);
  }, [period, fetchStats]);

  const handleDeleteConfirm = async () => {
    if (!animeToDelete) return;
    setDeleting(true);
    try {
      await deleteAnime(animeToDelete.id);
      setAnimeList((prev) => prev.filter((a) => a.id !== animeToDelete.id));
      toast.success(`Anime "${animeToDelete.title}" berhasil dihapus.`);
      setAnimeToDelete(null);
      fetchStats(period);
    } catch (err: any) {
      toast.error(`Gagal menghapus anime: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setDeleting(false);
    }
  };

  const periodLabels: Record<string, string> = {
    today: "Hari Ini",
    "7d": "7 Hari Terakhir",
    "30d": "30 Hari Terakhir",
    year: "Tahun Ini",
    all: "Semua Waktu",
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan data & analitik katalog NimeKu
          </p>
        </div>

        {/* Period Filter Dropdown */}
        <div className="flex items-center gap-2 bg-card/60 border border-border/50 p-1.5 rounded-xl shadow-xs">
          <Calendar className="w-4 h-4 text-primary ml-2 shrink-0" />
          <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
            Periode:
          </span>
          <Select
            value={period}
            onValueChange={(val: any) => {
              if (val) setPeriod(val);
            }}
          >
            <SelectTrigger className="w-36 sm:w-44 h-8 text-xs border-0 bg-transparent focus:ring-0">
              <SelectValue>{periodLabels[period]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="7d">7 Hari Terakhir</SelectItem>
              <SelectItem value="30d">30 Hari Terakhir</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
              <SelectItem value="all">Semua Waktu</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>

      {/* Realtime Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Anime"
          value={stats.totalAnime.toLocaleString()}
          icon={Film}
          description="Koleksi anime di database"
        />
        <StatCard
          title="Total Episode"
          value={stats.totalEpisodes.toLocaleString()}
          icon={Tv}
          description="Total episode aktif siap tonton"
        />
        <StatCard
          title={period === "today" ? "Views Hari Ini" : `Views (${periodLabels[period]})`}
          value={stats.viewsCount.toLocaleString()}
          icon={Eye}
          description={`${stats.todayViewsCount.toLocaleString()} views tercatat hari ini`}
        />
        <StatCard
          title="Pertumbuhan"
          value={`${stats.growthPercentage > 0 ? "+" : ""}${stats.growthPercentage}%`}
          icon={TrendingUp}
          description={
            stats.growthPercentage >= 0
              ? "Trafik meningkat dibanding periode lalu"
              : "Trafik menurun dibanding periode lalu"
          }
        />
      </div>


      {/* Recent Anime Table */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Anime Terbaru Ditambahkan</h2>
            <p className="text-xs text-muted-foreground">
              Daftar anime terbaru yang siap ditonton
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="gap-1 text-xs">
            <Link href="/admin/anime">
              <span>Kelola Semua Anime</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        <div className="rounded-xl border border-border/50 overflow-hidden bg-card/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Episode</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animeList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                    Belum ada data anime.
                  </TableCell>
                </TableRow>
              ) : (
                animeList.slice(0, 5).map((anime, i) => (
                  <TableRow key={anime.id}>

                    <TableCell className="text-muted-foreground text-sm">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 bg-muted">
                          <Image
                            src={anime.coverImage}
                            alt={anime.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm line-clamp-1">
                            {anime.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {anime.studio || anime.genres.join(", ")}
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
                    <TableCell className="text-sm font-mono">
                      {anime.currentEpisode}
                      {anime.totalEpisodes ? ` / ${anime.totalEpisodes}` : ""}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{anime.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
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
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={!!animeToDelete}
        onOpenChange={(open) => {
          if (!open) setAnimeToDelete(null);
        }}
        title="Hapus Anime"
        description={`Apakah Anda yakin ingin menghapus "${animeToDelete?.title}"? Tindakan ini akan menghapus data anime beserta seluruh episodenya secara permanen.`}
        confirmText="Hapus Anime"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
