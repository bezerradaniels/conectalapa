import { Head } from '@/components/seo/head'
import { HeroSection } from './components/hero-section'
import { CategoryNavSection } from './components/category-nav-section'
import { UpcomingEventsSection } from './components/upcoming-events-section'
import { TravelPackagesSection } from './components/travel-packages-section'
import { RecentEntriesSection } from './components/recent-entries-section'
import { ListingCtaSection } from './components/listing-cta-section'

export default function HomePage() {
  return (
    <div className="space-y-2">
      <Head
        title="Guia da Cidade & Romaria"
        description="Guia comercial, hospedagem, gastronomia, pacotes turísticos e agenda de eventos de Bom Jesus da Lapa, Bahia."
      />

      <HeroSection />
      <CategoryNavSection />
      <UpcomingEventsSection />
      <TravelPackagesSection />
      <RecentEntriesSection />
      <ListingCtaSection />
    </div>
  )
}
