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
import { LodgingCard, LodgingCardSkeleton } from '@/components/cards'
import { useLodgingPaginated, useLodgingFilterMeta } from '@/features/lodging/api/hooks'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

const lodgingParamsSchema = z.object({
  category: z.string().optional(),
  lodgingType: z.string().optional(),
  neighborhood: z.string().optional(),
  amenity: z.string().optional(),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  sort: z.enum(['name_asc', 'created_desc']).default('name_asc'),
  page: z.coerce.number().int().positive().default(1),
  search: z.string().optional(),
})

type LodgingParams = z.infer<typeof lodgingParamsSchema>

const DEFAULT_PARAMS: LodgingParams = {
  sort: 'name_asc',
  page: 1,
}

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Nome (A–Z)' },
  { value: 'created_desc', label: 'Mais recentes' },
]

const PRICE_RANGE_OPTIONS = [
  { value: '', label: 'Qualquer faixa' },
  { value: '$', label: '$ (Econômico)' },
  { value: '$$', label: '$$ (Moderado)' },
  { value: '$$$', label: '$$$ (Conforto / Alto padrão)' },
  { value: '$$$$', label: '$$$$ (Luxo / Premium)' },
]

export default function LodgingListPage() {
  const { params, setParam, setParams, clearParams } = useListingParams({
    schema: lodgingParamsSchema,
    defaultValues: DEFAULT_PARAMS,
  })

  const { data: meta } = useLodgingFilterMeta()

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useLodgingPaginated({
    category: params.category,
    lodgingType: params.lodgingType,
    neighborhood: params.neighborhood,
    amenity: params.amenity,
    priceRange: params.priceRange,
    search: params.search,
    sort: params.sort,
    page: params.page,
    pageSize: 12,
  })

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0
    if (params.category) count++
    if (params.lodgingType) count++
    if (params.neighborhood) count++
    if (params.amenity) count++
    if (params.priceRange) count++
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

    if (params.lodgingType && meta?.lodgingTypes) {
      const t = meta.lodgingTypes.find((x) => x.value === params.lodgingType)
      list.push({
        id: 'lodgingType',
        label: `Tipo: ${t?.label || params.lodgingType}`,
        onRemove: () => setParam('lodgingType', undefined),
      })
    }

    if (params.neighborhood) {
      list.push({
        id: 'neighborhood',
        label: `Bairro: ${params.neighborhood}`,
        onRemove: () => setParam('neighborhood', undefined),
      })
    }

    if (params.priceRange) {
      list.push({
        id: 'priceRange',
        label: `Faixa: ${params.priceRange}`,
        onRemove: () => setParam('priceRange', undefined),
      })
    }

    if (params.amenity && meta?.amenities) {
      const am = meta.amenities.find((a) => a.slug === params.amenity)
      list.push({
        id: 'amenity',
        label: am?.name || params.amenity,
        onRemove: () => setParam('amenity', undefined),
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

    if (params.search) {
      return (
        <ListingEmptyState
          type="search_empty"
          domainLabel="hospedagens"
          searchQuery={params.search}
          onClearFilters={() => setParam('search', undefined)}
        />
      )
    }

    if (activeCount > 0) {
      return (
        <ListingEmptyState
          type="filter_empty"
          domainLabel="hospedagens"
          activeFiltersCount={activeCount}
          onClearFilters={() => clearParams(['sort'])}
        />
      )
    }

    return (
      <ListingEmptyState
        type="domain_empty"
        domainLabel="hotéis e pousadas"
      />
    )
  }, [isLoading, isError, result, params.search, activeCount, setParam, clearParams])

  return (
    <ListingLayout
      title="Hotéis, Pousadas & Hospedagem"
      description="Encontre onde ficar em Bom Jesus da Lapa durante a romaria ou viagens a lazer e negócios."
      seoTitle="Onde Ficar em Bom Jesus da Lapa — ConectaLapa"
      breadcrumbs={[
        { label: 'Início', to: '/' },
        { label: 'Hospedagem' },
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
          domainTitle="Hospedagem"
        >
          {/* Search */}
          <div>
            <label htmlFor="lodg-search" className="block text-xs font-semibold text-text-primary mb-1">
              Buscar hotel ou pousada
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <Input
                id="lodg-search"
                type="search"
                placeholder="Ex: hotel santana, pousada..."
                value={params.search || ''}
                onChange={(e) => setParam('search', e.target.value || undefined)}
                className="pl-9 text-xs"
              />
            </div>
          </div>

          {/* Type filter */}
          <div>
            <label htmlFor="lodg-type" className="block text-xs font-semibold text-text-primary mb-1">
              Tipo de acomodação
            </label>
            <Select
              id="lodg-type"
              value={params.lodgingType || ''}
              onChange={(e) => setParam('lodgingType', e.target.value || undefined)}
              options={[
                { value: '', label: 'Todos os tipos' },
                ...(meta?.lodgingTypes || []).map((t) => ({ value: t.value, label: t.label })),
              ]}
              className="text-xs"
            />
          </div>

          {/* Neighborhood */}
          <div>
            <label htmlFor="lodg-neighborhood" className="block text-xs font-semibold text-text-primary mb-1">
              Bairro / Região
            </label>
            <Select
              id="lodg-neighborhood"
              value={params.neighborhood || ''}
              onChange={(e) => setParam('neighborhood', e.target.value || undefined)}
              options={[
                { value: '', label: 'Todos os bairros' },
                ...(meta?.neighborhoods || []).map((n) => ({ value: n, label: n })),
              ]}
              className="text-xs"
            />
          </div>

          {/* Features & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor="lodg-amenity" className="block text-xs font-semibold text-text-primary mb-1">
                Comodidades
              </label>
              <Select
                id="lodg-amenity"
                value={params.amenity || ''}
                onChange={(e) => setParam('amenity', e.target.value || undefined)}
                options={[
                  { value: '', label: 'Todas' },
                  ...(meta?.amenities || []).map((a) => ({ value: a.slug, label: a.name })),
                ]}
                className="text-xs"
              />
            </div>

            <div>
              <label htmlFor="lodg-price" className="block text-xs font-semibold text-text-primary mb-1">
                Faixa de preço
              </label>
              <Select
                id="lodg-price"
                value={params.priceRange || ''}
                onChange={(e) => setParam('priceRange', (e.target.value || undefined) as LodgingParams['priceRange'])}
                options={PRICE_RANGE_OPTIONS}
                className="text-xs"
              />
            </div>
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
          value={params.sort || 'name_asc'}
          onChange={(val) => setParam('sort', val as LodgingParams['sort'])}
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
              <LodgingCardSkeleton key={`lodg-skel-${idx}`} />
            ))
          : (result?.data || []).map((lodg) => (
              <LodgingCard key={lodg.id} lodging={lodg} />
            ))}
      </ResultsGrid>
    </ListingLayout>
  )
}
