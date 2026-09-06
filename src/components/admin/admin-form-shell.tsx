import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export interface AdminFormShellProps {
  title: string
  backTo: string
  statusBadge?: ReactNode
  actions: ReactNode
  children: ReactNode
}

export function AdminFormShell({ title, backTo, statusBadge, actions, children }: AdminFormShellProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-hairline">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={backTo}
            aria-label="Voltar para a lista"
            className="w-9 h-9 rounded-lg border border-border-hairline flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
          <h1 className="text-xl font-bold text-text-primary truncate">{title}</h1>
          {statusBadge}
        </div>
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      </div>
      {children}
    </div>
  )
}
