import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalCount?: number
  pageSize?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  pageSize,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const delta = 1 // adjacent pages
    const range: (number | string)[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      } else if (range[range.length - 1] !== '...') {
        range.push('...')
      }
    }

    return range
  }

  const pages = getPageNumbers()

  // Calculate range text (e.g., 1-12 de 35)
  const rangeStart = totalCount !== undefined && pageSize !== undefined
    ? Math.min((currentPage - 1) * pageSize + 1, totalCount)
    : null
  const rangeEnd = totalCount !== undefined && pageSize !== undefined
    ? Math.min(currentPage * pageSize, totalCount)
    : null

  return (
    <nav
      role="navigation"
      aria-label="Paginação"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border-hairline ${className}`}
    >
      {/* Screen reader live announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Página {currentPage} de {totalPages}
        {totalCount !== undefined ? `, exibindo ${totalCount} resultados` : ''}
      </div>

      {/* Results summary range */}
      <div className="text-xs text-text-muted text-center sm:text-left">
        {rangeStart !== null && rangeEnd !== null && totalCount !== undefined ? (
          <span>
            Mostrando <strong className="font-semibold text-text-primary">{rangeStart}</strong> a{' '}
            <strong className="font-semibold text-text-primary">{rangeEnd}</strong> de{' '}
            <strong className="font-semibold text-text-primary">{totalCount}</strong> resultados
          </span>
        ) : (
          <span>
            Página <strong className="font-semibold text-text-primary">{currentPage}</strong> de{' '}
            <strong className="font-semibold text-text-primary">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Mobile compact pagination */}
      <div className="flex sm:hidden items-center justify-between w-full">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Ir para a página anterior"
          leadingIcon={<ChevronLeft className="w-4 h-4" aria-hidden="true" />}
        >
          Anterior
        </Button>
        <span className="text-xs font-medium text-text-muted">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Ir para a próxima página"
          trailingIcon={<ChevronRight className="w-4 h-4" aria-hidden="true" />}
        >
          Próxima
        </Button>
      </div>

      {/* Desktop full numbered pagination */}
      <div className="hidden sm:flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
          leadingIcon={<ChevronLeft className="w-4 h-4" aria-hidden="true" />}
          className="px-2"
        />

        <ul className="flex items-center gap-1 list-none p-0 m-0">
          {pages.map((item, idx) => {
            if (item === '...') {
              return (
                <li key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-slate-400 select-none" aria-hidden="true">
                  …
                </li>
              )
            }

            const pageNum = Number(item)
            const isCurrent = pageNum === currentPage

            return (
              <li key={pageNum}>
                <button
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={`Ir para a página ${pageNum}`}
                  className={`min-w-9 h-9 px-2 text-xs font-bold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent ${
                    isCurrent
                      ? 'bg-accent text-white shadow-xs'
                      : 'text-text-primary hover:bg-bg-subtle'
                  }`}
                >
                  {pageNum}
                </button>
              </li>
            )
          })}
        </ul>

        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Próxima página"
          leadingIcon={<ChevronRight className="w-4 h-4" aria-hidden="true" />}
          className="px-2"
        />
      </div>
    </nav>
  )
}
