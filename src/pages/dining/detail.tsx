import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Clock, Sparkles } from 'lucide-react'
import { useDiningDetail } from '@/features/dining/api/hooks'
import { fetchDiningPaginated } from '@/features/dining/api/queries'
import { extractNeighborhood, getRestaurantTypeLabel, getOpenStatus } from '@/lib/format'
import { Head } from '@/components/seo/head'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { DiningCard } from '@/components/cards/dining-card'
import {
  ContactActions,
  Gallery,
  OpeningHours,
  AmenityList,
  DetailSection,
  DetailNotFound,
  DetailError,
  DetailSkeleton,
  RelatedSection,
} from '@/components/detail'

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

  const typeLabel = getRestaurantTypeLabel(dining.restaurant_type, dining.category?.name)
  const openStatus = getOpenStatus(dining.opening_hours)
  const whatsappMessage = `Olá! Gostaria de fazer uma reserva/pedido no ${dining.name}.`

  return (
    <div className="space-y-6">
      <Head
        title={dining.name}
        description={dining.description || `${dining.name} — ${typeLabel} em Bom Jesus da Lapa.`}
        image={dining.gallery[0]?.image_url}
      />

      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Início', to: '/' },
              { label: 'Gastronomia', to: '/gastronomia' },
              { label: dining.name },
            ]}
          />
        }
        title={dining.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral" size="sm">
              {typeLabel}
            </Badge>
            {dining.price_range && (
              <Badge variant="accent" size="sm" className="font-bold">
                {dining.price_range}
              </Badge>
            )}
            {openStatus && (
              <Badge variant={openStatus.isOpen ? 'success' : 'neutral'} size="sm">
                <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                {openStatus.label}
              </Badge>
            )}
            {dining.address && <span>{dining.address}</span>}
          </span>
        }
      />

      <ContactActions
        whatsapp={dining.whatsapp}
        whatsappMessage={whatsappMessage}
        instagram={dining.instagram}
        address={dining.address}
        shareTitle={dining.name}
      />

      {dining.gallery.length > 0 && (
        <DetailSection title="Fotos">
          <Gallery images={dining.gallery} entityName={dining.name} />
        </DetailSection>
      )}

      {dining.description && (
        <DetailSection title="Sobre">
          <p className="whitespace-pre-line">{dining.description}</p>
        </DetailSection>
      )}

      {dining.amenities.length > 0 && (
        <DetailSection title="Comodidades" icon={<Sparkles className="w-4 h-4" />}>
          <AmenityList amenities={dining.amenities} />
        </DetailSection>
      )}

      {dining.opening_hours.length > 0 && (
        <DetailSection title="Horário de funcionamento">
          <OpeningHours hours={dining.opening_hours} />
        </DetailSection>
      )}

      <DetailSection title="Fale conosco">
        <ContactActions
          whatsapp={dining.whatsapp}
          whatsappMessage={whatsappMessage}
          instagram={dining.instagram}
          address={dining.address}
          shareTitle={dining.name}
        />
      </DetailSection>

      <RelatedSection
        title={categorySlug ? 'Outros restaurantes nesta categoria' : 'Outros restaurantes na região'}
        hasItems={related.length > 0}
      >
        {related.map((d) => (
          <DiningCard key={d.id} dining={d} />
        ))}
      </RelatedSection>
    </div>
  )
}
