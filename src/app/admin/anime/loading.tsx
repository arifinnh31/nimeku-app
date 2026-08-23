import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAnimeLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-40 h-8 rounded-lg" />
          <Skeleton className="w-48 h-4 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-36 h-10 rounded-lg" />
          <Skeleton className="w-36 h-10 rounded-lg" />
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      {/* Table Card Skeleton */}
      <div className="rounded-xl border border-border/50 bg-card/60 overflow-hidden">
        <div className="p-4 border-b border-border/40">
          <Skeleton className="w-full h-8 rounded" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-border/20 last:border-0">
              <Skeleton className="w-12 h-16 rounded-md shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-48 h-5 rounded" />
                <Skeleton className="w-32 h-3 rounded" />
              </div>
              <Skeleton className="w-16 h-6 rounded-full" />
              <Skeleton className="w-20 h-6 rounded-full" />
              <Skeleton className="w-16 h-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
