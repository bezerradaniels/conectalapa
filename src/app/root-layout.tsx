import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'

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
      <Outlet />
    </Suspense>
  )
}
