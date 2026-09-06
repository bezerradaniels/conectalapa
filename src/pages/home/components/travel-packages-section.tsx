import { Link } from 'react-router-dom'
import { AlertCircle, Palmtree } from 'lucide-react'
import { useUpcomingPackages } from '@/features/home/api/hooks'
import { PackageCard } from '@/components/cards/package-card'
import { PackageCardSkeleton } from '@/components/cards/skeletons'
import { Button } from '@/components/ui/button'

export function TravelPackagesSection() {
  const { data: packages, isLoading, isError, error, refetch } = useUpcomingPackages(4)

  return (
    <section aria-labelledby="packages-heading" className="py-8 sm:py-12 border-b border-black/[0.04]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 id="packages-heading" className="text-xl sm:text-2xl font-extrabold text-text-primary">
            Pacotes de viagem
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Próximas saídas e excursões organizadas a partir de Bom Jesus da Lapa
          </p>
        </div>

        <Link
          to="/pacotes"
          className="text-xs sm:text-sm font-bold text-accent hover:text-accent-hover px-3.5 py-1.5 rounded-full hover:bg-accent-subtle transition-all inline-flex items-center gap-1"
        >
          Ver todos →
        </Link>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          aria-busy="true"
          aria-label="Carregando pacotes de viagem"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <PackageCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center text-red-700">
          <AlertCircle className="mx-auto w-7 h-7 text-red-500 mb-2" aria-hidden="true" />
          <p className="text-sm font-medium">Não foi possível carregar os pacotes de viagem.</p>
          <p className="text-xs text-red-600 mt-1">{error?.message}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            className="mt-4 border-red-300 hover:bg-red-100 rounded-full"
          >
            Tentar novamente
          </Button>
        </div>
      ) : !packages || packages.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border-subtle bg-bg-surface p-10 text-center shadow-xs">
          <Palmtree className="mx-auto w-10 h-10 text-slate-400 mb-3" aria-hidden="true" />
          <h3 className="text-base font-bold text-text-primary">Nenhum pacote com saídas programadas no momento</h3>
          <p className="mt-1 text-xs sm:text-sm text-text-muted max-w-md mx-auto">
            Agências de turismo podem cadastrar seus roteiros, translados e excursões.
          </p>
          <Link
            to="/solicitar"
            className="mt-4 inline-flex items-center text-xs sm:text-sm font-bold text-accent hover:underline"
          >
            Cadastrar pacote de viagem gratuitamente →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </section>
  )
}
