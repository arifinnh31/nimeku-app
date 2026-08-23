import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-48 h-8 rounded-lg" />
          <Skeleton className="w-72 h-4 rounded" />
        </div>
        <Skeleton className="w-36 h-10 rounded-lg" />
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 rounded-xl border border-border/50 bg-card/60 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
            <Skeleton className="w-20 h-7 rounded" />
            <Skeleton className="w-32 h-3 rounded" />
          </div>
        ))}
      </div>

      {/* Traffic Chart Card Skeleton */}
      <div className="p-6 rounded-xl border border-border/50 bg-card/60 space-y-4">
        <div className="space-y-2">
          <Skeleton className="w-36 h-6 rounded-lg" />
          <Skeleton className="w-56 h-4 rounded" />
        </div>
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>

      {/* Recent Anime Table Skeleton */}
      <div className="p-6 rounded-xl border border-border/50 bg-card/60 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-36 h-6 rounded-lg" />
          <Skeleton className="w-24 h-8 rounded-lg" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-14 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
