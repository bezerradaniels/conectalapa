import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { Building2, CalendarDays, Clock, Info, MapPin, Sparkles } from 'lucide-react'
import { usePackage } from '@/features/packages/api/hooks'
import { fetchPackagesPaginated } from '@/features/packages/api/queries'
import { formatDepartureDate, formatCurrency, calculateDurationDays } from '@/lib/format'
import { Head } from '@/components/seo/head'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Badge } from '@/components/ui/badge'
import { PackageCard } from '@/components/cards/package-card'
import {
  ContactActions,
  AmenityList,
  DetailSection,
  DetailNotFound,
  DetailError,
  DetailSkeleton,
  RelatedSection,
} from '@/components/detail'

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

  const agencyName = pkg.agency?.name || pkg.agency_name || 'Agência local'
  const agencyWhatsapp = pkg.agency_whatsapp || pkg.agency?.whatsapp
  const departureFormatted = formatDepartureDate(pkg.departure_date)
  const returnFormatted = formatDepartureDate(pkg.return_date)
  const durationDays = calculateDurationDays(pkg.departure_date, pkg.return_date)

  // The single most valuable detail for the agency: enough context to skip
  // the back-and-forth and answer immediately.
  const whatsappMessage = `Olá, tenho interesse no pacote para ${pkg.destination} saindo dia ${departureFormatted}.`

  return (
    <div className="space-y-6">
      <Head
        title={`Pacote para ${pkg.destination}`}
        description={pkg.information || `Pacote de viagem para ${pkg.destination}, saindo de ${pkg.departure_location}.`}
        image={pkg.image_url}
      />

      <PageHeader
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Início', to: '/' },
              { label: 'Pacotes', to: '/pacotes' },
              { label: pkg.destination },
            ]}
          />
        }
        title={`Pacote para ${pkg.destination}`}
        description={
          <span className="flex flex-wrap items-center gap-2">
            {pkg.category && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {pkg.category.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-sm text-text-secondary">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              Saída de {pkg.departure_location}
            </span>
          </span>
        }
      />

      {pkg.image_url && (
        <div className="w-full aspect-16/9 overflow-hidden rounded-2xl bg-bg-subtle border border-border-hairline">
          <img src={pkg.image_url} alt={`Pacote para ${pkg.destination}`} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent" size="md">
          <CalendarDays className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
          {departureFormatted} – {returnFormatted}
        </Badge>
        {durationDays && (
          <Badge variant="neutral" size="md">
            <Clock className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
            {durationDays} {durationDays === 1 ? 'dia' : 'dias'}
          </Badge>
        )}
        <span className="ml-auto text-right">
          <span className="block text-xs text-text-muted">A partir de</span>
          <span className="block text-xl font-bold text-text-primary">{formatCurrency(pkg.price)}</span>
        </span>
      </div>

      <div className="rounded-xl border border-border-hairline bg-bg-surface p-4 flex items-center gap-3">
        <span className="w-10 h-10 rounded-lg bg-accent-subtle border border-border-hairline text-accent-text flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <span className="block text-xs text-text-muted">Agência responsável</span>
          {pkg.agency?.slug ? (
            <Link to={`/empresas/${pkg.agency.slug}`} className="font-semibold text-text-primary hover:text-accent-text hover:underline truncate block">
              {agencyName}
            </Link>
          ) : (
            <span className="font-semibold text-text-primary truncate block">{agencyName}</span>
          )}
        </div>
      </div>

      <ContactActions whatsapp={agencyWhatsapp} whatsappMessage={whatsappMessage} shareTitle={`Pacote para ${pkg.destination}`} />

      {pkg.amenities.length > 0 && (
        <DetailSection title="O que está incluso" icon={<Sparkles className="w-4 h-4" />}>
          <AmenityList amenities={pkg.amenities} />
        </DetailSection>
      )}

      {pkg.information && (
        <DetailSection title="Informações" icon={<Info className="w-4 h-4" />}>
          <p className="whitespace-pre-line">{pkg.information}</p>
        </DetailSection>
      )}

      <DetailSection title="Fale com a agência">
        <ContactActions whatsapp={agencyWhatsapp} whatsappMessage={whatsappMessage} shareTitle={`Pacote para ${pkg.destination}`} />
      </DetailSection>

      <RelatedSection title="Outros pacotes" hasItems={related.length > 0}>
        {related.map((p) => (
          <PackageCard key={p.id} pkg={p} />
        ))}
      </RelatedSection>
    </div>
  )
}
