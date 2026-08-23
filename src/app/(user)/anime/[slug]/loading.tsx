import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeDetailLoading() {
  return (
    <div className="min-h-screen pb-16">
      {/* Top Banner Skeleton */}
      <div className="relative h-[35vh] md:h-[45vh] w-full bg-muted/40 animate-pulse overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 -mt-32 relative z-10 space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="shrink-0 mx-auto md:mx-0">
            <Skeleton className="w-44 md:w-52 aspect-[3/4] rounded-xl border-4 border-background shadow-2xl" />
          </div>

          {/* Title & Metadata */}
          <div className="flex-1 space-y-4 text-center md:text-left pt-2 md:pt-12">
            <div className="space-y-2">
              <Skeleton className="w-3/4 max-w-lg h-8 md:h-10 rounded-lg mx-auto md:mx-0" />
              <Skeleton className="w-1/2 max-w-sm h-5 rounded mx-auto md:mx-0" />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              <Skeleton className="w-16 h-6 rounded-full" />
              <Skeleton className="w-12 h-6 rounded-full" />
              <Skeleton className="w-16 h-6 rounded-full" />
              <Skeleton className="w-20 h-6 rounded-full" />
            </div>

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 pt-1">
              <Skeleton className="w-24 h-5 rounded" />
              <Skeleton className="w-28 h-5 rounded" />
              <Skeleton className="w-16 h-5 rounded" />
              <Skeleton className="w-32 h-5 rounded" />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Skeleton className="w-36 h-11 rounded-xl" />
              <Skeleton className="w-28 h-11 rounded-xl" />
              <Skeleton className="w-11 h-11 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Synopsis Skeleton */}
        <div className="p-6 rounded-2xl border border-border/50 bg-card/60 space-y-3">
          <Skeleton className="w-28 h-6 rounded-lg" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-4/5 h-4 rounded" />
        </div>


        {/* Episode List Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="w-40 h-7 rounded-lg" />
            <Skeleton className="w-48 h-9 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
