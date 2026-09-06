import { Skeleton } from '@/components/ui/skeleton'

export function BusinessCardSkeleton() {
  return (
    <div className="flex flex-col justify-between p-4 rounded-xl border border-border-hairline bg-bg-surface space-y-4">
      <div>
        <div className="flex items-start gap-3.5">
          <Skeleton className="w-14 h-14 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-5 w-4/5 rounded-md" />
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-3/4 rounded-md" />
        </div>
      </div>
      <div className="pt-2.5 border-t border-border-hairline">
        <Skeleton className="h-3.5 w-1/3 rounded-md" />
      </div>
    </div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4 p-4 rounded-xl border border-border-hairline bg-bg-surface">
      <Skeleton className="w-full sm:w-32 h-32 rounded-lg shrink-0" />

      <div className="flex-1 w-full space-y-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          <Skeleton className="h-5 w-4/5 rounded-md mt-2" />
          <Skeleton className="h-3.5 w-1/2 rounded-md mt-2" />
        </div>
        <div className="pt-2 border-t border-border-hairline">
          <Skeleton className="h-3.5 w-1/3 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function PackageCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border-hairline bg-bg-surface overflow-hidden">
      {/* 16:9 Image placeholder */}
      <div className="aspect-video w-full bg-bg-subtle">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-3.5 w-1/2 rounded-md" />
        </div>
        <div className="pt-3 border-t border-border-hairline flex items-center justify-between">
          <Skeleton className="h-3.5 w-16 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function LodgingCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border-hairline bg-bg-surface overflow-hidden">
      {/* 16:9 Image placeholder */}
      <div className="aspect-video w-full bg-bg-subtle">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-10 rounded-md" />
          </div>
          <Skeleton className="h-5 w-4/5 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
        </div>
        <div className="pt-2.5 border-t border-border-hairline">
          <Skeleton className="h-3.5 w-1/3 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function DiningCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border-hairline bg-bg-surface overflow-hidden">
      {/* 16:9 Image placeholder */}
      <div className="aspect-video w-full bg-bg-subtle">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-14 rounded-md" />
          </div>
          <Skeleton className="h-5 w-4/5 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
        </div>
        <div className="pt-2.5 border-t border-border-hairline">
          <Skeleton className="h-3.5 w-1/3 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export function RecentEntryCardSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border-hairline bg-bg-surface">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-16 rounded-md" />
            <Skeleton className="h-3.5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-3.5 w-6 rounded-md shrink-0" />
    </div>
  )
}
