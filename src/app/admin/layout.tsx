import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import '../globals.css'
import ClientProviders from '@/components/ClientProviders'
import ServiceWorkerProvider from '@/components/ServiceWorkerProvider'
import { loadMessages } from '@/i18n/load-messages'
import type { Locale } from '@/i18n/routing'
import { LOCALE_COOKIE_NAME, resolveLocale } from '@/lib/locale-cookie'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Pideh Armenia — Admin',
  robots: { index: false, follow: false },
}

type AdminLayoutProps = {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies()
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value) as Locale

  setRequestLocale(locale)
  const messages = await loadMessages(locale)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ServiceWorkerProvider />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders>{children}</ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
