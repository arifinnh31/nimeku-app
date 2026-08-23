import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-10">
      {/* Hero Carousel Skeleton */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[480px] rounded-2xl overflow-hidden bg-card/60 border border-border/40 p-6 md:p-10 flex flex-col justify-end gap-3">
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-3/4 max-w-lg h-9 md:h-12 rounded-lg" />
        <Skeleton className="w-full max-w-xl h-4 rounded" />
        <Skeleton className="w-2/3 max-w-md h-4 rounded" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="w-32 h-10 rounded-xl" />
          <Skeleton className="w-32 h-10 rounded-xl" />
        </div>
      </div>

      {/* Update Terbaru Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-40 h-7 rounded-lg" />
          <Skeleton className="w-20 h-5 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2.5">
              <Skeleton className="w-full aspect-[3/4] rounded-xl" />
              <Skeleton className="w-4/5 h-4 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-44 h-7 rounded-lg" />
          <Skeleton className="w-20 h-5 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2.5">
              <Skeleton className="w-full aspect-[3/4] rounded-xl" />
              <Skeleton className="w-4/5 h-4 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Anime Ongoing Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-36 h-7 rounded-lg" />
          <Skeleton className="w-20 h-5 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2.5">
              <Skeleton className="w-full aspect-[3/4] rounded-xl" />
              <Skeleton className="w-4/5 h-4 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
