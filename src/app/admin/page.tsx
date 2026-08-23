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
  Film,
  Tv,
  Eye,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { getAnimeList, getAdminStats } from "@/actions/anime";
import { Anime } from "@prisma/client";

export default async function AdminDashboardPage() {
  const [animeList, stats] = await Promise.all([
    getAnimeList(),
    getAdminStats(),
  ]);
  const recentAnime = animeList.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Selamat datang, Admin NimeKu
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/anime/new">
            <Plus className="w-4 h-4" />
            Tambah Anime
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Anime"
          value={stats.totalAnime.toLocaleString()}
          icon={Film}
        />
        <StatCard
          title="Total Episode"
          value={stats.totalEpisodes.toLocaleString()}
          icon={Tv}
        />
        <StatCard
          title="Views Hari Ini"
          value={stats.viewsToday.toLocaleString()}
          icon={Eye}
          description="Pengunjung unik"
        />
        <StatCard
          title="Pertumbuhan"
          value={`${stats.weeklyGrowth}%`}
          icon={TrendingUp}
          trend={stats.weeklyGrowth}
        />
      </div>

      {/* Recent Anime Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Anime Terbaru</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/anime">Lihat Semua</Link>
          </Button>
        </div>
        <div className="rounded-xl border border-border/50 overflow-hidden">
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
              {recentAnime.map((anime: Anime, i: number) => (
                <TableRow key={anime.id}>
                  <TableCell className="text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={anime.coverImage}
                        alt={anime.title}
                        width={40}
                        height={56}
                        className="rounded object-cover"
                      />
                      <div>
                        <p className="font-medium text-sm line-clamp-1">
                          {anime.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {anime.studio}
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
                  <TableCell className="text-sm">
                    {anime.currentEpisode}
                    {anime.totalEpisodes ? ` / ${anime.totalEpisodes}` : ""}
                  </TableCell>
                  <TableCell className="text-sm">
                    ⭐ {anime.rating.toFixed(1)}
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
    </div>
  );
}
