import { Skeleton } from "@/components/ui/skeleton";

/** Suspense fallback for lazy views: same page frame, no layout shift (FE10 §1). */
export default function ViewSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto" aria-busy="true">
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-5 sm:px-6 md:px-8">
        <Skeleton className="h-7 w-48 rounded-[8px]" />
        <Skeleton className="h-24 rounded-[14px]" />
        <Skeleton className="h-24 rounded-[14px]" />
      </div>
    </div>
  );
}
