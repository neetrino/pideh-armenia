import brandIconImage from '@/app/icon.png'
import type { StaticImageData } from 'next/image'

/** Default brand icon (also used as favicon via `src/app/icon.png`). */
export const DEFAULT_BRAND_ICON: StaticImageData = brandIconImage

/** Public URL for the default brand icon (headers, admin preview, service worker). */
export const DEFAULT_BRAND_ICON_PATH = '/icon.png'
