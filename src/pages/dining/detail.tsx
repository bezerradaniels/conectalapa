import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useDiningDetail } from '@/features/dining/api/hooks'
import { fetchDiningPaginated } from '@/features/dining/api/queries'
import { extractNeighborhood } from '@/lib/format'
import { DetailNotFound, DetailError, DetailSkeleton } from '@/components/detail'
import { DiningDetailView } from './detail-view'

export default function DiningDetailPage() {
  const { slug = '' } = useParams()
  const { data: dining, isLoading, isError, error, refetch } = useDiningDetail(slug)

  const categorySlug = dining?.category?.slug
  const neighborhood = dining ? extractNeighborhood(dining.address) : null
  const relatedFilter = categorySlug ? { category: categorySlug } : neighborhood ? { neighborhood } : null

  const { data: relatedResult } = useQuery({
    queryKey: ['dining', 'related', dining?.id, relatedFilter],
    queryFn: () => fetchDiningPaginated({ ...relatedFilter, pageSize: 5 }),
    enabled: Boolean(relatedFilter && dining?.id),
  })
  const related = (relatedResult?.data || []).filter((d) => d.id !== dining?.id).slice(0, 4)

  if (isLoading) return <DetailSkeleton />

  if (isError) {
    if (error?.code === 'PGRST116') {
      return <DetailNotFound domainLabel="este restaurante" backTo="/gastronomia" backLabel="Ver gastronomia" />
    }
    return <DetailError message={error?.message} onRetry={() => refetch()} />
  }

  if (!dining) return null

  return <DiningDetailView dining={dining} related={related} />
}
