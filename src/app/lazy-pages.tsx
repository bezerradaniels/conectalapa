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
export const AdminDashboardPage = lazy(() => import('@/pages/admin'))
export const AboutPage = lazy(() => import('@/pages/about'))
export const NotFoundPage = lazy(() => import('@/pages/not-found'))
