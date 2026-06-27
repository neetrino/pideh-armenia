import brandIconImage from '@/app/icon.png'
import type { Metadata } from 'next'
import type { StaticImageData } from 'next/image'

/** Default brand icon (also used as favicon via `src/app/icon.png`). */
export const DEFAULT_BRAND_ICON: StaticImageData = brandIconImage

/** Public URL for the default brand icon (headers, admin preview, service worker). */
export const DEFAULT_BRAND_ICON_PATH = '/icon.png'

/** Favicon and apple-touch-icon metadata shared across storefront and admin layouts. */
export const BRAND_ICONS_METADATA: NonNullable<Metadata['icons']> = {
  icon: DEFAULT_BRAND_ICON_PATH,
  shortcut: DEFAULT_BRAND_ICON_PATH,
  apple: '/apple-icon.png',
}
