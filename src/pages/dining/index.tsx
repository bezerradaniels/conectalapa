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
import { DiningCard, DiningCardSkeleton } from '@/components/cards'
import { useDiningPaginated, useDiningFilterMeta } from '@/features/dining/api/hooks'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

const diningParamsSchema = z.object({
  category: z.string().optional(),
  restaurantType: z.string().optional(),
  neighborhood: z.string().optional(),
  amenity: z.string().optional(),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  openNow: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  sort: z.enum(['name_asc', 'created_desc']).default('name_asc'),
  page: z.coerce.number().int().positive().default(1),
  search: z.string().optional(),
})

type DiningParams = z.infer<typeof diningParamsSchema>

const DEFAULT_PARAMS: DiningParams = {
  sort: 'name_asc',
  page: 1,
  openNow: false,
}

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Nome (A–Z)' },
  { value: 'created_desc', label: 'Mais recentes' },
]

const PRICE_RANGE_OPTIONS = [
  { value: '', label: 'Qualquer faixa' },
  { value: '$', label: '$ (Econômico)' },
  { value: '$$', label: '$$ (Moderado)' },
  { value: '$$$', label: '$$$ (Sofisticado)' },
  { value: '$$$$', label: '$$$$ (Alta gastronomia)' },
]

export default function DiningListPage() {
  const { params, setParam, setParams, clearParams } = useListingParams({
    schema: diningParamsSchema,
    defaultValues: DEFAULT_PARAMS,
  })

  const { data: meta } = useDiningFilterMeta()

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useDiningPaginated({
    category: params.category,
    restaurantType: params.restaurantType,
    neighborhood: params.neighborhood,
    amenity: params.amenity,
    priceRange: params.priceRange,
    openNow: params.openNow,
    search: params.search,
    sort: params.sort,
    page: params.page,
    pageSize: 12,
  })

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0
    if (params.category) count++
    if (params.restaurantType) count++
    if (params.neighborhood) count++
    if (params.amenity) count++
    if (params.priceRange) count++
    if (params.openNow) count++
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

    if (params.restaurantType && meta?.restaurantTypes) {
      const t = meta.restaurantTypes.find((x) => x.value === params.restaurantType)
      list.push({
        id: 'restaurantType',
        label: `Tipo: ${t?.label || params.restaurantType}`,
        onRemove: () => setParam('restaurantType', undefined),
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

    if (params.openNow) {
      list.push({
        id: 'openNow',
        label: 'Aberto agora',
        onRemove: () => setParam('openNow', false),
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
          domainLabel="restaurantes"
          searchQuery={params.search}
          onClearFilters={() => setParam('search', undefined)}
        />
      )
    }

    if (activeCount > 0) {
      return (
        <ListingEmptyState
          type="filter_empty"
          domainLabel="gastronomia"
          activeFiltersCount={activeCount}
          onClearFilters={() => clearParams(['sort'])}
        />
      )
    }

    return (
      <ListingEmptyState
        type="domain_empty"
        domainLabel="restaurantes e bares"
      />
    )
  }, [isLoading, isError, result, params.search, activeCount, setParam, clearParams])

  return (
    <ListingLayout
      title="Gastronomia & Onde Comer"
      description="Churrascarias, peixarias na orla do Rio São Francisco, pizzarias, cafés e culinária regional."
      seoTitle="Restaurantes e Gastronomia em Bom Jesus da Lapa — ConectaLapa"
      breadcrumbs={[
        { label: 'Início', to: '/' },
        { label: 'Gastronomia' },
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
          domainTitle="Gastronomia"
        >
          {/* Search */}
          <div>
            <label htmlFor="din-search" className="block text-xs font-semibold text-text-primary mb-1">
              Buscar restaurante ou prato
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <Input
                id="din-search"
                type="search"
                placeholder="Ex: peixe, churrasco, pizza..."
                value={params.search || ''}
                onChange={(e) => setParam('search', e.target.value || undefined)}
                className="pl-9 text-xs"
              />
            </div>
          </div>

          {/* Type / Cuisine */}
          <div>
            <label htmlFor="din-type" className="block text-xs font-semibold text-text-primary mb-1">
              Especialidade / Cozinha
            </label>
            <Select
              id="din-type"
              value={params.restaurantType || ''}
              onChange={(e) => setParam('restaurantType', e.target.value || undefined)}
              options={[
                { value: '', label: 'Todas as cozinhas' },
                ...(meta?.restaurantTypes || []).map((t) => ({ value: t.value, label: t.label })),
              ]}
              className="text-xs"
            />
          </div>

          {/* Neighborhood */}
          <div>
            <label htmlFor="din-neighborhood" className="block text-xs font-semibold text-text-primary mb-1">
              Bairro / Região
            </label>
            <Select
              id="din-neighborhood"
              value={params.neighborhood || ''}
              onChange={(e) => setParam('neighborhood', e.target.value || undefined)}
              options={[
                { value: '', label: 'Todos os bairros' },
                ...(meta?.neighborhoods || []).map((n) => ({ value: n, label: n })),
              ]}
              className="text-xs"
            />
          </div>

          {/* Amenities & Open Now */}
          <div className="space-y-2">
            <div>
              <label htmlFor="din-amenity" className="block text-xs font-semibold text-text-primary mb-1">
                Comodidades
              </label>
              <Select
                id="din-amenity"
                value={params.amenity || ''}
                onChange={(e) => setParam('amenity', e.target.value || undefined)}
                options={[
                  { value: '', label: 'Todas' },
                  ...(meta?.amenities || []).map((a) => ({ value: a.slug, label: a.name })),
                ]}
                className="text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(params.openNow)}
                  onChange={(e) => setParam('openNow', e.target.checked ? true : false)}
                  className="w-4 h-4 rounded border-border-hairline text-accent focus:ring-accent"
                />
                <span className="text-xs font-medium text-text-primary select-none">
                  Aberto agora
                </span>
              </label>

              {/* Price range select */}
              <Select
                id="din-price"
                value={params.priceRange || ''}
                onChange={(e) => setParam('priceRange', (e.target.value || undefined) as DiningParams['priceRange'])}
                options={PRICE_RANGE_OPTIONS}
                className="text-2xs w-28 py-1"
                aria-label="Faixa de preço"
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
          onChange={(val) => setParam('sort', val as DiningParams['sort'])}
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
              <DiningCardSkeleton key={`din-skel-${idx}`} />
            ))
          : (result?.data || []).map((din) => (
              <DiningCard key={din.id} dining={din} />
            ))}
      </ResultsGrid>
    </ListingLayout>
  )
}
