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
import { ArrowLeft, Plus, Trash2, Monitor, Download, Save, Loader2 } from "lucide-react";
import { updateEpisode } from "@/actions/episode";

interface ServerEntry {
  id: string;
  name: string;
  type: "embed" | "direct";
  url: string;
}

interface DownloadEntry {
  id: string;
  resolution: string;
  provider: string;
  url: string;
}

export function EditEpisodeClient({ episode }: { episode: any }) {
  const [loading, setLoading] = useState(false);
  const [servers, setServers] = useState<ServerEntry[]>(
    episode.servers.map((s: any) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      url: s.url,
    }))
  );
  const [downloads, setDownloads] = useState<DownloadEntry[]>(
    episode.downloadLinks.map((d: any) => ({
      id: d.id,
      resolution: d.resolution,
      provider: d.provider,
      url: d.url,
    }))
  );

  const addServer = () => {
    const newId = `new-${Date.now()}`;
    setServers([
      ...servers,
      { id: newId, name: `Server ${servers.length + 1}`, type: "embed", url: "" },
    ]);
  };

  const removeServer = (id: string) => {
    setServers(servers.filter((s) => s.id !== id));
  };

  const updateServer = (id: string, field: keyof ServerEntry, value: string) => {
    setServers(servers.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addDownload = () => {
    const newId = `new-${Date.now()}`;
    setDownloads([
      ...downloads,
      { id: newId, resolution: "720p", provider: "GDrive", url: "" },
    ]);
  };

  const removeDownload = (id: string) => {
    setDownloads(downloads.filter((d) => d.id !== id));
  };

  const updateDownload = (id: string, field: keyof DownloadEntry, value: string) => {
    setDownloads(downloads.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("servers", JSON.stringify(servers));
    formData.set("downloadLinks", JSON.stringify(downloads));
    await updateEpisode(episode.id, formData);
    setLoading(false);
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
            Edit Episode {episode.number} - {episode.anime?.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Perbarui data episode, server, dan link download
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informasi Episode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  No. Episode
                </label>
                <Input name="number" type="number" placeholder="1" defaultValue={episode.number} required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Judul Episode
                </label>
                <Input name="title" placeholder="The Peak of Piracy" defaultValue={episode.title} required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Tanggal Rilis
                </label>
                <Input name="releasedAt" type="date" defaultValue={new Date(episode.releasedAt).toISOString().split('T')[0]} required />
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
                      type="button"
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
                    <Input
                      placeholder="Server 1"
                      value={server.name}
                      onChange={(e) => updateServer(server.id, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Tipe
                    </label>
                    <Select
                      value={server.type}
                      onValueChange={(val: any) => updateServer(server.id, "type", val)}
                    >
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
                    <Input
                      placeholder="https://player.example.com/embed/..."
                      value={server.url}
                      onChange={(e) => updateServer(server.id, "url", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
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
                    <Select
                      value={dl.resolution}
                      onValueChange={(val: any) => updateDownload(dl.id, "resolution", val)}
                    >
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
                    <Select
                      value={dl.provider}
                      onValueChange={(val: any) => updateDownload(dl.id, "provider", val)}
                    >
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
                    <Input
                      placeholder="https://drive.google.com/..."
                      value={dl.url}
                      onChange={(e) => updateDownload(dl.id, "url", e.target.value)}
                    />
                  </div>
                </div>
                {downloads.length > 1 && (
                  <Button
                    type="button"
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
              type="button"
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
          <Button type="submit" className="gap-2" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button variant="outline" asChild disabled={loading}>
            <Link href="/admin/episodes">Batal</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
