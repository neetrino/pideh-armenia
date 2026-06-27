'use client'

import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCart } from '@/hooks/useCart'
import { useHydration } from '@/hooks/useHydration'
import { useSession } from 'next-auth/react'
import { Link, usePathname } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { UserMenu } from '@/components/UserMenu'

export default function DesktopHeader() {
  const t = useTranslations('nav')
  const isHydrated = useHydration()
  const { getTotalItems, openCart, isCartOpen } = useCart()
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const navLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/products' as const, label: t('menu') },
    { href: '/about' as const, label: t('about') },
    { href: '/contact' as const, label: t('contact') },
  ]

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-[60]" style={{ position: 'fixed' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 gap-3">
          <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
            <Image
              src="/logo.png?v=2"
              alt="Pideh Armenia Logo"
              width={180}
              height={60}
              className="h-16 w-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                  isActive(link.href)
                    ? 'text-orange-500 bg-orange-50 shadow-md'
                    : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                <span>{link.label}</span>
                {isActive(link.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-orange-500 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <LanguageSwitcher />

            <button
              type="button"
              onClick={openCart}
              className={`relative p-3 rounded-xl transition-all duration-300 ${
                isCartOpen
                  ? 'text-orange-500 bg-orange-50 shadow-md'
                  : 'text-gray-900 hover:text-orange-500 hover:bg-orange-50'
              }`}
              aria-label={t('cart')}
            >
              <ShoppingCart className="h-6 w-6" />
              {isHydrated && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <UserMenu
                userName={session.user?.name ?? t('profile')}
                isAdmin={session.user?.role === 'ADMIN'}
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive('/login')
                      ? 'text-orange-500 bg-orange-50 shadow-md'
                      : 'text-gray-900 hover:text-orange-500 hover:bg-orange-50'
                  }`}
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    isActive('/register')
                      ? 'text-orange-500 bg-orange-50 shadow-md'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
