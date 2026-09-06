import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      navigate(`/busca?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <section
      aria-labelledby="hero-title"
      className="pt-4 pb-10 sm:py-12 border-b border-border-hairline"
    >
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-subtle px-3.5 py-1 text-xs font-semibold text-accent-text border border-accent-border/40 mb-3">
          ✨ Guia Oficial de Bom Jesus da Lapa
        </span>

        <h1
          id="hero-title"
          className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-primary leading-tight"
        >
          Encontre os melhores lugares, serviços e eventos na cidade
        </h1>

        <p className="mt-3 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl font-normal">
          Hospedagem, gastronomia típica, romarias, comércio e passeios turísticos no coração do São Francisco.
        </p>

        {/* Primary Search Entry — Floating pill search */}
        <form onSubmit={handleSearch} className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-2xl bg-bg-surface p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-black/[0.06] shadow-md hover:shadow-lg transition-all duration-300">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="O que você procura? Hotel, churrascaria, evento..."
              className="w-full h-12 pl-12 pr-4 rounded-full bg-transparent text-sm sm:text-base text-text-primary placeholder:text-text-muted focus:outline-none"
              aria-label="Buscar no ConectaLapa"
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="h-11 sm:h-12 px-7 font-bold shrink-0 shadow-sm">
            Buscar
          </Button>
        </form>
      </div>
    </section>
  )
}
