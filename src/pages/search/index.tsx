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
import { optimizeImageUrl } from '@/lib/image-url'

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
        className="group flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5 rounded-2xl border border-black/[0.04] bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-accent"
      >
        <span className="sr-only">Ver detalhes de </span>
        {item.image_url ? (
          <img
            src={optimizeImageUrl(item.image_url, 160) || undefined}
            alt=""
            loading="lazy"
            decoding="async"
            width={80}
            height={80}
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-black/[0.04] shrink-0 bg-slate-50"
          />
        ) : (
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-black/[0.04] text-slate-400 flex items-center justify-center shrink-0">
            <Icon className="w-7 h-7 opacity-60" aria-hidden="true" />
          </div>
        )}

        <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="neutral" size="sm" className="font-bold text-2xs">
                <Icon className="w-3 h-3 mr-1 text-slate-500" aria-hidden="true" />
                {config.label}
              </Badge>
              {item.category_name && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-2xs font-semibold text-slate-600">
                  {item.category_name}
                </span>
              )}
            </div>

            <h3 className="mt-1.5 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {item.name}
            </h3>

            {item.description && (
              <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {item.subtitle && (
            <p className="mt-2 text-xs text-slate-400 font-medium truncate">
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
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
          <Input
            type="search"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ex: pousada, almoço, oficina, romaria, porto seguro..."
            className="pl-11 pr-24 py-3 text-sm rounded-full border-black/[0.06] bg-white shadow-xs focus:ring-accent"
            aria-label="Termo de busca"
          />
          {inputVal && (
            <button
              type="button"
              onClick={() => {
                setInputVal('')
                setSearchParams({})
              }}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-full font-medium"
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.04]">
            <div role="status" aria-live="polite">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Resultados para: <span className="text-blue-600">"{activeQuery}"</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
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
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedDomain('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                  selectedDomain === 'all'
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 border border-black/[0.04] hover:bg-slate-50 font-medium'
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
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                      selectedDomain === dom
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white text-slate-700 border border-black/[0.04] hover:bg-slate-50 font-medium'
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-28 rounded-2xl border border-black/[0.04] bg-white shadow-xs animate-pulse" />
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
        <div className="rounded-3xl border border-black/[0.04] bg-white/80 backdrop-blur-sm p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-7 h-7" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">
            O que você procura em Bom Jesus da Lapa?
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Digite o nome de uma empresa, tipo de serviço, pousada, restaurante, pacote ou evento para buscar em todo o portal.
          </p>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <Link
              to="/busca?q=pousada"
              className="p-3.5 rounded-2xl border border-black/[0.04] bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 transition-all text-xs font-bold text-slate-700 hover:text-blue-700 block text-center shadow-2xs"
            >
              🏨 "pousada"
            </Link>
            <Link
              to="/busca?q=almoco"
              className="p-3.5 rounded-2xl border border-black/[0.04] bg-slate-50/70 hover:bg-amber-50 hover:border-amber-200 transition-all text-xs font-bold text-slate-700 hover:text-amber-700 block text-center shadow-2xs"
            >
              🍽️ "almoço"
            </Link>
            <Link
              to="/busca?q=romaria"
              className="p-3.5 rounded-2xl border border-black/[0.04] bg-slate-50/70 hover:bg-purple-50 hover:border-purple-200 transition-all text-xs font-bold text-slate-700 hover:text-purple-700 block text-center shadow-2xs"
            >
              ⛪ "romaria"
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
