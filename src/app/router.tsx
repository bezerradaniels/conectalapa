import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/app/root-layout'
import { RouteError } from '@/app/route-error'
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
  NotFoundPage,
} from '@/app/lazy-pages'

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
