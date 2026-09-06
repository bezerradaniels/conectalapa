import { useMemo } from 'react'
import { z } from 'zod'
import { Search, CalendarDays } from 'lucide-react'
import {
  ListingLayout,
  FilterBar,
  FilterChips,
  SortSelect,
  Pagination,
  ListingEmptyState,
  useListingParams,
  type FilterChip,
} from '@/components/listing'
import { EventCard, EventCardSkeleton } from '@/components/cards'
import { useEventsPaginated, useEventFilterMeta } from '@/features/events/api/hooks'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { Event } from '@/types'

const eventParamsSchema = z.object({
  category: z.string().optional(),
  datePreset: z.enum(['todos', 'hoje', 'fim_de_semana', 'este_mes']).default('todos'),
  priceType: z.enum(['all', 'free', 'paid']).default('all'),
  maxPrice: z.coerce.number().optional(),
  neighborhood: z.string().optional(),
  amenity: z.string().optional(),
  includePast: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  sort: z.enum(['soonest', 'created_desc']).default('soonest'),
  page: z.coerce.number().int().positive().default(1),
  search: z.string().optional(),
})

type EventParams = z.infer<typeof eventParamsSchema>

const DEFAULT_PARAMS: EventParams = {
  datePreset: 'todos',
  priceType: 'all',
  sort: 'soonest',
  page: 1,
  includePast: false,
}

const SORT_OPTIONS = [
  { value: 'soonest', label: 'Mais próximos' },
  { value: 'created_desc', label: 'Mais recentes' },
]

const DATE_PRESETS: { value: EventParams['datePreset']; label: string }[] = [
  { value: 'todos', label: 'Todas as datas' },
  { value: 'hoje', label: 'Hoje' },
  { value: 'fim_de_semana', label: 'Fim de semana' },
  { value: 'este_mes', label: 'Este mês' },
]

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function EventListPage() {
  const { params, setParam, setParams, clearParams } = useListingParams({
    schema: eventParamsSchema,
    defaultValues: DEFAULT_PARAMS,
  })

  const { data: meta } = useEventFilterMeta()

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useEventsPaginated({
    category: params.category,
    datePreset: params.datePreset,
    priceType: params.priceType,
    maxPrice: params.maxPrice,
    neighborhood: params.neighborhood,
    amenity: params.amenity,
    includePast: params.includePast,
    search: params.search,
    sort: params.sort,
    page: params.page,
    pageSize: 12,
  })

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0
    if (params.category) count++
    if (params.datePreset && params.datePreset !== 'todos') count++
    if (params.priceType && params.priceType !== 'all') count++
    if (params.maxPrice) count++
    if (params.neighborhood) count++
    if (params.amenity) count++
    if (params.includePast) count++
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

    if (params.datePreset && params.datePreset !== 'todos') {
      const p = DATE_PRESETS.find((x) => x.value === params.datePreset)
      list.push({
        id: 'datePreset',
        label: p?.label || params.datePreset,
        onRemove: () => setParam('datePreset', 'todos'),
      })
    }

    if (params.priceType === 'free') {
      list.push({
        id: 'priceType',
        label: 'Apenas Gratuitos',
        onRemove: () => setParam('priceType', 'all'),
      })
    } else if (params.priceType === 'paid') {
      list.push({
        id: 'priceType',
        label: 'Apenas Pagos',
        onRemove: () => setParam('priceType', 'all'),
      })
    }

    if (params.maxPrice) {
      list.push({
        id: 'maxPrice',
        label: `Até R$ ${params.maxPrice}`,
        onRemove: () => setParam('maxPrice', undefined),
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

    if (params.neighborhood) {
      list.push({
        id: 'neighborhood',
        label: `Local: ${params.neighborhood}`,
        onRemove: () => setParam('neighborhood', undefined),
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

    if (params.includePast) {
      list.push({
        id: 'includePast',
        label: 'Incluindo eventos passados',
        onRemove: () => setParam('includePast', false),
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
          domainLabel="eventos"
          searchQuery={params.search}
          onClearFilters={() => setParam('search', undefined)}
        />
      )
    }

    if (activeCount > 0) {
      return (
        <ListingEmptyState
          type="filter_empty"
          domainLabel="eventos"
          activeFiltersCount={activeCount}
          onClearFilters={() => clearParams(['sort'])}
        />
      )
    }

    return (
      <ListingEmptyState
        type="domain_empty"
        domainLabel="eventos"
      />
    )
  }, [isLoading, isError, result, params.search, activeCount, setParam, clearParams])

  // Chronological grouping: Group events by Year-Month for intuitive scanning
  const dateGroups = useMemo(() => {
    if (!result?.data || result.data.length === 0) return []

    const groups: { title: string; events: Event[] }[] = []
    const groupMap = new Map<string, Event[]>()

    for (const ev of result.data) {
      const date = new Date(ev.start_datetime)
      const groupKey = `${date.getFullYear()}-${date.getMonth()}`
      const groupTitle = `${MONTH_NAMES[date.getMonth()]} de ${date.getFullYear()}`

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, [])
        groups.push({ title: groupTitle, events: groupMap.get(groupKey)! })
      }
      groupMap.get(groupKey)!.push(ev)
    }

    return groups
  }, [result])

  return (
    <ListingLayout
      title="Eventos & Romaria"
      description="Festividades religiosas, shows, festivais culturais e datas comemorativas em Bom Jesus da Lapa."
      seoTitle="Agenda de Eventos e Romarias — ConectaLapa"
      breadcrumbs={[
        { label: 'Início', to: '/' },
        { label: 'Eventos' },
      ]}
      totalCount={result?.count}
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message}
      onRetry={() => refetch()}
      filterBar={
        <div className="space-y-3">
          {/* Quick Date Presets Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-text-muted flex items-center gap-1 shrink-0 mr-1">
              <CalendarDays className="w-3.5 h-3.5 text-accent-text" aria-hidden="true" />
              Período:
            </span>
            {DATE_PRESETS.map((preset) => {
              const active = (params.datePreset || 'todos') === preset.value
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setParam('datePreset', preset.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accent ${
                    active
                      ? 'bg-accent text-accent-fg shadow-xs font-semibold'
                      : 'bg-bg-surface text-text-primary border border-border-hairline hover:bg-bg-subtle'
                  }`}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>

          <FilterBar
            activeCount={activeCount}
            onClearAll={() => clearParams(['sort'])}
            totalResults={result?.count}
            domainTitle="Eventos"
          >
            {/* Search */}
            <div>
              <label htmlFor="ev-search" className="block text-xs font-semibold text-text-primary mb-1">
                Buscar evento
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
                <Input
                  id="ev-search"
                  type="search"
                  placeholder="Ex: romaria, festival..."
                  value={params.search || ''}
                  onChange={(e) => setParam('search', e.target.value || undefined)}
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="ev-category" className="block text-xs font-semibold text-text-primary mb-1">
                Tipo de evento
              </label>
              <Select
                id="ev-category"
                value={params.category || ''}
                onChange={(e) => setParam('category', e.target.value || undefined)}
                options={[
                  { value: '', label: 'Todas as categorias' },
                  ...(meta?.categories || []).map((c) => ({ value: c.slug, label: c.name })),
                ]}
                className="text-xs"
              />
            </div>

            {/* Free vs Paid */}
            <div>
              <label htmlFor="ev-price" className="block text-xs font-semibold text-text-primary mb-1">
                Entrada / Ingresso
              </label>
              <Select
                id="ev-price"
                value={params.priceType || 'all'}
                onChange={(e) => setParam('priceType', e.target.value as EventParams['priceType'])}
                options={[
                  { value: 'all', label: 'Gratuitos e Pagos' },
                  { value: 'free', label: 'Apenas Gratuitos' },
                  { value: 'paid', label: 'Apenas Pagos' },
                ]}
                className="text-xs"
              />
            </div>

            {/* Neighborhood / Venue & Include Past */}
            <div className="space-y-2">
              <div>
                <label htmlFor="ev-neighborhood" className="block text-xs font-semibold text-text-primary mb-1">
                  Local / Bairro
                </label>
                <Select
                  id="ev-neighborhood"
                  value={params.neighborhood || ''}
                  onChange={(e) => setParam('neighborhood', e.target.value || undefined)}
                  options={[
                    { value: '', label: 'Todos os locais' },
                    ...(meta?.neighborhoods || []).map((n) => ({ value: n, label: n })),
                  ]}
                  className="text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={Boolean(params.includePast)}
                  onChange={(e) => setParam('includePast', e.target.checked ? true : false)}
                  className="w-4 h-4 rounded border-border-hairline text-accent focus:ring-accent"
                />
                <span className="text-xs font-medium text-text-muted select-none">
                  Exibir eventos encerrados
                </span>
              </label>
            </div>
          </FilterBar>
        </div>
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
          onChange={(val) => setParam('sort', val as EventParams['sort'])}
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
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <EventCardSkeleton key={`ev-skel-${idx}`} />
          ))}
        </div>
      ) : (
        /* Chronological date grouping layout */
        <div className="space-y-8">
          {dateGroups.map((group) => (
            <section key={group.title} aria-labelledby={`heading-${group.title}`} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border-hairline">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" aria-hidden="true" />
                <h2 id={`heading-${group.title}`} className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  {group.title}
                </h2>
                <span className="text-xs font-semibold text-text-muted">
                  ({group.events.length} {group.events.length === 1 ? 'evento' : 'eventos'})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {group.events.map((ev) => (
                  <EventCard key={ev.id} event={ev} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </ListingLayout>
  )
}
