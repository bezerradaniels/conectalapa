import { Link } from 'react-router-dom'
import { Bed, UtensilsCrossed, Calendar, Store, Palmtree } from 'lucide-react'
import { useDomainCounts } from '@/features/home/api/hooks'

interface CategoryItem {
  id: string
  title: string
  subtitle: string
  path: string
  icon: typeof Bed
  countKey: 'lodging' | 'dining' | 'events' | 'businesses' | 'packages'
  featured?: boolean
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'hospedagem',
    title: 'Hospedagem',
    subtitle: 'Hotéis e pousadas',
    path: '/hospedagem',
    icon: Bed,
    countKey: 'lodging',
    featured: true,
  },
  {
    id: 'gastronomia',
    title: 'Gastronomia',
    subtitle: 'Restaurantes e bares',
    path: '/gastronomia',
    icon: UtensilsCrossed,
    countKey: 'dining',
    featured: true,
  },
  {
    id: 'eventos',
    title: 'Eventos',
    subtitle: 'Romaria e programação',
    path: '/eventos',
    icon: Calendar,
    countKey: 'events',
  },
  {
    id: 'empresas',
    title: 'Empresas',
    subtitle: 'Comércio e serviços',
    path: '/empresas',
    icon: Store,
    countKey: 'businesses',
  },
  {
    id: 'pacotes',
    title: 'Pacotes',
    subtitle: 'Viagens e excursões',
    path: '/pacotes',
    icon: Palmtree,
    countKey: 'packages',
  },
]

export function CategoryNavSection() {
  const { data: counts, isLoading } = useDomainCounts()

  return (
    <section aria-labelledby="categories-heading" className="py-6 sm:py-8 border-b border-border-hairline">
      <div className="flex items-baseline justify-between mb-4">
        <h2 id="categories-heading" className="text-lg sm:text-xl font-bold text-text-primary">
          Categorias principais
        </h2>
        <span className="text-xs text-text-muted">
          Acesso rápido às áreas do guia
        </span>
      </div>

      <nav aria-label="Categorias do ConectaLapa">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const count = counts ? counts[cat.countKey] : null

            return (
              <Link
                key={cat.id}
                to={cat.path}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-accent min-h-16 ${
                  cat.featured
                    ? 'border-border-subtle bg-bg-surface hover:border-accent-border hover:shadow-xs'
                    : 'border-border-hairline bg-bg-surface hover:border-border-subtle hover:bg-bg-subtle/50'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      cat.featured
                        ? 'bg-accent-subtle text-accent-text group-hover:bg-accent group-hover:text-slate-900'
                        : 'bg-bg-subtle text-slate-700 group-hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-text-primary group-hover:text-accent-text transition-colors">
                      {cat.title}
                    </span>
                    <span className="block text-xs text-text-muted truncate">
                      {cat.subtitle}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isLoading ? (
                    <span className="inline-block w-6 h-5 rounded bg-slate-100 animate-pulse" />
                  ) : count !== null && count > 0 ? (
                    <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs font-semibold bg-bg-subtle text-text-secondary border border-border-hairline">
                      {count}
                    </span>
                  ) : null}
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </section>
  )
}
