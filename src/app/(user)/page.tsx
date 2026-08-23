import { HeroCarousel } from "@/components/hero-carousel";
import { SectionHeader } from "@/components/section-header";
import { AnimeGrid } from "@/components/anime-grid";
import {
  getFeaturedAnime,
  getLatestUpdatedAnime,
  getOngoingAnime,
  getCompletedAnime,
} from "@/actions/anime";

// Revalidate this page every 60 seconds or make it dynamic if needed
export const revalidate = 60;

export default async function HomePage() {
  const [
    featuredAnime,
    latestUpdated,
    ongoingAnime,
    completedAnime,
  ] = await Promise.all([
    getFeaturedAnime(),
    getLatestUpdatedAnime(),
    getOngoingAnime(),
    getCompletedAnime(),
  ]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-10">
      {/* Hero Carousel */}
      <HeroCarousel items={featuredAnime} />

      {/* Update Terbaru */}
      <section>
        <SectionHeader title="Update Terbaru" href="/catalog" />
        <AnimeGrid items={latestUpdated} />
      </section>

      {/* Trending Anime */}
      <section>
        <SectionHeader title="Trending Anime" href="/catalog?sort=trending" />
        <AnimeGrid items={featuredAnime} />
      </section>

      {/* Anime Ongoing */}
      <section>
        <SectionHeader title="Anime Ongoing" href="/catalog?status=Ongoing" />
        <AnimeGrid items={ongoingAnime.slice(0, 6)} />
      </section>

      {/* Anime Completed */}
      <section>
        <SectionHeader
          title="Anime Completed"
          href="/catalog?status=Completed"
        />
        <AnimeGrid items={completedAnime.slice(0, 6)} />
      </section>
    </div>
  );
}
