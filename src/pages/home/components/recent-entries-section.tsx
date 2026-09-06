import { Link } from 'react-router-dom'
import { AlertCircle, Sparkles } from 'lucide-react'
import { useRecentEntries } from '@/features/home/api/hooks'
import { RecentEntryCard } from '@/components/cards/recent-entry-card'
import { RecentEntryCardSkeleton } from '@/components/cards/skeletons'
import { Button } from '@/components/ui/button'

export function RecentEntriesSection() {
  const { data: entries, isLoading, isError, error, refetch } = useRecentEntries(6)

  return (
    <section aria-labelledby="recent-heading" className="py-8 sm:py-12 border-b border-black/[0.04]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h2 id="recent-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Novidades no guia
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Últimos estabelecimentos e serviços cadastrados em Bom Jesus da Lapa
          </p>
        </div>

        <Link
          to="/empresas"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-bold transition-all self-start sm:self-auto shadow-2xs"
        >
          Explorar guia &rarr;
        </Link>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          aria-busy="true"
          aria-label="Carregando novidades no guia"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <RecentEntryCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50/70 p-6 sm:p-8 text-center text-red-700">
          <AlertCircle className="mx-auto w-6 h-6 text-red-500 mb-2" aria-hidden="true" />
          <p className="text-sm font-semibold">Não foi possível carregar as novidades.</p>
          <p className="text-xs text-red-600 mt-1">{error?.message}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            className="mt-4 rounded-full border-red-200 hover:bg-red-100"
          >
            Tentar novamente
          </Button>
        </div>
      ) : !entries || entries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-black/[0.08] bg-white/80 backdrop-blur-sm p-10 sm:p-12 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Nenhuma novidade recente cadastrada</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Novos estabelecimentos aparecerão aqui assim que forem publicados no portal.
          </p>
          <Link
            to="/solicitar"
            className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition-all shadow-xs"
          >
            Cadastrar sua empresa ou serviço
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {entries.map((entry) => (
            <RecentEntryCard key={`${entry.domain}-${entry.id}`} entry={entry} />
          ))}
        </div>
      )}
    </section>
  )
}
