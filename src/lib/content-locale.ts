import { routing } from '@/i18n/routing'

export type ContentLocale = 'hy' | 'en' | 'ru'

export const CONTENT_LOCALES: readonly ContentLocale[] = ['hy', 'en', 'ru']

/** Endonym for each locale — always shown in that language (e.g. language switcher). */
export const LOCALE_NATIVE_LABEL: Record<ContentLocale, string> = {
  hy: 'Հայերեն',
  en: 'English',
  ru: 'Русский',
}

const LOCALE_SET = new Set<string>(CONTENT_LOCALES)

const LOCALE_SUFFIX: Record<ContentLocale, 'Hy' | 'En' | 'Ru'> = {
  hy: 'Hy',
  en: 'En',
  ru: 'Ru',
}

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

/** Build a localized DB column key, e.g. `name` + `hy` → `nameHy`. */
export function localizedFieldKey(
  base: 'name' | 'description' | 'ingredients',
  locale: ContentLocale
): `${typeof base}${'Hy' | 'En' | 'Ru'}` {
  return `${base}${LOCALE_SUFFIX[locale]}`
}

/** Fallback order: requested locale, then Armenian (primary), then others. */
export function localeFallbackOrder(locale: ContentLocale): ContentLocale[] {
  return [...new Set<ContentLocale>([locale, 'hy', 'en', 'ru'])]
}
