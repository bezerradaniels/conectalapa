import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import {
  Search,
  ArrowRight,
  Store,
  Calendar,
  Bed,
  UtensilsCrossed,
  Palmtree,
  Sparkles,
} from 'lucide-react'
import { Head } from '@/components/seo/head'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { ListingEmptyState } from '@/components/listing'
import { useCrossDomainSearch, useDebouncedValue } from '@/features/search/api/hooks'
import type { SearchDomain, SearchResultItem } from '@/features/search/api/queries'

const DOMAIN_CONFIG: Record<
  SearchDomain,
  { label: string; icon: typeof Store; listPath: string }
> = {
  business: { label: 'Empresas & Serviços', icon: Store, listPath: '/empresas' },
  lodging: { label: 'Hospedagem', icon: Bed, listPath: '/hospedagem' },
  dining: { label: 'Gastronomia', icon: UtensilsCrossed, listPath: '/gastronomia' },
  event: { label: 'Eventos', icon: Calendar, listPath: '/eventos' },
  package: { label: 'Pacotes', icon: Palmtree, listPath: '/pacotes' },
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const urlQuery = searchParams.get('q') || ''
  const [inputVal, setInputVal] = useState(urlQuery)
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery)
  const [selectedDomain, setSelectedDomain] = useState<SearchDomain | 'all'>('all')

  // Sync inputVal when urlQuery changes externally (e.g. back/forward navigation)
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery)
    setInputVal(urlQuery)
  }

  // Debounced query for live typing
  const debouncedQuery = useDebouncedValue(inputVal, 300)

  // Update URL whenever debounced query changes
  useEffect(() => {
    const trimmed = debouncedQuery.trim()
    if (trimmed !== urlQuery) {
      if (trimmed) {
        setSearchParams({ q: trimmed }, { replace: true })
      } else {
        setSearchParams({}, { replace: true })
      }
    }
  }, [debouncedQuery, urlQuery, setSearchParams])

  const activeQuery = urlQuery || debouncedQuery.trim()

  // Cross-domain search query with abort signal cancellation
  const { data: results, isLoading, isError, error } = useCrossDomainSearch(
    activeQuery,
    selectedDomain === 'all' ? undefined : selectedDomain,
    30
  )

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputVal.trim()
    if (trimmed) {
      navigate(`/busca?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const renderResultCard = (item: SearchResultItem) => {
    const config = DOMAIN_CONFIG[item.domain]
    const Icon = config.icon

    return (
      <Link
        key={`${item.domain}-${item.id}`}
        to={item.detail_path}
        className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-border-hairline bg-bg-surface hover:border-border-subtle hover:shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label={`Ver detalhes de ${item.name}`}
      >
        {item.image_url ? (
          <img
            src={item.image_url}
            alt=""
            loading="lazy"
            decoding="async"
            width={72}
            height={72}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg object-cover border border-border-hairline shrink-0 bg-bg-subtle"
          />
        ) : (
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg bg-bg-subtle border border-border-hairline text-slate-400 flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7 opacity-60" aria-hidden="true" />
          </div>
        )}

        <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="neutral" size="sm" className="font-semibold text-2xs">
                <Icon className="w-3 h-3 mr-1 text-slate-500" aria-hidden="true" />
                {config.label}
              </Badge>
              {item.category_name && (
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-2xs font-medium text-slate-600">
                  {item.category_name}
                </span>
              )}
            </div>

            <h3 className="mt-1.5 text-base font-semibold text-text-primary group-hover:text-accent-text transition-colors line-clamp-1">
              {item.name}
            </h3>

            {item.description && (
              <p className="mt-1 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {item.subtitle && (
            <p className="mt-2 text-xs text-text-muted truncate">
              {item.subtitle}
            </p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <div className="space-y-6" data-testid="search-page">
      <Head
        title={activeQuery ? `Busca por "${activeQuery}" — ConectaLapa` : 'Busca no Guia — ConectaLapa'}
        description="Pesquise empresas, hospedagens, restaurantes, pacotes e eventos em Bom Jesus da Lapa."
      />

      <PageHeader
        title="Busca Geral"
        description="Pesquise em todo o guia de Bom Jesus da Lapa: comércio, pousadas, restaurantes, pacotes e eventos."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Início', to: '/' },
              { label: 'Busca' },
            ]}
          />
        }
      />

      {/* Search form box */}
      <form onSubmit={handleFormSubmit} className="max-w-2xl">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
          <Input
            type="search"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ex: pousada, almoço, oficina, romaria, porto seguro..."
            className="pl-10 pr-24 py-2.5 text-sm rounded-xl border-border-hairline shadow-xs focus:ring-accent"
            aria-label="Termo de busca"
          />
          {inputVal && (
            <button
              type="button"
              onClick={() => {
                setInputVal('')
                setSearchParams({})
              }}
              className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded"
            >
              Limpar
            </button>
          )}
        </div>
      </form>

      {/* If search query entered */}
      {activeQuery ? (
        <div className="space-y-6">
          {/* Header with query announcement & count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-hairline">
            <div role="status" aria-live="polite">
              <h2 className="text-lg font-bold text-text-primary">
                Resultados para: <span className="text-accent-text">"{activeQuery}"</span>
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {isLoading ? (
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <Spinner size="sm" />
                    Buscando em todo o guia…
                  </span>
                ) : (
                  <span>
                    <strong>{results?.totalCount || 0}</strong> {results?.totalCount === 1 ? 'item encontrado' : 'itens encontrados'}
                  </span>
                )}
              </p>
            </div>

            {/* Domain filter tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedDomain('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  selectedDomain === 'all'
                    ? 'bg-accent text-accent-fg font-semibold shadow-xs'
                    : 'bg-bg-surface text-text-primary border border-border-hairline hover:bg-bg-subtle'
                }`}
              >
                Todos ({results?.totalCount || 0})
              </button>

              {(Object.keys(DOMAIN_CONFIG) as SearchDomain[]).map((dom) => {
                const count =
                  dom === 'business'
                    ? results?.businesses.length || 0
                    : dom === 'lodging'
                      ? results?.lodging.length || 0
                      : dom === 'dining'
                        ? results?.dining.length || 0
                        : dom === 'event'
                          ? results?.events.length || 0
                          : results?.packages.length || 0

                return (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => setSelectedDomain(dom)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                      selectedDomain === dom
                        ? 'bg-accent text-accent-fg font-semibold shadow-xs'
                        : 'bg-bg-surface text-text-primary border border-border-hairline hover:bg-bg-subtle'
                    }`}
                  >
                    {DOMAIN_CONFIG[dom].label} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Results display */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-24 rounded-xl border border-border-hairline bg-bg-surface animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              <p className="font-semibold">Erro ao processar busca</p>
              <p className="text-xs mt-1">{error?.message || 'Falha de comunicação com o banco de dados.'}</p>
            </div>
          ) : !results || results.totalCount === 0 ? (
            <ListingEmptyState
              type="search_empty"
              domainLabel="itens"
              searchQuery={activeQuery}
              onClearFilters={() => {
                setInputVal('')
                setSearchParams({})
              }}
              browseCategoriesPath="/empresas"
            />
          ) : selectedDomain !== 'all' ? (
            /* Single domain filtered view */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.all.map(renderResultCard)}
              </div>
              <div className="pt-3 flex justify-end">
                <Link
                  to={`${DOMAIN_CONFIG[selectedDomain].listPath}?search=${encodeURIComponent(activeQuery)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-text hover:underline"
                >
                  Ver todos os filtros avançados de {DOMAIN_CONFIG[selectedDomain].label}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            /* Grouped by domain view */
            <div className="space-y-8">
              {/* Businesses group */}
              {results.businesses.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border-hairline">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-accent-text" aria-hidden="true" />
                      <h3 className="text-sm font-bold text-text-primary">
                        Empresas e Serviços ({results.businesses.length})
                      </h3>
                    </div>
                    <Link
                      to={`/empresas?search=${encodeURIComponent(activeQuery)}`}
                      className="text-xs text-accent-text hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Ver no catálogo <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.businesses.map(renderResultCard)}
                  </div>
                </section>
              )}

              {/* Lodging group */}
              {results.lodging.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border-hairline">
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4 text-accent-text" aria-hidden="true" />
                      <h3 className="text-sm font-bold text-text-primary">
                        Hospedagem ({results.lodging.length})
                      </h3>
                    </div>
                    <Link
                      to={`/hospedagem?search=${encodeURIComponent(activeQuery)}`}
                      className="text-xs text-accent-text hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Ver no catálogo <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.lodging.map(renderResultCard)}
                  </div>
                </section>
              )}

              {/* Dining group */}
              {results.dining.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border-hairline">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-accent-text" aria-hidden="true" />
                      <h3 className="text-sm font-bold text-text-primary">
                        Gastronomia ({results.dining.length})
                      </h3>
                    </div>
                    <Link
                      to={`/gastronomia?search=${encodeURIComponent(activeQuery)}`}
                      className="text-xs text-accent-text hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Ver no catálogo <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.dining.map(renderResultCard)}
                  </div>
                </section>
              )}

              {/* Events group */}
              {results.events.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border-hairline">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent-text" aria-hidden="true" />
                      <h3 className="text-sm font-bold text-text-primary">
                        Eventos ({results.events.length})
                      </h3>
                    </div>
                    <Link
                      to={`/eventos?search=${encodeURIComponent(activeQuery)}`}
                      className="text-xs text-accent-text hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Ver no catálogo <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.events.map(renderResultCard)}
                  </div>
                </section>
              )}

              {/* Packages group */}
              {results.packages.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border-hairline">
                    <div className="flex items-center gap-2">
                      <Palmtree className="w-4 h-4 text-accent-text" aria-hidden="true" />
                      <h3 className="text-sm font-bold text-text-primary">
                        Pacotes de Viagem ({results.packages.length})
                      </h3>
                    </div>
                    <Link
                      to={`/pacotes?search=${encodeURIComponent(activeQuery)}`}
                      className="text-xs text-accent-text hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Ver no catálogo <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.packages.map(renderResultCard)}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Prompt to search */
        <div className="rounded-2xl border border-border-hairline bg-bg-surface p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-accent-subtle text-accent-text flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-text-primary">
            O que você procura em Bom Jesus da Lapa?
          </h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Digite o nome de uma empresa, tipo de serviço, hotel, restaurante ou atração para buscar em todo o portal com correspondência fonética e sem acentos.
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
            <Link
              to="/busca?q=pousada"
              className="p-3 rounded-lg border border-border-hairline hover:bg-bg-subtle transition-colors text-xs font-medium text-text-primary block"
            >
              🔍 "pousada"
            </Link>
            <Link
              to="/busca?q=almoco"
              className="p-3 rounded-lg border border-border-hairline hover:bg-bg-subtle transition-colors text-xs font-medium text-text-primary block"
            >
              🔍 "almoco" (Açaí / Restaurante)
            </Link>
            <Link
              to="/busca?q=romaria"
              className="p-3 rounded-lg border border-border-hairline hover:bg-bg-subtle transition-colors text-xs font-medium text-text-primary block"
            >
              🔍 "romaria"
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
