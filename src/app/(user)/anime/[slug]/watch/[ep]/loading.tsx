import { Skeleton } from "@/components/ui/skeleton";

export default function WatchLoading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-16 h-4 rounded" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="w-32 h-4 rounded" />
        <span className="text-muted-foreground">/</span>
        <Skeleton className="w-20 h-4 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Player & Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Player 16:9 Skeleton */}
          <div className="relative w-full aspect-video rounded-2xl bg-black/40 border border-border/40 overflow-hidden flex items-center justify-center">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>

          {/* Server Selector Bar Skeleton */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-border/50 bg-card/60">
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-4 rounded" />
              <Skeleton className="w-20 h-8 rounded-lg" />
              <Skeleton className="w-20 h-8 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-24 h-8 rounded-lg" />
              <Skeleton className="w-24 h-8 rounded-lg" />
            </div>
          </div>

          {/* Anime & Episode Info Skeleton */}
          <div className="p-6 rounded-2xl border border-border/50 bg-card/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="w-64 max-w-sm h-7 rounded-lg" />
                <Skeleton className="w-40 h-5 rounded" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="w-10 h-10 rounded-xl" />
              </div>
            </div>
            <Skeleton className="w-full h-4 rounded" />
            <Skeleton className="w-3/4 h-4 rounded" />
          </div>
        </div>

        {/* Right 1 Col: Episode Sidebar Skeleton */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-border/50 bg-card/60 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-32 h-6 rounded-lg" />
              <Skeleton className="w-16 h-4 rounded" />
            </div>
            <Skeleton className="w-full h-9 rounded-lg" />
            <div className="space-y-2 max-h-[500px] overflow-hidden pt-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-11 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
