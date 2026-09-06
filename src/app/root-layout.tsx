import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { OfflineBanner } from '@/app/offline-banner'

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center p-8 text-slate-500">
      Carregando…
    </div>
  )
}

export function RootLayout() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <ScrollRestoration />
      <OfflineBanner />
      <Outlet />
    </Suspense>
  )
}
