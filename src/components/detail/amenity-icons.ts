import {
  Wifi,
  Car,
  Dog,
  Wind,
  Waves,
  Dumbbell,
  Coffee,
  Accessibility,
  Tv,
  WashingMachine,
  CreditCard,
  Baby,
  Music,
  ShieldCheck,
  Sun,
  Umbrella,
  GlassWater,
  BedDouble,
  Cigarette,
  CigaretteOff,
  Volume2,
  UtensilsCrossed,
  ParkingSquare,
  Sparkles,
  Snowflake,
  Star,
  type LucideIcon,
} from 'lucide-react'

/**
 * Amenity icon names are free text entered by admins (Phase 7/8), so this
 * maps common slugs/labels to a recognizable Lucide icon. Anything
 * unmatched falls back to a neutral star — still paired with its label
 * text, never shown alone, per the "ambiguous icon + label is fine, icon
 * alone is not" rule.
 */
const AMENITY_ICON_MAP: Record<string, LucideIcon> = {
  wifi: Wifi,
  'wi-fi': Wifi,
  internet: Wifi,
  estacionamento: Car,
  parking: ParkingSquare,
  garagem: Car,
  'pet-friendly': Dog,
  pet: Dog,
  pets: Dog,
  animais: Dog,
  'ar-condicionado': Wind,
  ar_condicionado: Wind,
  ac: Wind,
  climatizado: Snowflake,
  piscina: Waves,
  pool: Waves,
  academia: Dumbbell,
  gym: Dumbbell,
  'cafe-da-manha': Coffee,
  cafe_da_manha: Coffee,
  breakfast: Coffee,
  cafe: Coffee,
  acessibilidade: Accessibility,
  acessivel: Accessibility,
  accessible: Accessibility,
  tv: Tv,
  lavanderia: WashingMachine,
  laundry: WashingMachine,
  cartao: CreditCard,
  'cartao-de-credito': CreditCard,
  card: CreditCard,
  criancas: Baby,
  kids: Baby,
  'espaco-kids': Baby,
  playground: Baby,
  'musica-ao-vivo': Music,
  musica: Music,
  music: Music,
  seguranca: ShieldCheck,
  security: ShieldCheck,
  varanda: Sun,
  terrace: Sun,
  'area-externa': Umbrella,
  area_externa: Umbrella,
  bar: GlassWater,
  drinks: GlassWater,
  bebidas: GlassWater,
  quarto: BedDouble,
  apartamento: BedDouble,
  fumantes: Cigarette,
  'area-para-fumantes': Cigarette,
  'nao-fumantes': CigaretteOff,
  som: Volume2,
  'som-ambiente': Volume2,
  cardapio: UtensilsCrossed,
  buffet: UtensilsCrossed,
  destaque: Sparkles,
}

function normalizeKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
}

export function getAmenityIcon(iconOrSlug?: string | null, slug?: string | null): LucideIcon {
  const candidates = [iconOrSlug, slug].filter((v): v is string => Boolean(v && v.trim()))

  for (const candidate of candidates) {
    const key = normalizeKey(candidate)
    if (AMENITY_ICON_MAP[key]) return AMENITY_ICON_MAP[key]

    const underscored = key.replace(/-/g, '_')
    if (AMENITY_ICON_MAP[underscored]) return AMENITY_ICON_MAP[underscored]
  }

  return Star
}
