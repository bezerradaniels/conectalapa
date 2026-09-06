import { useState, type ReactNode } from 'react'
import { SlidersHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Drawer } from '@/components/ui/drawer'

export interface FilterBarProps {
  children: ReactNode
  activeCount?: number
  onClearAll?: () => void
  totalResults?: number
  domainTitle?: string
  className?: string
}

export function FilterBar({
  children,
  activeCount = 0,
  onClearAll,
  totalResults,
  domainTitle = 'Filtros',
  className = '',
}: FilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Desktop inline filters container */}
      <div className="hidden md:block p-4 rounded-xl border border-border-hairline bg-bg-surface">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-hairline">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-accent-text" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-text-primary">Filtrar resultados</h2>
            {activeCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-accent-subtle text-accent-text">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-text-muted hover:text-red-600 transition-colors flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-red-400 rounded-sm"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              Limpar filtros
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {children}
        </div>
      </div>

      {/* Mobile drawer trigger button */}
      <div className="md:hidden flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setDrawerOpen(true)}
          leadingIcon={<SlidersHorizontal className="w-4 h-4 text-accent-text" aria-hidden="true" />}
          className="relative text-xs font-semibold"
          aria-label={`Abrir filtros${activeCount > 0 ? `, ${activeCount} ativos` : ''}`}
        >
          <span>Filtros</span>
          {activeCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-2xs font-bold bg-accent text-accent-fg">
              {activeCount}
            </span>
          )}
        </Button>

        {activeCount > 0 && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1"
          >
            Limpar ({activeCount})
          </button>
        )}
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="right"
        title={`Filtros — ${domainTitle}`}
        description="Ajuste os critérios para refinar os resultados."
        width="w-full sm:w-96 max-w-full"
      >
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="space-y-5 pt-1">
            {children}
          </div>

          <div className="pt-4 border-t border-border-hairline space-y-2 sticky bottom-0 bg-bg-surface">
            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => setDrawerOpen(false)}
            >
              {totalResults !== undefined
                ? `Ver ${totalResults} ${totalResults === 1 ? 'resultado' : 'resultados'}`
                : 'Aplicar Filtros'}
            </Button>
            {activeCount > 0 && onClearAll && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                onClick={() => {
                  onClearAll()
                  setDrawerOpen(false)
                }}
              >
                Limpar todos os filtros
              </Button>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  )
}
