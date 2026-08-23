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
import { getAniListAnime, syncEpisodesFromAniList } from "@/actions/anilist";

import { Anime } from "@prisma/client";


import { ListMusic } from "lucide-react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function EditAnimeClient({ anime }: { anime: Anime }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [syncingEpisodes, setSyncingEpisodes] = useState(false);
  const [anilistId, setAnilistId] = useState(anime.anilistId?.toString() || "");
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
    anilistId: anime.anilistId?.toString() || "",
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

  const handleFetchAniList = async () => {
    if (!anilistId.trim()) {
      toast.error("Masukkan Judul Anime, ID, atau URL terlebih dahulu.");
      return;
    }
    setFetching(true);
    const toastId = toast.loading("Mengambil detail anime dari AniList API...");
    
    try {
      const result = await getAniListAnime(anilistId);
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
          airedDay: data.airedDay || formValues.airedDay,
          airedTime: data.airedTime || formValues.airedTime,
          totalEpisodes: data.totalEpisodes?.toString() || "",
          anilistId: data.anilistId?.toString() || anilistId,
        });

        setSelectedGenres(data.genres || []);
        toast.success("Data anime berhasil diperbarui dari AniList!", { id: toastId });
      } else {
        toast.error("Gagal mengambil data: " + result.error, { id: toastId });
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan: " + err.message, { id: toastId });
    } finally {
      setFetching(false);
    }
  };


  const handleSyncEpisodes = async () => {
    const rawId = (anilistId || anime.anilistId?.toString() || "").trim();
    let numId = 0;
    const match = rawId.match(/anime\/(\d+)/i);
    if (match) {
      numId = parseInt(match[1], 10);
    } else if (/^\d+$/.test(rawId)) {
      numId = parseInt(rawId, 10);
    }

    setSyncingEpisodes(true);
    const toastId = toast.loading("Sedang menyinkronkan daftar episode dari AniList...");
    try {
      const result = await syncEpisodesFromAniList(anime.id, numId);
      if (result.success) {
        toast.success(`Berhasil sinkronisasi ${result.count} episode!`, { id: toastId });
        router.refresh();
      } else {
        toast.error("Gagal sinkronisasi episode: " + result.error, { id: toastId });
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan sinkronisasi: " + err.message, { id: toastId });
    } finally {
      setSyncingEpisodes(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValues.title.trim()) {
      toast.error("Judul anime wajib diisi.");
      return;
    }
    if (!formValues.coverImage.trim()) {
      toast.error("Cover image URL wajib diisi.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Menyimpan perubahan anime...");
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("title", formValues.title.trim());
      formData.set("slug", formValues.slug.trim());
      formData.set("synopsis", formValues.synopsis.trim());
      formData.set("type", formValues.type || "TV");
      formData.set("status", formValues.status || "Ongoing");
      formData.set("studio", formValues.studio.trim() || "Unknown");
      formData.set("season", formValues.season || "Unknown");
      formData.set("year", formValues.year || new Date().getFullYear().toString());
      formData.set("rating", formValues.rating || "0");
      formData.set("coverImage", formValues.coverImage.trim());
      formData.set("bannerImage", formValues.bannerImage.trim());
      formData.set("airedDay", formValues.airedDay);
      formData.set("airedTime", formValues.airedTime);
      formData.set("totalEpisodes", formValues.totalEpisodes);
      formData.set("anilistId", formValues.anilistId);
      formData.set("genres", selectedGenres.join(","));

      const res = await updateAnime(anime.id, formData);
      if (res.success) {
        toast.success("Perubahan anime berhasil disimpan!", { id: toastId });
        router.push("/admin/anime");
        router.refresh();
      } else {
        toast.error("Gagal menyimpan perubahan: " + res.error, { id: toastId });
        setLoading(false);
      }
    } catch (err: any) {
      toast.error("Gagal menyimpan perubahan: " + (err?.message || "Terjadi kesalahan"), { id: toastId });
      setLoading(false);
    }
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

      {/* Import AniList */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            Update Otomatis via AniList API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Masukkan Judul Anime, ID, atau URL"
              value={anilistId}
              onChange={(e) => setAnilistId(e.target.value)}
              className="bg-background"
            />

            <Button
              type="button"
              onClick={handleFetchAniList}
              disabled={!anilistId || fetching}
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
                  Fetch AniList
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleSyncEpisodes}
              disabled={syncingEpisodes || (!anilistId && !anime.anilistId)}
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
            Gunakan Judul Anime atau ID AniList untuk memperbarui data anime atau menarik daftar episode secara otomatis.
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-5">
            <input type="hidden" name="anilistId" value={formValues.anilistId} />
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
                   placeholder="https://s4.anilist.co/file/anilistcdn/media/anime/cover/..."
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
