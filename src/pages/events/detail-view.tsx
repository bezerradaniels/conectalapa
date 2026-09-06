import { CalendarClock, ExternalLink, Info, Sparkles } from 'lucide-react'
import type { Event, EventWithRelations } from '@/types'
import { formatEventDateRange, getEventPriceDisplay } from '@/lib/format'
import { Head } from '@/components/seo/head'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { EventCard } from '@/components/cards/event-card'
import { optimizeImageUrl } from '@/lib/image-url'
import {
  ContactActions,
  Gallery,
  AmenityList,
  RestrictionsList,
  AddToCalendar,
  DetailSection,
  RelatedSection,
} from '@/components/detail'

const DEFAULT_DURATION_MS = 3 * 60 * 60 * 1000

export interface EventDetailViewProps {
  event: EventWithRelations
  related: Event[]
}

export function EventDetailView({ event, related }: EventDetailViewProps) {
  const categorySlug = event.category?.slug

  const now = new Date().getTime()
  const startMs = new Date(event.start_datetime).getTime()
  const endMs = event.end_datetime ? new Date(event.end_datetime).getTime() : startMs + DEFAULT_DURATION_MS
  const isPast = now > endMs

  const price = getEventPriceDisplay(event)
  const whatsappMessage = `Olá! Tenho interesse no evento "${event.name}" (${formatEventDateRange(event.start_datetime, event.end_datetime)}).`
  const address = event.address || event.venue_name

  return (
    <div className="space-y-6">
      <Head
        title={event.name}
        description={event.description || `${event.name} — ${formatEventDateRange(event.start_datetime, event.end_datetime)} em Bom Jesus da Lapa.`}
        image={event.promotional_image_url}
        type="article"
      />

      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Início', to: '/' },
              { label: 'Eventos', to: '/eventos' },
              { label: event.name },
            ]}
          />
        }
        title={event.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" size="sm">
              <CalendarClock className="w-3 h-3 mr-1" aria-hidden="true" />
              {formatEventDateRange(event.start_datetime, event.end_datetime)}
            </Badge>
            <Badge variant={price.kind === 'free' ? 'success' : price.kind === 'unannounced' ? 'neutral' : 'accent'} size="sm">
              {price.label}
            </Badge>
          </span>
        }
      />

      {isPast && (
        <div className="rounded-xl border border-border-hairline bg-bg-subtle px-4 py-3 text-sm font-medium text-text-secondary flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-text-muted" aria-hidden="true" />
          Este evento já aconteceu. As informações abaixo ficam disponíveis para referência.
        </div>
      )}

      {event.promotional_image_url && (
        <div
          className={`w-full overflow-hidden rounded-3xl bg-bg-subtle border border-black/[0.04] shadow-sm ${
            { '1:1': 'aspect-square', '4:5': 'aspect-4/5', '16:9': 'aspect-video' }[event.image_aspect_ratio || '16:9'] ||
            'aspect-video'
          }`}
        >
          <img
            src={optimizeImageUrl(event.promotional_image_url, 700) || undefined}
            alt={event.name}
            // Likely the LCP element on this page — never lazy-load it.
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <ContactActions
        whatsapp={event.whatsapp}
        whatsappMessage={whatsappMessage}
        instagram={event.instagram}
        address={address}
        shareTitle={event.name}
      />

      {!isPast && (
        <DetailSection title="Adicionar ao calendário">
          <AddToCalendar
            event={{
              uid: event.slug,
              title: event.name,
              description: event.description,
              location: address,
              start: event.start_datetime,
              end: event.end_datetime,
            }}
          />
        </DetailSection>
      )}

      {event.description && (
        <DetailSection title="Sobre o evento">
          <p className="whitespace-pre-line">{event.description}</p>
        </DetailSection>
      )}

      {event.restrictions && event.restrictions.length > 0 && (
        <DetailSection title="Restrições">
          <RestrictionsList restrictions={event.restrictions} />
        </DetailSection>
      )}

      {event.amenities.length > 0 && (
        <DetailSection title="O que o local oferece" icon={<Sparkles className="w-4 h-4" />}>
          <AmenityList amenities={event.amenities} />
        </DetailSection>
      )}

      {event.gallery.length > 0 && (
        <DetailSection title="Fotos">
          <Gallery images={event.gallery} entityName={event.name} />
        </DetailSection>
      )}

      {event.links.length > 0 && (
        <DetailSection title="Outros links" icon={<ExternalLink className="w-4 h-4" />}>
          <ul className="space-y-2">
            {event.links.map((link, i) => (
              <li key={i}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent-text font-medium hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      <DetailSection title="Fale conosco">
        <ContactActions
          whatsapp={event.whatsapp}
          whatsappMessage={whatsappMessage}
          instagram={event.instagram}
          address={address}
          shareTitle={event.name}
        />
      </DetailSection>

      <RelatedSection
        title={categorySlug ? 'Outros eventos nesta categoria' : 'Outros eventos na região'}
        hasItems={related.length > 0}
      >
        {related.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </RelatedSection>
    </div>
  )
}
