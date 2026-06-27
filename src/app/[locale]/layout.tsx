import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import '../globals.css'
import ClientProviders from '@/components/ClientProviders'
import MobileBottomNav from '@/components/MobileBottomNav'
import ServiceWorkerProvider from '@/components/ServiceWorkerProvider'
import { buildLocaleMetadata } from '@/lib/locale-metadata'
import { routing, type Locale } from '@/i18n/routing'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

type LocaleLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const titles: Record<Locale, string> = {
    hy: 'Pideh Armenia — Հայկական pidé, նոր համ',
    en: 'Pideh Armenia — Armenian pide, new taste',
    ru: 'Pideh Armenia — Армянские пиде новый вкус',
  }

  const descriptions: Record<Locale, string> = {
    hy: 'Ավանդական ձև современными начинками. 15 уникальных вкусов. Доставка по Еревану.',
    en: 'Traditional shape with modern fillings. 15 unique flavors. Delivery in Yerevan.',
    ru: 'Традиционная форма с современными начинками. 15 уникальных вкусов. Доставка по Еревану.',
  }

  const lang = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale

  return {
    ...buildLocaleMetadata({
      locale: lang,
      title: titles[lang],
      description: descriptions[lang],
    }),
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ServiceWorkerProvider />
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>
            {children}
            <MobileBottomNav />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
