import { Link } from 'react-router-dom'
import { AlertCircle, Calendar } from 'lucide-react'
import { useUpcomingEvents } from '@/features/home/api/hooks'
import { EventCard } from '@/components/cards/event-card'
import { EventCardSkeleton } from '@/components/cards/skeletons'
import { Button } from '@/components/ui/button'

export function UpcomingEventsSection() {
  const { data: events, isLoading, isError, error, refetch } = useUpcomingEvents(6)

  return (
    <section aria-labelledby="events-heading" className="py-6 sm:py-8 border-b border-border-hairline">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 id="events-heading" className="text-lg sm:text-xl font-bold text-text-primary">
            Próximos eventos
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Agenda de romarias, shows e acontecimentos na cidade
          </p>
        </div>

        <Link
          to="/eventos"
          className="text-xs sm:text-sm font-semibold text-accent-text hover:text-accent-hover transition-colors inline-flex items-center gap-1"
        >
          Ver todos
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-busy="true" aria-label="Carregando próximos eventos">
          {Array.from({ length: 4 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center text-red-700">
          <AlertCircle className="mx-auto w-6 h-6 text-red-500 mb-2" aria-hidden="true" />
          <p className="text-sm font-medium">Não foi possível carregar os próximos eventos.</p>
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
      ) : !events || events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle bg-bg-surface p-8 text-center">
          <Calendar className="mx-auto w-8 h-8 text-slate-400 mb-2" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-text-primary">Nenhum evento agendado no momento</h3>
          <p className="mt-1 text-xs text-text-muted">
            Fique atento às próximas programações da cidade ou divulgue seu evento.
          </p>
          <Link
            to="/solicitar"
            className="mt-3 inline-flex items-center text-xs font-semibold text-accent-text hover:underline"
          >
            Divulgar um evento gratuitamente
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  )
}
