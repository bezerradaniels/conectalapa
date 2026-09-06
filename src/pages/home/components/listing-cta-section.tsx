import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'

export function ListingCtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="pt-6 sm:pt-8 pb-4">
      <div className="rounded-2xl border border-border-hairline bg-bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <h2 id="cta-heading" className="text-base sm:text-lg font-bold text-text-primary">
            Sua empresa ou evento no ConectaLapa
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Cadastre seu comércio, hospedagem, restaurante ou atração para ser encontrado por moradores e visitantes.
          </p>
        </div>

        <Link
          to="/solicitar"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-text-primary text-white text-sm font-semibold hover:bg-slate-800 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <PlusCircle className="w-4 h-4" aria-hidden="true" />
          Solicitar cadastro
        </Link>
      </div>
    </section>
  )
}
