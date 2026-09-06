import { Sparkles } from 'lucide-react'
import type { Lodging, LodgingWithRelations, GalleryItem } from '@/types'
import { getLodgingTypeLabel } from '@/lib/format'
import { Head } from '@/components/seo/head'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { LodgingCard } from '@/components/cards/lodging-card'
import { ContactActions, Gallery, AmenityList, DetailSection, RelatedSection } from '@/components/detail'

export interface LodgingDetailViewProps {
  lodging: LodgingWithRelations
  related: (Lodging & { galleries?: GalleryItem[] })[]
}

export function LodgingDetailView({ lodging, related }: LodgingDetailViewProps) {
  const categorySlug = lodging.category?.slug
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
