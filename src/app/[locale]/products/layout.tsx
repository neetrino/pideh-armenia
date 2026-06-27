import type { Metadata } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { buildLocaleMetadata, PAGE_METADATA } from '@/lib/locale-metadata'

type ProductsLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const lang = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale
  const copy = PAGE_METADATA['/products'][lang]

  return buildLocaleMetadata({
    locale: lang,
    title: copy.title,
    description: copy.description,
    path: '/products',
  })
}

export default async function ProductsLayout({ children }: ProductsLayoutProps) {
  return children
}
