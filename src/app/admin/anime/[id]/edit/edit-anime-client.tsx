"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, X, Loader2, Save, Search } from "lucide-react";
import { ALL_GENRES, SEASONS, SCHEDULE_DAYS } from "@/lib/constants";
import { updateAnime } from "@/actions/anime";
import { getJikanAnime, syncEpisodesFromMal } from "@/actions/jikan";
import { Anime } from "@prisma/client";
import { ListMusic } from "lucide-react";

export function EditAnimeClient({ anime }: { anime: Anime }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [syncingEpisodes, setSyncingEpisodes] = useState(false);
  const [malId, setMalId] = useState(anime.malId?.toString() || "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(anime.genres);

  const [formValues, setFormValues] = useState({
    title: anime.title,
    slug: anime.slug,
    synopsis: anime.synopsis,
    type: anime.type,
    status: anime.status,
    studio: anime.studio,
    rating: anime.rating.toString(),
    season: anime.season || "",
    year: anime.year.toString(),
    totalEpisodes: anime.totalEpisodes?.toString() || "",
    coverImage: anime.coverImage,
    bannerImage: anime.bannerImage || "",
    airedDay: anime.airedDay || "",
    airedTime: anime.airedTime || "23:00",
    malId: anime.malId?.toString() || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleFetchJikan = async () => {
    if (!malId) return;
    setFetching(true);
    
    const result = await getJikanAnime(malId);
    
    if (result.success && result.data) {
      const { data } = result;
      setFormValues({
        title: data.title || "",
        slug: data.slug || "",
        synopsis: data.synopsis || "",
        type: data.type || "TV",
        status: data.status || "Ongoing",
        studio: data.studio || "",
        season: data.season || "",
        year: data.year.toString(),
        rating: data.rating.toString(),
        coverImage: data.coverImage || "",
        bannerImage: data.bannerImage || "",
        airedDay: formValues.airedDay,
        airedTime: formValues.airedTime,
        totalEpisodes: data.totalEpisodes?.toString() || "",
        malId: data.malId?.toString() || malId,
      });
      setSelectedGenres(data.genres || []);
    } else {
      alert("Gagal mengambil data: " + result.error);
    }
    
    setFetching(false);
  };

  const handleSyncEpisodes = async () => {
    const idToSync = malId || anime.malId?.toString();
    if (!idToSync) {
      alert("Masukkan MAL ID terlebih dahulu!");
      return;
    }

    setSyncingEpisodes(true);
    const result = await syncEpisodesFromMal(anime.id, parseInt(idToSync));
    
    if (result.success) {
      alert(`Berhasil sinkronisasi ${result.count} episode!`);
    } else {
      alert("Gagal sinkronisasi episode: " + result.error);
    }
    setSyncingEpisodes(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("genres", selectedGenres.join(","));
    await updateAnime(anime.id, formData);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/anime">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold">
            Edit Anime: {anime.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Perbarui detail informasi anime
          </p>
        </div>
      </div>

      {/* Import MAL */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            Update dari MyAnimeList (Jikan API)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Masukkan MAL ID (contoh: 21)"
              value={malId}
              onChange={(e) => setMalId(e.target.value)}
              className="bg-background"
            />
            <Button
              type="button"
              onClick={handleFetchJikan}
              disabled={!malId || fetching}
              className="shrink-0 gap-2"
            >
              {fetching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengambil...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Fetch & Sync
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSyncEpisodes}
              disabled={syncingEpisodes || (!malId && !anime.malId)}
              className="shrink-0 gap-2"
            >
              {syncingEpisodes ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <ListMusic className="w-4 h-4" />
                  Tarik Episode
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Gunakan MAL ID untuk memperbarui judul, sinopsis, genre, dan cover, atau tarik daftar episode secara otomatis.
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-5">
            <input type="hidden" name="malId" value={formValues.malId} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">Judul</label>
                <Input
                  name="title"
                  placeholder="One Piece"
                  value={formValues.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">Slug</label>
                <Input
                  name="slug"
                  placeholder="one-piece"
                  value={formValues.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">
                  Sinopsis
                </label>
                <textarea
                  name="synopsis"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y"
                  placeholder="Deskripsi anime..."
                  value={formValues.synopsis}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tipe</label>
                <Select
                  name="type"
                  value={formValues.type}
                  onValueChange={(v) => handleSelectChange("type", v as string)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["TV", "Movie", "OVA", "ONA", "Special"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Status
                </label>
                <Select
                   name="status"
                   value={formValues.status}
                   onValueChange={(v) => handleSelectChange("status", v as string)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Studio
                </label>
                <Input
                   name="studio"
                   placeholder="Toei Animation"
                   value={formValues.studio}
                   onChange={handleInputChange}
                   required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Rating (MAL)
                </label>
                <Input
                  name="rating"
                  type="number"
                  step="0.01"
                  placeholder="8.71"
                  value={formValues.rating}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Season
                </label>
                <Select
                   name="season"
                   value={formValues.season}
                   onValueChange={(v) => handleSelectChange("season", v as string)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Season" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEASONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Tahun
                </label>
                <Input
                  name="year"
                  type="number"
                  placeholder="2026"
                  value={formValues.year}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Total Episode
                </label>
                <Input
                   name="totalEpisodes"
                   type="number"
                   placeholder="24 (kosongkan jika sedang tayang)"
                   value={formValues.totalEpisodes}
                   onChange={handleInputChange}
                />
              </div>
            </div>

            <Separator />

            {/* Genres */}
            <div>
              <label className="text-sm font-medium mb-2 block">Genre</label>
              <div className="flex flex-wrap gap-2">
                {ALL_GENRES.map((genre) => (
                  <Badge
                    key={genre}
                    variant={
                      selectedGenres.includes(genre) ? "default" : "outline"
                    }
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                    {selectedGenres.includes(genre) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Cover & Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">
                  Cover Image URL
                </label>
                <Input
                   name="coverImage"
                   placeholder="https://cdn.myanimelist.net/images/anime/..."
                   value={formValues.coverImage}
                   onChange={handleInputChange}
                   required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">
                  Banner Image URL (Opsional)
                </label>
                <Input
                   name="bannerImage"
                   placeholder="https://..."
                   value={formValues.bannerImage}
                   onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Hari Tayang
                </label>
                <Select
                  name="airedDay"
                  value={formValues.airedDay}
                  onValueChange={(v) => handleSelectChange("airedDay", v as string)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih hari" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEDULE_DAYS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Jam Tayang
                </label>
                <Input
                  name="airedTime"
                  type="time"
                  value={formValues.airedTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" className="gap-2" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Button variant="outline" asChild disabled={loading}>
                <Link href="/admin/anime">Batal</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

    </div>
  );
}
