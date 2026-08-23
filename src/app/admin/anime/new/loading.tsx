import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAnimeNewLoading() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="w-48 h-7 rounded-lg" />
          <Skeleton className="w-40 h-4 rounded" />
        </div>
      </div>

      {/* Import Card */}
      <div className="p-4 rounded-xl border border-border/50 bg-card/60 space-y-3">
        <Skeleton className="w-48 h-5 rounded" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Form Card Skeleton */}
      <div className="p-6 rounded-xl border border-border/50 bg-card/60 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Skeleton className="w-20 h-4 rounded" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-16 h-4 rounded" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-16 h-4 rounded" />
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Skeleton className="w-20 h-4 rounded" />
            <Skeleton className="w-full h-24 rounded-lg" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Skeleton className="w-36 h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
