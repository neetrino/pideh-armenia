import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import ClientProviders from '@/components/ClientProviders'
import ServiceWorkerProvider from '@/components/ServiceWorkerProvider'

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

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ServiceWorkerProvider />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
