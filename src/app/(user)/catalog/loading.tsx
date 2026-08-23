import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="w-48 h-8 rounded-lg" />
        <Skeleton className="w-80 h-4 rounded" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 rounded-xl border border-border/50 bg-card/60 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Skeleton className="h-10 rounded-lg lg:col-span-2" />
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-10 rounded-lg" />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-16 h-6 rounded-full" />
          ))}
        </div>
      </div>

      {/* Grid of Anime Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="space-y-2.5">
            <Skeleton className="w-full aspect-[3/4] rounded-xl" />
            <Skeleton className="w-4/5 h-4 rounded" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-3 rounded" />
              <Skeleton className="w-12 h-3 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center gap-2 pt-6">
        <Skeleton className="w-24 h-10 rounded-lg" />
        <Skeleton className="w-24 h-10 rounded-lg" />
      </div>
    </div>
  );
}
