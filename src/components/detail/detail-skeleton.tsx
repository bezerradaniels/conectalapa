import { Skeleton } from '@/components/ui/skeleton'

export function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Carregando conteúdo">
      <Skeleton className="h-4 w-40 rounded-md" />
      <Skeleton className="aspect-16/9 w-full rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-7 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-1/3 rounded-md" />
      </div>
      <div className="flex gap-2.5">
        <Skeleton className="h-11 w-32 rounded-lg" />
        <Skeleton className="h-11 w-32 rounded-lg" />
        <Skeleton className="h-11 w-32 rounded-lg" />
      </div>
      <div className="space-y-2 pt-4 border-t border-border-hairline">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
      </div>
    </div>
  )
}
