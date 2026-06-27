import type { ContentLocale } from '@/lib/content-locale'

/** BCP 47 tags for Intl (currency display). */
const INTL_LOCALE: Record<ContentLocale, string> = {
  hy: 'hy-AM',
  en: 'en-US',
  ru: 'ru-RU',
}

/** hreflang values for metadata alternates. */
export const HREFLANG_BY_LOCALE: Record<ContentLocale, string> = {
  hy: 'hy-AM',
  en: 'en',
  ru: 'ru',
}

/** Format AMD price for storefront locale (no decimals). */
export function formatPrice(amount: number, locale: ContentLocale): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: 'currency',
    currency: 'AMD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount)
}
