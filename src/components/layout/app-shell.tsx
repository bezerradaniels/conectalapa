import { useState, useRef } from 'react'
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { SidebarContent } from '@/components/layout/sidebar-content'
import { MobileHeader } from '@/components/layout/mobile-header'
import { Drawer } from '@/components/ui/drawer'

export function AppShell() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  // Requirement: The drawer closes on route change.
  // Using React's recommended "adjust state during render" pattern instead of effect.
  const [prevLocationKey, setPrevLocationKey] = useState(location.key)
  if (prevLocationKey !== location.key) {
    setPrevLocationKey(location.key)
    if (isDrawerOpen) {
      setIsDrawerOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-page flex flex-col text-text-primary">
      {/* Scroll restoration with browser-back position memory */}
      <ScrollRestoration />

      {/* Accessible Skip Link — first focusable element in DOM */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-slate-900 focus:font-semibold focus:rounded-md focus:ring-2 focus:ring-slate-900 focus:shadow-md"
      >
        Pular para o conteúdo principal
      </a>

      {/* Mobile Top Header (< lg) */}
      <MobileHeader
        ref={menuButtonRef}
        isDrawerOpen={isDrawerOpen}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Mobile Drawer Navigation (< lg) */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          menuButtonRef.current?.focus()
        }}
        side="left"
        className="p-0 w-72"
      >
        <SidebarContent onItemClick={() => setIsDrawerOpen(false)} />
      </Drawer>

      {/* Desktop Persistent Sidebar (>= lg) */}
      <Sidebar />

      {/* Main Content Column */}
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 lg:pl-64 focus:outline-none flex flex-col"
      >
        <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
