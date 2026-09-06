import { useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Drawer } from '@/components/ui/drawer'

export function AdminShell() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  const [prevLocationKey, setPrevLocationKey] = useState(location.key)
  if (prevLocationKey !== location.key) {
    setPrevLocationKey(location.key)
    if (isDrawerOpen) setIsDrawerOpen(false)
  }

  return (
    <div className="min-h-screen bg-bg-page flex text-text-primary">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-slate-900 focus:font-semibold focus:rounded-md focus:ring-2 focus:ring-slate-900"
      >
        Pular para o conteúdo principal
      </a>

      <AdminSidebar className="hidden lg:flex lg:w-64 lg:shrink-0 lg:fixed lg:inset-y-0" />

      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 bg-slate-900 flex items-center px-3 border-b border-slate-800">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Abrir menu"
          className="w-9 h-9 rounded-lg text-slate-200 flex items-center justify-center hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <span className="ml-3 text-sm font-bold text-white">ConectaLapa Admin</span>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          menuButtonRef.current?.focus()
        }}
        side="left"
        className="p-0 w-72"
      >
        <AdminSidebar onNavigate={() => setIsDrawerOpen(false)} className="h-full" />
      </Drawer>

      <main id="admin-main" tabIndex={-1} className="flex-1 lg:pl-64 pt-14 lg:pt-0 focus:outline-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
