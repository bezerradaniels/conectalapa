import { Link } from 'react-router-dom'
import { PlusCircle, FilterX, SearchX, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type EmptyStateType = 'domain_empty' | 'filter_empty' | 'search_empty'

export interface ListingEmptyStateProps {
  type: EmptyStateType
  domainLabel: string
  searchQuery?: string
  activeFiltersCount?: number
  onClearFilters?: () => void
  browseCategoriesPath?: string
  className?: string
}

export function ListingEmptyState({
  type,
  domainLabel,
  searchQuery,
  activeFiltersCount = 0,
  onClearFilters,
  browseCategoriesPath,
  className = '',
}: ListingEmptyStateProps) {
  if (type === 'domain_empty') {
    return (
      <div
        data-testid="domain-empty-state"
        className={`rounded-3xl border border-dashed border-black/[0.08] bg-white/80 backdrop-blur-sm p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-2xs ${className}`}
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-2xs">
          <PlusCircle className="w-7 h-7" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">
          Nenhum cadastro de {domainLabel} no momento
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Ainda não temos registros publicados nesta seção. Você conhece ou gerencia algum estabelecimento em Bom Jesus da Lapa?
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/solicitar">
            <Button
              variant="primary"
              size="md"
              leadingIcon={<PlusCircle className="w-4 h-4" aria-hidden="true" />}
            >
              Indicar ou cadastrar agora
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (type === 'filter_empty') {
    return (
      <div
        data-testid="filter-empty-state"
        className={`rounded-3xl border border-black/[0.04] bg-white/80 backdrop-blur-sm p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-sm ${className}`}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 shadow-2xs">
          <FilterX className="w-7 h-7" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900">
          Nenhum resultado com os filtros selecionados
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Não encontramos nenhum item correspondente aos {activeFiltersCount > 0 ? `${activeFiltersCount} ` : ''}critérios aplicados. Tente remover alguns filtros para ver mais opções.
        </p>
        {onClearFilters && (
          <div className="mt-6">
            <Button
              variant="secondary"
              size="md"
              onClick={onClearFilters}
              leadingIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
            >
              Limpar todos os filtros
            </Button>
          </div>
        )}
      </div>
    )
  }

  // type === 'search_empty'
  return (
    <div
      data-testid="search-empty-state"
      className={`rounded-3xl border border-black/[0.04] bg-white/80 backdrop-blur-sm p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-sm ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4 shadow-2xs">
        <SearchX className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-text-primary">
        Nenhum resultado para "{searchQuery || ''}"
      </h3>
      <p className="mt-2 text-sm text-text-muted">
        Não encontramos resultados para o termo digitado. Verifique a ortografia ou explore todas as opções desta categoria.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {onClearFilters && (
          <Button
            variant="secondary"
            size="md"
            onClick={onClearFilters}
            leadingIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
          >
            Limpar busca
          </Button>
        )}
        {browseCategoriesPath && (
          <Link to={browseCategoriesPath}>
            <Button variant="primary" size="md">
              Explorar todo o catálogo
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
