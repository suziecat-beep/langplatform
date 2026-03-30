import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 8 }: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-lg border p-0 overflow-hidden">
          <Skeleton className="h-32 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-10" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
          <div className="border-t p-3 flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
