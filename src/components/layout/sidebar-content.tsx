import { NavLink } from 'react-router-dom'
import {
  Home,
  Building2,
  Calendar,
  Package,
  Hotel,
  UtensilsCrossed,
  PlusCircle,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Divider } from '@/components/ui/divider'

interface NavItem {
  to: string
  label: string
  icon: typeof Home
  end?: boolean
}

const primaryNavItems: NavItem[] = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/empresas', label: 'Empresas', icon: Building2 },
  { to: '/eventos', label: 'Eventos', icon: Calendar },
  { to: '/pacotes', label: 'Pacotes', icon: Package },
  { to: '/hospedagem', label: 'Hospedagem', icon: Hotel },
  { to: '/gastronomia', label: 'Gastronomia', icon: UtensilsCrossed },
]

interface SidebarContentProps {
  onItemClick?: () => void
}

export function SidebarContent({ onItemClick }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col justify-between p-4 select-none">
      <div className="space-y-6">
        {/* Wordmark */}
        <div className="px-2 pt-1">
          <NavLink
            to="/"
            onClick={onItemClick}
            className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md p-1 -m-1"
          >
            <span className="text-xl font-bold tracking-tight text-text-primary flex items-center gap-1.5">
              Conecta<span className="text-accent-text">Lapa</span>
            </span>
            <span className="text-xs text-text-muted font-medium">
              Guia & Romaria • Bom Jesus da Lapa
            </span>
          </NavLink>
        </div>

        {/* Primary Navigation */}
        <nav aria-label="Navegação Principal" className="space-y-1.5">
          {primaryNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onItemClick}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-full transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                    isActive
                      ? 'bg-accent text-white font-bold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110',
                        isActive ? 'text-white' : 'text-text-muted group-hover:text-text-primary'
                      )}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <Divider className="my-4" />

        {/* Secondary Action — Prominent Pill */}
        <div className="px-1">
          <NavLink
            to="/solicitar"
            onClick={onItemClick}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-full bg-accent-subtle text-accent-text hover:bg-accent hover:text-white border border-accent-border/40 transition-all duration-200 shadow-xs hover:shadow-sm"
          >
            <PlusCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Divulgar no Guia</span>
          </NavLink>
        </div>
      </div>

      {/* Pinned Footer */}
      <div className="pt-4 border-t border-border-hairline px-2 text-xs text-text-muted space-y-1">
        <div className="font-medium text-text-secondary">Bom Jesus da Lapa — BA</div>
        <div className="flex items-center justify-between">
          <span>Portal da Cidade</span>
          <NavLink
            to="/sobre"
            onClick={onItemClick}
            className="hover:text-accent-text inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            <Info className="w-3 h-3" aria-hidden="true" />
            <span>Sobre</span>
          </NavLink>
        </div>
      </div>
    </div>
  )
}
