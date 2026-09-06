import type { ReactNode } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/breadcrumbs'
import { Head } from '@/components/seo/head'
import { Button } from '@/components/ui/button'
import { AlertCircle, RotateCcw } from 'lucide-react'

export interface ListingLayoutProps {
  title: string
  description?: string
  seoTitle?: string
  seoDescription?: string
  breadcrumbs?: BreadcrumbItem[]
  totalCount?: number
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
  filterBar?: ReactNode
  filterChips?: ReactNode
  sortSelect?: ReactNode
  pagination?: ReactNode
  emptyState?: ReactNode
  children: ReactNode
  headerAction?: ReactNode
}

export function ListingLayout({
  title,
  description,
  seoTitle,
  seoDescription,
  breadcrumbs,
  totalCount,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  filterBar,
  filterChips,
  sortSelect,
  pagination,
  emptyState,
  children,
  headerAction,
}: ListingLayoutProps) {
  const resultCountText =
    totalCount !== undefined
      ? `${totalCount} ${totalCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}`
      : undefined

  return (
    <div className="space-y-6">
      <Head
        title={seoTitle || title}
        description={seoDescription || description || 'Guia comercial e turístico de Bom Jesus da Lapa - BA.'}
      />

      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs && breadcrumbs.length > 0 ? <Breadcrumbs items={breadcrumbs} /> : undefined}
        action={headerAction}
      />

      {/* Filter bar (Desktop inline + Mobile trigger) */}
      {filterBar}

      {/* Active filter chips */}
      {filterChips}

      {/* Control bar: Result count announcement and sort select */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 pb-1 border-b border-border-hairline">
        <div
          role="status"
          aria-live="polite"
          className="text-xs font-medium text-text-muted"
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Carregando resultados…
            </span>
          ) : resultCountText ? (
            <span>
              <strong className="font-semibold text-text-primary">{totalCount}</strong>{' '}
              {totalCount === 1 ? 'resultado' : 'resultados'}
            </span>
          ) : null}
        </div>

        {sortSelect && <div className="self-end sm:self-auto">{sortSelect}</div>}
      </div>

      {/* Main content area */}
      {isError ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50/70 p-6 sm:p-8 text-center text-red-700 flex flex-col items-center justify-center max-w-md mx-auto"
        >
          <AlertCircle className="w-8 h-8 text-red-500 mb-3" aria-hidden="true" />
          <h3 className="text-base font-bold text-red-800">Falha ao carregar listagem</h3>
          <p className="mt-1 text-sm text-red-600">
            {errorMessage || 'Ocorreu um erro ao consultar os dados. Por favor, tente novamente.'}
          </p>
          {onRetry && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
              className="mt-4 border-red-300 hover:bg-red-100 text-red-700"
              leadingIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
            >
              Tentar novamente
            </Button>
          )}
        </div>
      ) : emptyState ? (
        emptyState
      ) : (
        <div className="space-y-6">
          {children}
          {pagination}
        </div>
      )}
    </div>
  )
}
