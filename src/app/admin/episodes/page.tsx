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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { getAllEpisodes, deleteEpisode } from "@/actions/episode";
import { useState, useEffect } from "react";

export default function AdminEpisodeListPage() {
  const [allEpisodes, setAllEpisodes] = useState<any[]>([]);

  useEffect(() => {
    getAllEpisodes().then(setAllEpisodes);
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus episode ini?")) {
      await deleteEpisode(id);
      setAllEpisodes(allEpisodes.filter(ep => ep.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold">
            Kelola Episode
          </h1>
          <p className="text-sm text-muted-foreground">
            {allEpisodes.length} episode terdaftar
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/episodes/new">
            <Plus className="w-4 h-4" />
            Tambah Episode
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cari episode..." className="pl-9 bg-secondary/50" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
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
            {allEpisodes.map((ep, i) => (
              <TableRow key={ep.id}>
                <TableCell className="text-muted-foreground text-sm">
                  {i + 1}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium line-clamp-1">
                    {ep.anime?.title}
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
                    {ep._count?.servers || 0} server
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {ep._count?.downloadLinks || 0} link
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
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(ep.id)}
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
