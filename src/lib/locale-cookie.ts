import { hasLocale } from 'next-intl'
import { routing, type Locale } from '@/i18n/routing'

/** Cookie used by next-intl middleware and admin locale sync. */
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

export function parseLocaleCookie(value: string | undefined | null): Locale | null {
  if (value && hasLocale(routing.locales, value)) {
    return value
  }
  return null
}

export function resolveLocale(value: string | undefined | null): Locale {
  return parseLocaleCookie(value) ?? routing.defaultLocale
}

/** Client-side: persist locale for `/admin` routes (no locale prefix in URL). */
export function setLocaleCookie(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=31536000;samesite=lax`
}
