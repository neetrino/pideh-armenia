import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { buildLocaleMetadata, PAGE_METADATA } from '@/lib/locale-metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const lang = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale
  const copy = PAGE_METADATA['/about'][lang]

  return buildLocaleMetadata({
    locale: lang,
    title: copy.title,
    description: copy.description,
    path: '/about',
  })
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
