import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EpisodeList } from "@/components/episode-list";
import {
  Star,
  Play,
  Calendar,
  Tv,
  Building2,
  Download,
  ExternalLink,
} from "lucide-react";
import { getAnimeBySlug, getAnimeList } from "@/actions/anime";
import { Metadata } from "next";

// Generate all possible slugs at build time
export async function generateStaticParams() {
  const animes = await getAnimeList();
  return animes.map((anime: { slug: string }) => ({ slug: anime.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const anime = await getAnimeBySlug(slug);

  if (!anime) {
    return {
      title: "Anime Tidak Ditemukan - NimeKu",
    };
  }

  const title = `${anime.title} Subtitle Indonesia - NimeKu`;
  const description = anime.synopsis.substring(0, 160) + "...";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [anime.coverImage],
      type: "video.movie",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [anime.coverImage],
    },
  };
}

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const anime = await getAnimeBySlug(slug);
  if (!anime) return notFound();

  const episodes = anime.episodes || [];

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-[35vh] md:h-[45vh] overflow-hidden">
        <Image
          src={anime.bannerImage || anime.coverImage}
          alt={anime.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover */}
          <div className="shrink-0">
            <div className="relative w-44 md:w-52 aspect-[3/4] rounded-xl overflow-hidden border-4 border-background shadow-2xl shadow-primary/10">
              <Image
                src={anime.coverImage}
                alt={anime.title}
                fill
                sizes="208px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 md:pt-8">
            <h1 className="font-[var(--font-heading)] text-2xl md:text-4xl font-bold leading-tight">
              {anime.title}
            </h1>
            {anime.titleJapanese && (
              <p className="text-sm text-muted-foreground mt-1">
                {anime.titleJapanese}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{anime.rating.toFixed(2)}</span>
              </div>
              <Badge
                className={`border-0 ${
                  anime.status === "Ongoing"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {anime.status}
              </Badge>
              <Badge variant="secondary">{anime.type}</Badge>
              <Badge variant="outline">
                {anime.currentEpisode}
                {anime.totalEpisodes ? ` / ${anime.totalEpisodes}` : ""} Episode
              </Badge>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4 text-primary" />
                <span>{anime.studio}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {anime.season} {anime.year}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tv className="w-4 h-4 text-primary" />
                <span>{anime.type}</span>
              </div>
              {anime.airedDay && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Play className="w-4 h-4 text-primary" />
                  <span>
                    {anime.airedDay} {anime.airedTime}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-4">
              {anime.genres.map((g: string) => (
                <Badge key={g} variant="outline" className="text-xs">
                  {g}
                </Badge>
              ))}
            </div>

            {/* CTA */}
            <div className="flex gap-3 mt-5">
              <Button asChild size="lg" className="gap-2">
                <Link href={`/anime/${anime.slug}/watch/1`}>
                  <Play className="w-4 h-4 fill-current" />
                  Tonton Episode 1
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="mt-8">
          <h2 className="font-[var(--font-heading)] text-lg font-semibold mb-3">
            Sinopsis
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {anime.synopsis}
          </p>
        </div>

        <Separator className="my-8" />

        {/* Episodes */}
        <div>
          <h2 className="font-[var(--font-heading)] text-lg font-semibold mb-4">
            Daftar Episode
          </h2>
          <EpisodeList episodes={episodes} animeSlug={anime.slug} />
        </div>

        <Separator className="my-8" />

        {/* Batch Download */}
        <div className="mb-10">
          <h2 className="font-[var(--font-heading)] text-lg font-semibold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Download Batch
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">
                    Resolusi
                  </th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">
                    Server 1
                  </th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">
                    Server 2
                  </th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">
                    Server 3
                  </th>
                </tr>
              </thead>
              <tbody>
                {["480p", "720p", "1080p"].map((res) => (
                  <tr key={res} className="border-b border-border/30">
                    <td className="py-2.5 px-3 font-medium">{res}</td>
                    {["GDrive", "Mega", "ZippyShare"].map((prov) => (
                      <td key={prov} className="py-2.5 px-3">
                        <a
                          href="#"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {prov}
                        </a>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
