import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/app/root-layout'
import { RouteError } from '@/app/route-error'
import { AppShell } from '@/components/layout/app-shell'
import { AdminShell } from '@/components/admin/admin-shell'
import { ProtectedRoute } from '@/components/admin/protected-route'
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
  SearchPage,
  AboutPage,
  NotFoundPage,
  AdminLoginPage,
  AdminDashboardPage,
  AdminBusinessListPage,
  AdminBusinessFormPage,
  AdminEventListPage,
  AdminEventFormPage,
  AdminPackageListPage,
  AdminPackageFormPage,
  AdminLodgingListPage,
  AdminLodgingFormPage,
  AdminDiningListPage,
  AdminDiningFormPage,
  AdminSubmissionsListPage,
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
          { path: 'busca', element: <SearchPage /> },
          { path: 'solicitar', element: <SubmitPage /> },
          { path: 'sobre', element: <AboutPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        path: 'admin/login',
        element: <AdminLoginPage />,
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminShell />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'empresas', element: <AdminBusinessListPage /> },
          { path: 'empresas/novo', element: <AdminBusinessFormPage /> },
          { path: 'empresas/:id', element: <AdminBusinessFormPage /> },
          { path: 'eventos', element: <AdminEventListPage /> },
          { path: 'eventos/novo', element: <AdminEventFormPage /> },
          { path: 'eventos/:id', element: <AdminEventFormPage /> },
          { path: 'pacotes', element: <AdminPackageListPage /> },
          { path: 'pacotes/novo', element: <AdminPackageFormPage /> },
          { path: 'pacotes/:id', element: <AdminPackageFormPage /> },
          { path: 'hospedagem', element: <AdminLodgingListPage /> },
          { path: 'hospedagem/novo', element: <AdminLodgingFormPage /> },
          { path: 'hospedagem/:id', element: <AdminLodgingFormPage /> },
          { path: 'gastronomia', element: <AdminDiningListPage /> },
          { path: 'gastronomia/novo', element: <AdminDiningFormPage /> },
          { path: 'gastronomia/:id', element: <AdminDiningFormPage /> },
          { path: 'solicitacoes', element: <AdminSubmissionsListPage /> },
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
