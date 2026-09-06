import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { ExternalLink, ListChecks, Sparkles } from 'lucide-react'
import { useBusiness } from '@/features/businesses/api/hooks'
import { fetchBusinessesPaginated } from '@/features/businesses/api/queries'
import { extractNeighborhood } from '@/lib/format'
import { Head } from '@/components/seo/head'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { BusinessCard } from '@/components/cards/business-card'
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

  const whatsappMessage = `Olá! Vi a ${business.name} no ConectaLapa e gostaria de mais informações.`

  return (
    <div className="space-y-6">
      <Head
        title={business.name}
        description={business.description || `${business.name} — ${business.category?.name || 'empresa'} em Bom Jesus da Lapa.`}
        image={business.logo_url}
        type="website"
      />

      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Início', to: '/' },
              { label: 'Empresas e Serviços', to: '/empresas' },
              { label: business.name },
            ]}
          />
        }
        title={
          <span className="flex items-center gap-3">
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover border border-border-hairline shrink-0 bg-bg-subtle"
              />
            ) : (
              <span
                className="w-12 h-12 rounded-lg bg-accent-subtle border border-border-hairline text-accent-text font-bold text-lg flex items-center justify-center shrink-0 uppercase select-none"
                aria-hidden="true"
              >
                {business.name.slice(0, 2)}
              </span>
            )}
            {business.name}
          </span>
        }
        description={
          <span className="flex flex-wrap items-center gap-2">
            {business.category && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {business.category.name}
              </span>
            )}
            {business.address && <span>{business.address}</span>}
          </span>
        }
      />

      <ContactActions
        whatsapp={business.whatsapp}
        whatsappMessage={whatsappMessage}
        instagram={business.instagram}
        address={business.address}
        shareTitle={business.name}
      />

      {business.description && (
        <DetailSection title="Sobre">
          <p className="whitespace-pre-line">{business.description}</p>
        </DetailSection>
      )}

      {business.services && business.services.length > 0 && (
        <DetailSection title="Serviços" icon={<ListChecks className="w-4 h-4" />}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            {business.services.map((service, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-accent-text shrink-0" aria-hidden="true" />
                {service}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {business.amenities.length > 0 && (
        <DetailSection title="Comodidades" icon={<Sparkles className="w-4 h-4" />}>
          <AmenityList amenities={business.amenities} />
        </DetailSection>
      )}

      {business.opening_hours.length > 0 && (
        <DetailSection title="Horário de funcionamento">
          <OpeningHours hours={business.opening_hours} />
        </DetailSection>
      )}

      {business.gallery.length > 0 && (
        <DetailSection title="Fotos">
          <Gallery images={business.gallery} entityName={business.name} />
        </DetailSection>
      )}

      {business.additional_links.length > 0 && (
        <DetailSection title="Outros links" icon={<ExternalLink className="w-4 h-4" />}>
          <ul className="space-y-2">
            {business.additional_links.map((link, i) => (
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
          whatsapp={business.whatsapp}
          whatsappMessage={whatsappMessage}
          instagram={business.instagram}
          address={business.address}
          shareTitle={business.name}
        />
      </DetailSection>

      <RelatedSection
        title={categorySlug ? 'Outras empresas nesta categoria' : 'Empresas na região'}
        hasItems={related.length > 0}
      >
        {related.map((b) => (
          <BusinessCard key={b.id} business={b} />
        ))}
      </RelatedSection>
    </div>
  )
}
