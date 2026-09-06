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
  colorClass: string
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
    colorClass: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white',
    featured: true,
  },
  {
    id: 'gastronomia',
    title: 'Gastronomia',
    subtitle: 'Restaurantes e bares',
    path: '/gastronomia',
    icon: UtensilsCrossed,
    countKey: 'dining',
    colorClass: 'bg-orange-50 text-orange-600 border-orange-100 group-hover:bg-orange-500 group-hover:text-white',
    featured: true,
  },
  {
    id: 'eventos',
    title: 'Eventos',
    subtitle: 'Romaria e programação',
    path: '/eventos',
    icon: Calendar,
    countKey: 'events',
    colorClass: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-600 group-hover:text-white',
  },
  {
    id: 'empresas',
    title: 'Empresas',
    subtitle: 'Comércio e serviços',
    path: '/empresas',
    icon: Store,
    countKey: 'businesses',
    colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white',
  },
  {
    id: 'pacotes',
    title: 'Pacotes',
    subtitle: 'Viagens e excursões',
    path: '/pacotes',
    icon: Palmtree,
    countKey: 'packages',
    colorClass: 'bg-teal-50 text-teal-600 border-teal-100 group-hover:bg-teal-600 group-hover:text-white',
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
                className="group flex items-center justify-between p-4.5 sm:p-5 rounded-2xl border border-border-hairline bg-bg-surface shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-black/[0.08] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent min-h-18"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 shadow-2xs ${cat.colorClass}`}
                  >
                    <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <span className="block text-sm font-bold text-text-primary group-hover:text-accent-text transition-colors">
                      {cat.title}
                    </span>
                    <span className="block text-xs text-text-muted truncate mt-0.5">
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
