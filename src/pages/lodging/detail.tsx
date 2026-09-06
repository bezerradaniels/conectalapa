import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useLodgingDetail } from '@/features/lodging/api/hooks'
import { fetchLodgingPaginated } from '@/features/lodging/api/queries'
import { extractNeighborhood } from '@/lib/format'
import { DetailNotFound, DetailError, DetailSkeleton } from '@/components/detail'
import { LodgingDetailView } from './detail-view'

export default function LodgingDetailPage() {
  const { slug = '' } = useParams()
  const { data: lodging, isLoading, isError, error, refetch } = useLodgingDetail(slug)

  const categorySlug = lodging?.category?.slug
  const neighborhood = lodging ? extractNeighborhood(lodging.address) : null
  const relatedFilter = categorySlug ? { category: categorySlug } : neighborhood ? { neighborhood } : null

  const { data: relatedResult } = useQuery({
    queryKey: ['lodging', 'related', lodging?.id, relatedFilter],
    queryFn: () => fetchLodgingPaginated({ ...relatedFilter, pageSize: 5 }),
    enabled: Boolean(relatedFilter && lodging?.id),
  })
  const related = (relatedResult?.data || []).filter((l) => l.id !== lodging?.id).slice(0, 4)

  if (isLoading) return <DetailSkeleton />

  if (isError) {
    if (error?.code === 'PGRST116') {
      return <DetailNotFound domainLabel="esta hospedagem" backTo="/hospedagem" backLabel="Ver hospedagens" />
    }
    return <DetailError message={error?.message} onRetry={() => refetch()} />
  }

  if (!lodging) return null

  return <LodgingDetailView lodging={lodging} related={related} />
}
