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
        className={`rounded-2xl border border-dashed border-border-subtle bg-bg-surface p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-accent-subtle flex items-center justify-center text-accent-text mb-4">
          <PlusCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">
          Nenhum cadastro de {domainLabel} no momento
        </h3>
        <p className="mt-2 text-sm text-text-muted">
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
        className={`rounded-2xl border border-border-hairline bg-bg-surface p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <FilterX className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">
          Nenhum resultado com os filtros selecionados
        </h3>
        <p className="mt-2 text-sm text-text-muted">
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
      className={`rounded-2xl border border-border-hairline bg-bg-surface p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
        <SearchX className="w-6 h-6" aria-hidden="true" />
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
