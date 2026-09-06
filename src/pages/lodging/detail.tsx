import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useLodgingDetail } from '@/features/lodging/api/hooks'
import { fetchLodgingPaginated } from '@/features/lodging/api/queries'
import { extractNeighborhood, getLodgingTypeLabel } from '@/lib/format'
import { Head } from '@/components/seo/head'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { LodgingCard } from '@/components/cards/lodging-card'
import {
  ContactActions,
  Gallery,
  AmenityList,
  DetailSection,
  DetailNotFound,
  DetailError,
  DetailSkeleton,
  RelatedSection,
} from '@/components/detail'

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

  const typeLabel = getLodgingTypeLabel(lodging.lodging_type, lodging.category?.name)
  const whatsappMessage = `Olá! Vi a ${lodging.name} no ConectaLapa e gostaria de saber sobre disponibilidade e valores.`

  return (
    <div className="space-y-6">
      <Head
        title={lodging.name}
        description={lodging.description || `${lodging.name} — ${typeLabel} em Bom Jesus da Lapa.`}
        image={lodging.gallery[0]?.image_url}
      />

      <Breadcrumbs
        items={[
          { label: 'Início', to: '/' },
          { label: 'Hospedagem', to: '/hospedagem' },
          { label: lodging.name },
        ]}
      />

      <Gallery images={lodging.gallery} entityName={lodging.name} />

      <PageHeader
        title={lodging.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral" size="sm">
              {typeLabel}
            </Badge>
            {lodging.price_range && (
              <Badge variant="accent" size="sm" className="font-bold">
                {lodging.price_range}
              </Badge>
            )}
            {lodging.address && <span>{lodging.address}</span>}
          </span>
        }
      />

      <ContactActions
        whatsapp={lodging.whatsapp}
        whatsappMessage={whatsappMessage}
        instagram={lodging.instagram}
        address={lodging.address}
        shareTitle={lodging.name}
      />

      {lodging.description && (
        <DetailSection title="Sobre">
          <p className="whitespace-pre-line">{lodging.description}</p>
        </DetailSection>
      )}

      {lodging.amenities.length > 0 && (
        <DetailSection title="Comodidades" icon={<Sparkles className="w-4 h-4" />}>
          <AmenityList amenities={lodging.amenities} />
        </DetailSection>
      )}

      <DetailSection title="Fale conosco">
        <ContactActions
          whatsapp={lodging.whatsapp}
          whatsappMessage={whatsappMessage}
          instagram={lodging.instagram}
          address={lodging.address}
          shareTitle={lodging.name}
        />
      </DetailSection>

      <RelatedSection
        title={categorySlug ? 'Outras hospedagens nesta categoria' : 'Outras hospedagens na região'}
        hasItems={related.length > 0}
      >
        {related.map((l) => (
          <LodgingCard key={l.id} lodging={l} />
        ))}
      </RelatedSection>
    </div>
  )
}
