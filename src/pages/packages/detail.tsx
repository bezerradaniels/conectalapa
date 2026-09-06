import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { usePackage } from '@/features/packages/api/hooks'
import { fetchPackagesPaginated } from '@/features/packages/api/queries'
import { DetailNotFound, DetailError, DetailSkeleton } from '@/components/detail'
import { PackageDetailView } from './detail-view'

export default function PackageDetailPage() {
  const { slug = '' } = useParams()
  const { data: pkg, isLoading, isError, error, refetch } = usePackage(slug)

  const categorySlug = pkg?.category?.slug

  const { data: relatedResult } = useQuery({
    queryKey: ['packages', 'related', pkg?.id, categorySlug],
    queryFn: () => fetchPackagesPaginated({ category: categorySlug, pageSize: 5 }),
    enabled: Boolean(categorySlug && pkg?.id),
  })
  const related = (relatedResult?.data || []).filter((p) => p.id !== pkg?.id).slice(0, 4)

  if (isLoading) return <DetailSkeleton />

  if (isError) {
    if (error?.code === 'PGRST116') {
      return <DetailNotFound domainLabel="este pacote" backTo="/pacotes" backLabel="Ver pacotes" />
    }
    return <DetailError message={error?.message} onRetry={() => refetch()} />
  }

  if (!pkg) return null

  return <PackageDetailView pkg={pkg} related={related} />
}
