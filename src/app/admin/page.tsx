import { getAnimeList, getAdminStats } from "@/actions/anime";
import { AdminDashboardView } from "@/components/admin-dashboard-view";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [animeList, stats] = await Promise.all([
    getAnimeList(),
    getAdminStats("all"),
  ]);

  return <AdminDashboardView initialStats={stats} initialAnime={animeList} />;
}

