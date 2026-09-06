import { lazy } from 'react'

export const BusinessListPage = lazy(() => import('@/pages/businesses'))
export const BusinessDetailPage = lazy(
  () => import('@/pages/businesses/detail'),
)
export const EventListPage = lazy(() => import('@/pages/events'))
export const EventDetailPage = lazy(() => import('@/pages/events/detail'))
export const PackageListPage = lazy(() => import('@/pages/packages'))
export const PackageDetailPage = lazy(() => import('@/pages/packages/detail'))
export const LodgingListPage = lazy(() => import('@/pages/lodging'))
export const LodgingDetailPage = lazy(() => import('@/pages/lodging/detail'))
export const DiningListPage = lazy(() => import('@/pages/dining'))
export const DiningDetailPage = lazy(() => import('@/pages/dining/detail'))
export const SubmitPage = lazy(() => import('@/pages/submit'))
export const SearchPage = lazy(() => import('@/pages/search'))
export const AboutPage = lazy(() => import('@/pages/about'))
export const NotFoundPage = lazy(() => import('@/pages/not-found'))

// Admin
export const AdminLoginPage = lazy(() => import('@/pages/admin/login'))
export const AdminDashboardPage = lazy(() => import('@/pages/admin'))

export const AdminBusinessListPage = lazy(() => import('@/pages/admin/businesses/list'))
export const AdminBusinessFormPage = lazy(() => import('@/pages/admin/businesses/form'))

export const AdminEventListPage = lazy(() => import('@/pages/admin/events/list'))
export const AdminEventFormPage = lazy(() => import('@/pages/admin/events/form'))

export const AdminPackageListPage = lazy(() => import('@/pages/admin/packages/list'))
export const AdminPackageFormPage = lazy(() => import('@/pages/admin/packages/form'))

export const AdminLodgingListPage = lazy(() => import('@/pages/admin/lodging/list'))
export const AdminLodgingFormPage = lazy(() => import('@/pages/admin/lodging/form'))

export const AdminDiningListPage = lazy(() => import('@/pages/admin/dining/list'))
export const AdminDiningFormPage = lazy(() => import('@/pages/admin/dining/form'))

export const AdminSubmissionsListPage = lazy(() => import('@/pages/admin/submissions/list'))
