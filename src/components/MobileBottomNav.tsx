'use client'

import { Home, ShoppingCart, User, type LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCart } from '@/hooks/useCart'
import { useHydration } from '@/hooks/useHydration'
import { Link, usePathname } from '@/i18n/navigation'

type NavLinkItem = {
  type: 'link'
  href: '/' | '/profile'
  label: string
  icon: LucideIcon
}

type NavCartItem = {
  type: 'cart'
  label: string
  icon: LucideIcon
}

type NavItem = NavLinkItem | NavCartItem

export default function MobileBottomNav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const isHydrated = useHydration()
  const { getTotalItems, openCart, isCartOpen } = useCart()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const navItems: NavItem[] = [
    { type: 'link', href: '/', label: t('home'), icon: Home },
    { type: 'cart', label: t('cart'), icon: ShoppingCart },
    { type: 'link', href: '/profile', label: t('profile'), icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50 shadow-2xl">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => {
          const Icon = item.icon

          if (item.type === 'cart') {
            const active = isCartOpen

            return (
              <button
                key="cart"
                type="button"
                onClick={openCart}
                className={`flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 relative ${
                  active
                    ? 'text-orange-500 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon className={`h-6 w-6 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
                  {isHydrated && getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-semibold mt-1 ${active ? 'text-orange-600' : ''}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-b-full shadow-lg" />
                )}
              </button>
            )
          }

          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-4 rounded-2xl transition-all duration-300 relative ${
                active
                  ? 'text-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <Icon className={`h-6 w-6 transition-transform duration-300 ${active ? 'scale-110' : ''}`} />
              <span className={`text-xs font-semibold mt-1 ${active ? 'text-orange-600' : ''}`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-b-full shadow-lg" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
