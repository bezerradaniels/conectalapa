import type { Amenity } from '@/types'
import { getAmenityIcon } from './amenity-icons'

export interface AmenityListProps {
  amenities: Amenity[]
}

export function AmenityList({ amenities }: AmenityListProps) {
  if (!amenities || amenities.length === 0) return null

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
      {amenities.map((amenity) => {
        const Icon = getAmenityIcon(amenity.icon, amenity.slug)
        return (
          <li key={amenity.id} className="flex items-center gap-2 text-sm text-text-secondary min-w-0">
            <Icon className="w-4 h-4 shrink-0 text-accent-text" aria-hidden="true" />
            <span className="truncate">{amenity.name}</span>
          </li>
        )
      })}
    </ul>
  )
}
