'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

const LOCALE_CODES: Locale[] = ['hy', 'en', 'ru']

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('language')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div
      className={`flex overflow-hidden rounded-xl border border-gray-200 bg-white text-sm ${
        compact ? 'text-xs' : ''
      }`}
      role="group"
      aria-label="Language"
    >
      {LOCALE_CODES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => router.replace(pathname, { locale: code })}
          className={`px-2.5 py-1.5 font-medium transition-colors sm:px-3 sm:py-2 ${
            locale === code
              ? 'bg-orange-500 text-white'
              : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
          }`}
          aria-pressed={locale === code}
        >
          {t(code)}
        </button>
      ))}
    </div>
  )
}

export function isValidLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale)
}
