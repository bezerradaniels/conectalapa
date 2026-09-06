import { Suspense, lazy } from 'react'
import { Outlet, createBrowserRouter } from 'react-router-dom'
import { RouteError } from '@/app/route-error'
import HomePage from '@/pages/home'

const BusinessListPage = lazy(() => import('@/pages/businesses'))
const BusinessDetailPage = lazy(() => import('@/pages/businesses/detail'))
const EventListPage = lazy(() => import('@/pages/events'))
const EventDetailPage = lazy(() => import('@/pages/events/detail'))
const PackageListPage = lazy(() => import('@/pages/packages'))
const PackageDetailPage = lazy(() => import('@/pages/packages/detail'))
const LodgingListPage = lazy(() => import('@/pages/lodging'))
const LodgingDetailPage = lazy(() => import('@/pages/lodging/detail'))
const DiningListPage = lazy(() => import('@/pages/dining'))
const DiningDetailPage = lazy(() => import('@/pages/dining/detail'))
const SubmitPage = lazy(() => import('@/pages/submit'))
const AdminDashboardPage = lazy(() => import('@/pages/admin'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center p-8 text-slate-500">
      Carregando…
    </div>
  )
}

function RootLayout() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Outlet />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'empresas', element: <BusinessListPage /> },
      { path: 'empresas/:slug', element: <BusinessDetailPage /> },
      { path: 'eventos', element: <EventListPage /> },
      { path: 'eventos/:slug', element: <EventDetailPage /> },
      { path: 'pacotes', element: <PackageListPage /> },
      { path: 'pacotes/:slug', element: <PackageDetailPage /> },
      { path: 'hospedagem', element: <LodgingListPage /> },
      { path: 'hospedagem/:slug', element: <LodgingDetailPage /> },
      { path: 'gastronomia', element: <DiningListPage /> },
      { path: 'gastronomia/:slug', element: <DiningDetailPage /> },
      { path: 'solicitar', element: <SubmitPage /> },
      { path: 'admin', element: <AdminDashboardPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
