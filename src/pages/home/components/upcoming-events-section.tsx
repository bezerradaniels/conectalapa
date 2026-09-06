import { Link } from 'react-router-dom'
import { AlertCircle, Calendar } from 'lucide-react'
import { useUpcomingEvents } from '@/features/home/api/hooks'
import { EventCard } from '@/components/cards/event-card'
import { EventCardSkeleton } from '@/components/cards/skeletons'
import { Button } from '@/components/ui/button'

export function UpcomingEventsSection() {
  const { data: events, isLoading, isError, error, refetch } = useUpcomingEvents(6)

  return (
    <section aria-labelledby="events-heading" className="py-8 sm:py-12 border-b border-black/[0.04]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 id="events-heading" className="text-xl sm:text-2xl font-extrabold text-text-primary">
            Próximos eventos
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Agenda de romarias, shows e acontecimentos na cidade
          </p>
        </div>

        <Link
          to="/eventos"
          className="text-xs sm:text-sm font-bold text-accent hover:text-accent-hover px-3.5 py-1.5 rounded-full hover:bg-accent-subtle transition-all inline-flex items-center gap-1"
        >
          Ver todos →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6" aria-busy="true" aria-label="Carregando próximos eventos">
          {Array.from({ length: 4 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center text-red-700">
          <AlertCircle className="mx-auto w-7 h-7 text-red-500 mb-2" aria-hidden="true" />
          <p className="text-sm font-medium">Não foi possível carregar os próximos eventos.</p>
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
      ) : !events || events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border-subtle bg-bg-surface p-10 text-center shadow-xs">
          <Calendar className="mx-auto w-10 h-10 text-slate-400 mb-3" aria-hidden="true" />
          <h3 className="text-base font-bold text-text-primary">Nenhum evento agendado no momento</h3>
          <p className="mt-1 text-xs sm:text-sm text-text-muted max-w-md mx-auto">
            Fique atento às próximas programações da cidade ou divulgue seu evento no guia.
          </p>
          <Link
            to="/solicitar"
            className="mt-4 inline-flex items-center text-xs sm:text-sm font-bold text-accent hover:underline"
          >
            Divulgar um evento gratuitamente →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}
