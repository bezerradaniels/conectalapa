import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/app/root-layout'
import { RouteError } from '@/app/route-error'
import { AppShell } from '@/components/layout/app-shell'
import HomePage from '@/pages/home'
import {
  BusinessListPage,
  BusinessDetailPage,
  EventListPage,
  EventDetailPage,
  PackageListPage,
  PackageDetailPage,
  LodgingListPage,
  LodgingDetailPage,
  DiningListPage,
  DiningDetailPage,
  SubmitPage,
  AdminDashboardPage,
  AboutPage,
  NotFoundPage,
} from '@/app/lazy-pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      {
        element: <AppShell />,
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
          { path: 'sobre', element: <AboutPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        path: 'dev/tokens',
        lazy: () => import('@/pages/dev/tokens').then((m) => ({ Component: m.default })),
      },
    ],
  },
])
