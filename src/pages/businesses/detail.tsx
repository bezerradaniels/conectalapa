import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useBusiness } from '@/features/businesses/api/hooks'
import { fetchBusinessesPaginated } from '@/features/businesses/api/queries'
import { extractNeighborhood } from '@/lib/format'
import { DetailNotFound, DetailError, DetailSkeleton } from '@/components/detail'
import { BusinessDetailView } from './detail-view'

export default function BusinessDetailPage() {
  const { slug = '' } = useParams()
  const { data: business, isLoading, isError, error, refetch } = useBusiness(slug)

  const categorySlug = business?.category?.slug
  const neighborhood = business ? extractNeighborhood(business.address) : null
  const relatedFilter = categorySlug ? { category: categorySlug } : neighborhood ? { neighborhood } : null

  const { data: relatedResult } = useQuery({
    queryKey: ['businesses', 'related', business?.id, relatedFilter],
    queryFn: () => fetchBusinessesPaginated({ ...relatedFilter, pageSize: 5 }),
    enabled: Boolean(relatedFilter && business?.id),
  })
  const related = (relatedResult?.data || []).filter((b) => b.id !== business?.id).slice(0, 4)

  if (isLoading) return <DetailSkeleton />

  if (isError) {
    if (error?.code === 'PGRST116') {
      return <DetailNotFound domainLabel="esta empresa" backTo="/empresas" backLabel="Ver empresas e serviços" />
    }
    return <DetailError message={error?.message} onRetry={() => refetch()} />
  }

  if (!business) return null

  return <BusinessDetailView business={business} related={related} />
}
