import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { Head } from '@/components/seo/head'

export interface DetailNotFoundProps {
  domainLabel: string
  backTo: string
  backLabel: string
}

/**
 * Rendered for an unknown or unpublished slug — never an empty shell or a
 * crash. Always routes back into the relevant listing rather than a
 * generic dead end.
 */
export function DetailNotFound({ domainLabel, backTo, backLabel }: DetailNotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 px-4">
      <Head title="Não encontrado" description={`Não encontramos ${domainLabel} com este endereço.`} />
      <div
        className="w-14 h-14 rounded-full bg-bg-subtle border border-border-hairline flex items-center justify-center mb-4 text-text-muted"
        aria-hidden="true"
      >
        <SearchX className="w-6 h-6" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
        Não encontramos {domainLabel}
      </h1>
      <p className="mt-2 text-sm text-text-secondary max-w-md">
        O link pode estar incorreto ou o registro pode ter sido removido.
      </p>
      <Link
        to={backTo}
        className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-lg text-sm font-semibold bg-accent text-slate-900 hover:bg-accent-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {backLabel}
      </Link>
    </div>
  )
}
