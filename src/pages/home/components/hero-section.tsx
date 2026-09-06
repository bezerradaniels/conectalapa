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
      className="pt-2 pb-6 sm:py-8 border-b border-border-hairline"
    >
      <div className="max-w-3xl">
        <h1
          id="hero-title"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary leading-tight"
        >
          O guia de comércio, serviços, eventos e turismo de Bom Jesus da Lapa
        </h1>

        <p className="mt-2 text-sm sm:text-base text-text-secondary leading-relaxed">
          Encontre onde ficar, onde comer, a programação da cidade e serviços essenciais em um só lugar.
        </p>

        {/* Primary Search Entry — immediate thumb reach */}
        <form onSubmit={handleSearch} className="mt-5 flex items-center gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por hotel, restaurante, dentista..."
              className="w-full h-11 pl-10 pr-3 rounded-lg border border-border-hairline bg-bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent shadow-xs"
              aria-label="Buscar no ConectaLapa"
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="h-11 px-5 font-semibold shrink-0">
            Buscar
          </Button>
        </form>
      </div>
    </section>
  )
}
