import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Store,
  CalendarDays,
  Palmtree,
  Bed,
  UtensilsCrossed,
  Inbox,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '@/app/use-auth'
import { usePendingSubmissionsCount } from '@/features/admin/api/hooks'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/empresas', label: 'Empresas', icon: Store },
  { to: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { to: '/admin/pacotes', label: 'Pacotes', icon: Palmtree },
  { to: '/admin/hospedagem', label: 'Hospedagem', icon: Bed },
  { to: '/admin/gastronomia', label: 'Gastronomia', icon: UtensilsCrossed },
]

export interface AdminSidebarProps {
  onNavigate?: () => void
  className?: string
}

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const { signOut, user } = useAuth()
  const { data: pendingCount } = usePendingSubmissionsCount()

  return (
    <nav className={cn('flex flex-col h-full bg-slate-900 text-slate-300', className)} aria-label="Navegação administrativa">
      <div className="px-4 py-5 border-b border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">ConectaLapa</p>
        <p className="text-base font-bold text-white leading-tight">Admin</p>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {label}
          </NavLink>
        ))}

        <NavLink
          to="/admin/solicitacoes"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            )
          }
        >
          <Inbox className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">Solicitações</span>
          {Boolean(pendingCount) && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-accent text-slate-900 text-2xs font-bold">
              {pendingCount}
            </span>
          )}
        </NavLink>
      </div>

      <div className="border-t border-slate-800 p-3 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
          Ver site público
        </a>

        <div className="px-3 py-1.5 text-xs text-slate-500 truncate" title={user?.email || undefined}>
          {user?.email}
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          Sair
        </button>
      </div>
    </nav>
  )
}
