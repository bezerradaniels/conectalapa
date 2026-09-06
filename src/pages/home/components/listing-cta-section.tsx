import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'

export function ListingCtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="pt-8 sm:pt-12 pb-6">
      <div className="rounded-3xl border border-accent-border/40 bg-linear-to-br from-accent/10 via-sky-50 to-indigo-50/50 p-7 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-2xs font-bold text-accent-text border border-black/[0.04] shadow-2xs mb-2">
            🚀 Divulgue gratuitamente
          </span>
          <h2 id="cta-heading" className="text-lg sm:text-2xl font-extrabold text-text-primary">
            Sua empresa ou evento no ConectaLapa
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-text-secondary leading-relaxed">
            Cadastre seu comércio, hospedagem, restaurante ou atração para ser encontrado por milhares de moradores e romeiros.
          </p>
        </div>

        <Link
          to="/solicitar"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-sm sm:text-base font-bold hover:bg-accent-hover active:scale-[0.98] shadow-md hover:shadow-lg transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <PlusCircle className="w-5 h-5" aria-hidden="true" />
          Solicitar cadastro
        </Link>
      </div>
    </section>
  )
}
