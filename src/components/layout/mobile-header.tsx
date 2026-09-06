import { forwardRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface MobileHeaderProps {
  isDrawerOpen: boolean
  onOpenDrawer: () => void
}

export const MobileHeader = forwardRef<HTMLButtonElement, MobileHeaderProps>(
  function MobileHeader({ isDrawerOpen, onOpenDrawer }, ref) {
    const navigate = useNavigate()

    return (
      <header className="lg:hidden sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border-hairline bg-bg-surface/95 px-4 backdrop-blur-xs">
        {/* Left: Menu Trigger */}
        <Button
          ref={ref}
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenDrawer}
          aria-label="Abrir menu"
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-sidebar-drawer"
          leadingIcon={<Menu className="w-5 h-5 text-text-primary" aria-hidden="true" />}
        />

        {/* Center: Wordmark */}
        <Link
          to="/"
          className="text-base font-bold tracking-tight text-text-primary flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1"
        >
          Conecta<span className="text-accent-text">Lapa</span>
        </Link>

        {/* Right: Search Action */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate('/empresas')}
          aria-label="Buscar estabelecimentos e eventos"
          leadingIcon={<Search className="w-5 h-5 text-text-primary" aria-hidden="true" />}
        />
      </header>
    )
  }
)
