import { Link } from 'react-router-dom'
import { AlertCircle, Sparkles } from 'lucide-react'
import { useRecentEntries } from '@/features/home/api/hooks'
import { RecentEntryCard } from '@/components/cards/recent-entry-card'
import { RecentEntryCardSkeleton } from '@/components/cards/skeletons'
import { Button } from '@/components/ui/button'

export function RecentEntriesSection() {
  const { data: entries, isLoading, isError, error, refetch } = useRecentEntries(6)

  return (
    <section aria-labelledby="recent-heading" className="py-6 sm:py-8 border-b border-border-hairline">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 id="recent-heading" className="text-lg sm:text-xl font-bold text-text-primary">
            Novidades no guia
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Últimos estabelecimentos e serviços cadastrados em Bom Jesus da Lapa
          </p>
        </div>

        <Link
          to="/empresas"
          className="text-xs sm:text-sm font-semibold text-accent-text hover:text-accent-hover transition-colors inline-flex items-center gap-1"
        >
          Explorar guia
        </Link>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          aria-busy="true"
          aria-label="Carregando novidades no guia"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <RecentEntryCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center text-red-700">
          <AlertCircle className="mx-auto w-6 h-6 text-red-500 mb-2" aria-hidden="true" />
          <p className="text-sm font-medium">Não foi possível carregar as novidades.</p>
          <p className="text-xs text-red-600 mt-1">{error?.message}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            className="mt-3 border-red-300 hover:bg-red-100"
          >
            Tentar novamente
          </Button>
        </div>
      ) : !entries || entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-bg-surface p-8 text-center">
          <Sparkles className="mx-auto w-8 h-8 text-slate-400 mb-2" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-text-primary">Nenhuma novidade recente cadastrada</h3>
          <p className="mt-1 text-xs text-text-muted">
            Novos estabelecimentos aparecerão aqui assim que forem publicados.
          </p>
          <Link
            to="/solicitar"
            className="mt-3 inline-flex items-center text-xs font-semibold text-accent-text hover:underline"
          >
            Cadastrar sua empresa ou serviço
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {entries.map((entry) => (
            <RecentEntryCard key={`${entry.domain}-${entry.id}`} entry={entry} />
          ))}
        </div>
      )}
    </section>
  )
}
