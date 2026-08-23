import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleLoading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="w-56 h-8 rounded-lg" />
        <Skeleton className="w-64 h-4 rounded" />
      </div>

      {/* Day Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="w-24 h-10 rounded-xl shrink-0" />
        ))}
      </div>

      {/* Schedule Anime List Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/60"
          >
            {/* Poster */}
            <Skeleton className="w-16 h-22 md:w-20 md:h-28 rounded-lg shrink-0" />

            {/* Content */}
            <div className="flex-1 space-y-2.5">
              <Skeleton className="w-3/5 max-w-sm h-5 rounded" />
              <div className="flex gap-2">
                <Skeleton className="w-14 h-4 rounded-full" />
                <Skeleton className="w-14 h-4 rounded-full" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="w-12 h-3 rounded" />
                <Skeleton className="w-16 h-3 rounded" />
              </div>
            </div>

            {/* Time Pill */}
            <Skeleton className="w-24 h-7 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
