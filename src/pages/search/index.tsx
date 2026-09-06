import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Store, Calendar, Bed, UtensilsCrossed, Palmtree } from 'lucide-react'
import { Head } from '@/components/seo/head'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const DOMAINS = [
  { name: 'Empresas e Serviços', path: '/empresas', icon: Store },
  { name: 'Hospedagem', path: '/hospedagem', icon: Bed },
  { name: 'Gastronomia', path: '/gastronomia', icon: UtensilsCrossed },
  { name: 'Eventos', path: '/eventos', icon: Calendar },
  { name: 'Pacotes de Viagem', path: '/pacotes', icon: Palmtree },
]

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      navigate(`/busca?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <div className="space-y-8" data-testid="search-results-page">
      <Head
        title={initialQuery ? `Busca: "${initialQuery}"` : 'Busca no guia'}
        description="Pesquise empresas, hospedagens, restaurantes e eventos em Bom Jesus da Lapa."
      />

      <div className="border-b border-border-hairline pb-5">
        <h1 className="text-2xl font-bold text-text-primary">Busca no ConectaLapa</h1>
        <p className="mt-1 text-sm text-text-muted">
          Encontre estabelecimentos, atrações e serviços em Bom Jesus da Lapa.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O que você procura? Ex: pousada, almoço, dentista..."
              className="pl-10"
              aria-label="Campo de busca"
            />
          </div>
          <Button type="submit" variant="primary">
            Buscar
          </Button>
        </form>
      </div>

      {initialQuery ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-border-hairline bg-bg-surface p-6">
            <h2 className="text-base font-semibold text-text-primary">
              Resultados para: <span className="text-accent-text font-bold">"{initialQuery}"</span>
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              A busca unificada entre domínios com ranqueamento completo será ativada na Fase 5.
              Você pode navegar diretamente pelas seções do guia abaixo:
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DOMAINS.map((dom) => {
                const Icon = dom.icon
                return (
                  <Link
                    key={dom.path}
                    to={`${dom.path}?search=${encodeURIComponent(initialQuery)}`}
                    className="group flex items-center justify-between p-3.5 rounded-lg border border-border-hairline bg-bg-page hover:bg-bg-subtle hover:border-border-subtle transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-slate-500 group-hover:text-accent-text transition-colors" aria-hidden="true" />
                      <span className="text-sm font-medium text-text-primary group-hover:text-accent-text transition-colors">
                        {dom.name}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border-hairline bg-bg-surface p-6 text-center text-text-muted">
          <Search className="mx-auto w-8 h-8 text-slate-300 mb-2" aria-hidden="true" />
          <p className="text-sm">Digite uma palavra-chave acima para iniciar a busca.</p>
        </div>
      )}
    </div>
  )
}
