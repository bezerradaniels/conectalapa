import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useEvent } from '@/features/events/api/hooks'
import { fetchEventsPaginated } from '@/features/events/api/queries'
import { extractNeighborhood } from '@/lib/format'
import { DetailNotFound, DetailError, DetailSkeleton } from '@/components/detail'
import { EventDetailView } from './detail-view'

export default function EventDetailPage() {
  const { slug = '' } = useParams()
  const { data: event, isLoading, isError, error, refetch } = useEvent(slug)

  const categorySlug = event?.category?.slug
  const neighborhood = event ? extractNeighborhood(event.address) : null
  const relatedFilter = categorySlug ? { category: categorySlug } : neighborhood ? { neighborhood } : null

  const { data: relatedResult } = useQuery({
    queryKey: ['events', 'related', event?.id, relatedFilter],
    queryFn: () => fetchEventsPaginated({ ...relatedFilter, pageSize: 5, includePast: true }),
    enabled: Boolean(relatedFilter && event?.id),
  })
  const related = (relatedResult?.data || []).filter((e) => e.id !== event?.id).slice(0, 4)

  if (isLoading) return <DetailSkeleton />

  if (isError) {
    if (error?.code === 'PGRST116') {
      return <DetailNotFound domainLabel="este evento" backTo="/eventos" backLabel="Ver eventos" />
    }
    return <DetailError message={error?.message} onRetry={() => refetch()} />
  }

  if (!event) return null

  return <EventDetailView event={event} related={related} />
}
