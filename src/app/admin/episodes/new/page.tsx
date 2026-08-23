"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Monitor, Download } from "lucide-react";
import { getAnimeList } from "@/actions/anime";
import { Anime } from "@prisma/client";
import { useEffect } from "react";

interface ServerEntry {
  id: number;
  name: string;
  type: "embed" | "direct";
  url: string;
}

interface DownloadEntry {
  id: number;
  resolution: string;
  provider: string;
  url: string;
}

export default function AddEpisodePage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  useEffect(() => { getAnimeList().then(setAnimeList) }, []);
  const [servers, setServers] = useState<ServerEntry[]>([
    { id: 1, name: "Server 1", type: "embed", url: "" },
  ]);
  const [downloads, setDownloads] = useState<DownloadEntry[]>([
    { id: 1, resolution: "720p", provider: "GDrive", url: "" },
  ]);

  const addServer = () => {
    const newId = Math.max(0, ...servers.map((s) => s.id)) + 1;
    setServers([
      ...servers,
      { id: newId, name: `Server ${newId}`, type: "embed", url: "" },
    ]);
  };

  const removeServer = (id: number) => {
    setServers(servers.filter((s) => s.id !== id));
  };

  const addDownload = () => {
    const newId = Math.max(0, ...downloads.map((d) => d.id)) + 1;
    setDownloads([
      ...downloads,
      { id: newId, resolution: "720p", provider: "GDrive", url: "" },
    ]);
  };

  const removeDownload = (id: number) => {
    setDownloads(downloads.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/episodes">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold">
            Tambah Episode Baru
          </h1>
          <p className="text-sm text-muted-foreground">
            Tambahkan episode beserta server streaming dan link download
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Informasi Episode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Pilih Anime
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih anime..." />
              </SelectTrigger>
              <SelectContent>
                {animeList.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                No. Episode
              </label>
              <Input type="number" placeholder="1100" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Judul Episode
              </label>
              <Input placeholder="The Peak of Piracy" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Tanggal Rilis
              </label>
              <Input type="date" defaultValue="2026-03-25" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streaming Servers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" />
            Server Streaming
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {servers.map((server, i) => (
            <div
              key={server.id}
              className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs font-mono">
                  Server {i + 1}
                </Badge>
                {servers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeServer(server.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Nama Server
                  </label>
                  <Input placeholder="Server 1" defaultValue={server.name} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Tipe
                  </label>
                  <Select defaultValue={server.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="embed">Embed (iframe)</SelectItem>
                      <SelectItem value="direct">Direct (mp4/m3u8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    URL
                  </label>
                  <Input placeholder="https://player.example.com/embed/..." />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addServer}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Tambah Server
          </Button>
        </CardContent>
      </Card>

      {/* Download Links */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            Link Download
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {downloads.map((dl) => (
            <div
              key={dl.id}
              className="flex items-end gap-3 p-3 rounded-lg border border-border/50 bg-muted/20"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Resolusi
                  </label>
                  <Select defaultValue={dl.resolution}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["360p", "480p", "720p", "1080p"].map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Provider
                  </label>
                  <Select defaultValue={dl.provider}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["GDrive", "Mega", "ZippyShare", "MediaFire"].map(
                        (p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    URL
                  </label>
                  <Input placeholder="https://drive.google.com/..." />
                </div>
              </div>
              {downloads.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive shrink-0"
                  onClick={() => removeDownload(dl.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addDownload}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Tambah Link Download
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button className="gap-2">Publish Episode</Button>
        <Button variant="outline">Simpan Draft</Button>
        <Button variant="ghost" asChild>
          <Link href="/admin/episodes">Batal</Link>
        </Button>
      </div>
    </div>
  );
}
