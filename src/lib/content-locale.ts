import type { ContentLocale } from '@prisma/client'
import { routing } from '@/i18n/routing'

export const CONTENT_LOCALES: readonly ContentLocale[] = ['hy', 'en', 'ru']

const LOCALE_SET = new Set<string>(CONTENT_LOCALES)

/** Parse `?locale=` or header value into a supported content locale. */
export function parseContentLocale(value: string | null | undefined): ContentLocale {
  if (value && LOCALE_SET.has(value)) {
    return value as ContentLocale
  }
  return routing.defaultLocale as ContentLocale
}

/** Locale from URL search params; defaults to `hy`. */
export function localeFromSearchParams(searchParams: URLSearchParams): ContentLocale {
  return parseContentLocale(searchParams.get('locale'))
}
