import { Skeleton } from '@/components/ui/skeleton'

export function BusinessCardSkeleton() {
  return (
    <div className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-border-hairline bg-bg-surface shadow-sm space-y-4">
      <div>
        <div className="flex items-start gap-4">
          <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-5 w-4/5 rounded-lg" />
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-3/4 rounded-md" />
        </div>
      </div>
      <div className="pt-3 border-t border-border-hairline">
        <Skeleton className="h-3.5 w-1/3 rounded-full" />
      </div>
    </div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-4 p-5 rounded-2xl border border-border-hairline bg-bg-surface shadow-sm">
      <Skeleton className="w-full sm:w-36 h-36 rounded-2xl shrink-0" />

      <div className="flex-1 w-full space-y-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-5 w-4/5 rounded-lg mt-2" />
          <Skeleton className="h-3.5 w-1/2 rounded-md mt-2" />
        </div>
        <div className="pt-3 border-t border-border-hairline">
          <Skeleton className="h-3.5 w-1/3 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function PackageCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border-hairline bg-bg-surface overflow-hidden shadow-sm">
      <div className="aspect-video w-full bg-bg-subtle">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-full mb-1" />
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          <Skeleton className="h-3.5 w-1/2 rounded-md" />
        </div>
        <div className="pt-3 border-t border-border-hairline flex items-center justify-between">
          <Skeleton className="h-3.5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function LodgingCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border-hairline bg-bg-surface overflow-hidden shadow-sm">
      <div className="aspect-video w-full bg-bg-subtle">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-10 rounded-full" />
          </div>
          <Skeleton className="h-5 w-4/5 rounded-lg" />
          <Skeleton className="h-3 w-full rounded-md" />
        </div>
        <div className="pt-3 border-t border-border-hairline">
          <Skeleton className="h-3.5 w-1/3 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function DiningCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border-hairline bg-bg-surface overflow-hidden shadow-sm">
      <div className="aspect-video w-full bg-bg-subtle">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
          <Skeleton className="h-5 w-4/5 rounded-lg" />
          <Skeleton className="h-3 w-full rounded-md" />
        </div>
        <div className="pt-3 border-t border-border-hairline">
          <Skeleton className="h-3.5 w-1/3 rounded-full" />
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
