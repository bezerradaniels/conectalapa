import { useMemo } from 'react'
import { z } from 'zod'
import { Search } from 'lucide-react'
import {
  ListingLayout,
  FilterBar,
  FilterChips,
  SortSelect,
  Pagination,
  ResultsGrid,
  ListingEmptyState,
  useListingParams,
  type FilterChip,
} from '@/components/listing'
import { PackageCard, PackageCardSkeleton } from '@/components/cards'
import { usePackagesPaginated, usePackageFilterMeta } from '@/features/packages/api/hooks'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

const packageParamsSchema = z.object({
  category: z.string().optional(),
  destination: z.string().optional(),
  departureMonth: z.string().optional(),
  priceRange: z.enum(['under_1000', '1000_1500', 'above_1500']).optional(),
  agency: z.string().optional(),
  sort: z.enum(['soonest', 'price_asc', 'price_desc']).default('soonest'),
  page: z.coerce.number().int().positive().default(1),
  search: z.string().optional(),
})

type PackageParams = z.infer<typeof packageParamsSchema>

const DEFAULT_PARAMS: PackageParams = {
  sort: 'soonest',
  page: 1,
}

const SORT_OPTIONS = [
  { value: 'soonest', label: 'Saída mais próxima' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
]

const PRICE_RANGE_OPTIONS = [
  { value: '', label: 'Qualquer valor' },
  { value: 'under_1000', label: 'Até R$ 1.000' },
  { value: '1000_1500', label: 'R$ 1.000 a R$ 1.500' },
  { value: 'above_1500', label: 'Acima de R$ 1.500' },
]

export default function PackageListPage() {
  const { params, setParam, setParams, clearParams } = useListingParams({
    schema: packageParamsSchema,
    defaultValues: DEFAULT_PARAMS,
  })

  const { data: meta } = usePackageFilterMeta()

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = usePackagesPaginated({
    category: params.category,
    destination: params.destination,
    departureMonth: params.departureMonth,
    priceRange: params.priceRange,
    agency: params.agency,
    search: params.search,
    sort: params.sort,
    page: params.page,
    pageSize: 12,
  })

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0
    if (params.category) count++
    if (params.destination) count++
    if (params.departureMonth) count++
    if (params.priceRange) count++
    if (params.agency) count++
    if (params.search) count++
    return count
  }, [params])

  // Active chips
  const chips = useMemo<FilterChip[]>(() => {
    const list: FilterChip[] = []

    if (params.search) {
      list.push({
        id: 'search',
        label: `Busca: "${params.search}"`,
        onRemove: () => setParam('search', undefined),
      })
    }

    if (params.destination) {
      list.push({
        id: 'destination',
        label: `Destino: ${params.destination}`,
        onRemove: () => setParam('destination', undefined),
      })
    }

    if (params.departureMonth && meta?.departureMonths) {
      const m = meta.departureMonths.find((x) => x.value === params.departureMonth)
      list.push({
        id: 'departureMonth',
        label: `Mês: ${m?.label || params.departureMonth}`,
        onRemove: () => setParam('departureMonth', undefined),
      })
    }

    if (params.priceRange) {
      const p = PRICE_RANGE_OPTIONS.find((x) => x.value === params.priceRange)
      list.push({
        id: 'priceRange',
        label: p?.label || params.priceRange,
        onRemove: () => setParam('priceRange', undefined),
      })
    }

    if (params.agency && meta?.agencies) {
      const ag = meta.agencies.find((x) => x.id === params.agency || x.name === params.agency)
      list.push({
        id: 'agency',
        label: `Agência: ${ag?.name || params.agency}`,
        onRemove: () => setParam('agency', undefined),
      })
    }

    if (params.category && meta?.categories) {
      const cat = meta.categories.find((c) => c.slug === params.category)
      list.push({
        id: 'category',
        label: cat?.name || params.category,
        onRemove: () => setParam('category', undefined),
      })
    }

    return list
  }, [params, meta, setParam])

  // Empty state
  const emptyState = useMemo(() => {
    if (isLoading || isError || !result || result.data.length > 0) {
      return null
    }

    if (params.search || params.destination) {
      return (
        <ListingEmptyState
          type="search_empty"
          domainLabel="pacotes de viagem"
          searchQuery={params.search || params.destination}
          onClearFilters={() => setParams({ search: undefined, destination: undefined })}
        />
      )
    }

    if (activeCount > 0) {
      return (
        <ListingEmptyState
          type="filter_empty"
          domainLabel="pacotes de viagem"
          activeFiltersCount={activeCount}
          onClearFilters={() => clearParams(['sort'])}
        />
      )
    }

    return (
      <ListingEmptyState
        type="domain_empty"
        domainLabel="pacotes turísticos"
      />
    )
  }, [isLoading, isError, result, params.search, params.destination, activeCount, setParams, clearParams])

  return (
    <ListingLayout
      title="Pacotes de Viagem & Excursões"
      description="Roteiros turísticos, viagens rodoviárias e passeios saindo de Bom Jesus da Lapa."
      seoTitle="Pacotes de Viagem saindo de Bom Jesus da Lapa — ConectaLapa"
      breadcrumbs={[
        { label: 'Início', to: '/' },
        { label: 'Pacotes de Viagem' },
      ]}
      totalCount={result?.count}
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message}
      onRetry={() => refetch()}
      filterBar={
        <FilterBar
          activeCount={activeCount}
          onClearAll={() => clearParams(['sort'])}
          totalResults={result?.count}
          domainTitle="Pacotes"
        >
          {/* Destination */}
          <div>
            <label htmlFor="pkg-dest" className="block text-xs font-semibold text-text-primary mb-1">
              Destino
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <Input
                id="pkg-dest"
                type="search"
                placeholder="Ex: Porto Seguro, Salvador..."
                value={params.destination || params.search || ''}
                onChange={(e) => setParam('destination', e.target.value || undefined)}
                className="pl-9 text-xs"
              />
            </div>
          </div>

          {/* Departure month */}
          <div>
            <label htmlFor="pkg-month" className="block text-xs font-semibold text-text-primary mb-1">
              Mês de saída
            </label>
            <Select
              id="pkg-month"
              value={params.departureMonth || ''}
              onChange={(e) => setParam('departureMonth', e.target.value || undefined)}
              options={[
                { value: '', label: 'Todos os meses' },
                ...(meta?.departureMonths || []).map((m) => ({ value: m.value, label: m.label })),
              ]}
              className="text-xs"
            />
          </div>

          {/* Price range */}
          <div>
            <label htmlFor="pkg-price" className="block text-xs font-semibold text-text-primary mb-1">
              Faixa de preço
            </label>
            <Select
              id="pkg-price"
              value={params.priceRange || ''}
              onChange={(e) => setParam('priceRange', (e.target.value || undefined) as PackageParams['priceRange'])}
              options={PRICE_RANGE_OPTIONS}
              className="text-xs"
            />
          </div>

          {/* Agency */}
          <div>
            <label htmlFor="pkg-agency" className="block text-xs font-semibold text-text-primary mb-1">
              Agência organizadora
            </label>
            <Select
              id="pkg-agency"
              value={params.agency || ''}
              onChange={(e) => setParam('agency', e.target.value || undefined)}
              options={[
                { value: '', label: 'Todas as agências' },
                ...(meta?.agencies || []).map((ag) => ({ value: ag.id, label: ag.name })),
              ]}
              className="text-xs"
            />
          </div>
        </FilterBar>
      }
      filterChips={
        <FilterChips
          chips={chips}
          onClearAll={() => clearParams(['sort'])}
        />
      }
      sortSelect={
        <SortSelect
          value={params.sort || 'soonest'}
          onChange={(val) => setParam('sort', val as PackageParams['sort'])}
          options={SORT_OPTIONS}
        />
      }
      emptyState={emptyState}
      pagination={
        result && result.totalPages > 1 ? (
          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
            totalCount={result.count}
            pageSize={result.pageSize}
            onPageChange={(p) => setParams({ page: p }, { resetPage: false })}
          />
        ) : null
      }
    >
      <ResultsGrid columns={3}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <PackageCardSkeleton key={`pkg-skel-${idx}`} />
            ))
          : (result?.data || []).map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
      </ResultsGrid>
    </ListingLayout>
  )
}
