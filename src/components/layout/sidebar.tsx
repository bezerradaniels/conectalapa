import { SidebarContent } from '@/components/layout/sidebar-content'

export function Sidebar() {
  return (
    <aside
      aria-label="Barra lateral de navegação"
      className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border-hairline bg-bg-surface z-30 overflow-y-auto"
    >
      <SidebarContent />
    </aside>
  )
}
