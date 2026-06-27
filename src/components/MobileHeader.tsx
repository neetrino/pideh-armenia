'use client'

import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { DEFAULT_BRAND_ICON } from '@/lib/brand-assets'

export default function MobileHeader() {
  const t = useTranslations('nav')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

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
    <header
      className="bg-white/95 backdrop-blur-xl shadow-lg fixed top-0 left-0 right-0 z-[100] border-b border-gray-200 md:hidden"
      style={{ position: 'fixed' }}
    >
      <div className="px-4 py-1.5">
        <div className="flex justify-between items-center gap-2">
          <LanguageSwitcher compact />

          <div className="flex-1 flex justify-center">
            <Link href="/" className="hover:opacity-80 transition-all duration-300">
              <Image
                src={DEFAULT_BRAND_ICON}
                alt="Pideh Armenia Logo"
                width={60}
                height={18}
                className="h-4 w-auto"
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 text-gray-900 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all duration-300 active:scale-95"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200 z-[100]">
            <nav className="py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-6 py-4 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 font-medium ${
                    isActive(link.href) ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-500' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
