import type { Metadata } from 'next'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { HREFLANG_BY_LOCALE } from '@/lib/format-price'
import { getSiteUrl } from '@/lib/site-url'

const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  hy: 'hy_AM',
  en: 'en_US',
  ru: 'ru_RU',
}

type PageCopy = { title: string; description: string }

/** SEO copy for nested storefront routes (path without locale prefix). */
export const PAGE_METADATA: Record<string, Record<Locale, PageCopy>> = {
  '/products': {
    hy: { title: 'Մենյու — Pideh Armenia', description: 'Փիդե, կոմբո, խմիչքներ և սոուսներ։ Պատվիրեք առցանց։' },
    en: { title: 'Menu — Pideh Armenia', description: 'Pide, combos, drinks and sauces. Order online.' },
    ru: { title: 'Меню — Pideh Armenia', description: 'Пиде, комбо, напитки и соусы. Закажите онлайн.' },
  },
  '/about': {
    hy: { title: 'Մեր մասին — Pideh Armenia', description: 'Pideh Armenia-ի պատմություն և արժեքներ։' },
    en: { title: 'About — Pideh Armenia', description: 'The story and values of Pideh Armenia.' },
    ru: { title: 'О нас — Pideh Armenia', description: 'История и ценности Pideh Armenia.' },
  },
  '/contact': {
    hy: { title: 'Կապ — Pideh Armenia', description: 'Հեռախոս, հասցե և աշխատանքային ժամեր։' },
    en: { title: 'Contact — Pideh Armenia', description: 'Phone, address and opening hours.' },
    ru: { title: 'Контакты — Pideh Armenia', description: 'Телефон, адрес и часы работы.' },
  },
}

type LocaleMetadataInput = {
  locale: Locale
  title: string
  description: string
  /** Path without locale prefix, e.g. `/products` or `` for home. */
  path?: string
}

/** Build canonical URL, hreflang alternates, and Open Graph locale fields. */
export function buildLocaleMetadata({
  locale,
  title,
  description,
  path = '',
}: LocaleMetadataInput): Metadata {
  const siteUrl = getSiteUrl()
  const normalizedPath = path.startsWith('/') ? path : path ? `/${path}` : ''
  const canonical = `${siteUrl}/${locale}${normalizedPath}`

  const languages: Record<string, string> = {
    'x-default': `${siteUrl}/${routing.defaultLocale}${normalizedPath}`,
  }
  for (const loc of routing.locales) {
    languages[HREFLANG_BY_LOCALE[loc]] = `${siteUrl}/${loc}${normalizedPath}`
  }

  const alternateLocale = routing.locales
    .filter((loc) => loc !== locale)
    .map((loc) => OPEN_GRAPH_LOCALE[loc])

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: OPEN_GRAPH_LOCALE[locale],
      alternateLocale,
      type: 'website',
      siteName: 'Pideh Armenia',
    },
  }
}
