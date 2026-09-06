import { Clock, Sparkles } from 'lucide-react'
import type { Dining, DiningWithRelations, GalleryItem } from '@/types'
import { getRestaurantTypeLabel, getOpenStatus } from '@/lib/format'
import { Head } from '@/components/seo/head'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { DiningCard } from '@/components/cards/dining-card'
import { ContactActions, Gallery, OpeningHours, AmenityList, DetailSection, RelatedSection } from '@/components/detail'

export interface DiningDetailViewProps {
  dining: DiningWithRelations
  related: (Dining & { galleries?: GalleryItem[] })[]
}

export function DiningDetailView({ dining, related }: DiningDetailViewProps) {
  const categorySlug = dining.category?.slug
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
