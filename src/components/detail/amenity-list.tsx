import type { Amenity } from '@/types'
import { getAmenityIcon } from './amenity-icons'

export interface AmenityListProps {
  amenities: Amenity[]
}

export function AmenityList({ amenities }: AmenityListProps) {
  if (!amenities || amenities.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-2.5">
      {amenities.map((amenity) => {
        const Icon = getAmenityIcon(amenity.icon, amenity.slug)
        return (
          <li
            key={amenity.id}
            className="inline-flex items-center gap-2 py-2 px-3.5 rounded-full bg-slate-100/80 border border-black/[0.04] text-xs font-semibold text-text-secondary shadow-2xs"
          >
            <Icon className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{amenity.name}</span>
          </li>
        )
      })}
    </ul>
  )
}
