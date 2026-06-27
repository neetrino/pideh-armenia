'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, Languages } from 'lucide-react'
import { useLocale } from 'next-intl'
import { usePathname as useNextPathname } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { LOCALE_NATIVE_LABEL } from '@/lib/content-locale'
import { setLocaleCookie } from '@/lib/locale-cookie'

const LOCALE_CODES: Locale[] = ['hy', 'en', 'ru']

const LOCALE_SHORT_LABEL: Record<Locale, string> = {
  hy: 'HY',
  en: 'EN',
  ru: 'RU',
}

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const fullPathname = useNextPathname()
  const isAdminRoute = fullPathname.startsWith('/admin')
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        closeMenu()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeMenu])

  const switchLocale = (code: Locale) => {
    if (code === locale) {
      closeMenu()
      return
    }

    setLocaleCookie(code)
    closeMenu()

    if (isAdminRoute) {
      window.location.reload()
      return
    }

    router.replace(pathname, { locale: code })
  }

  const menuItemClass =
    'flex w-full items-center justify-between px-3 py-2 text-sm font-medium transition-colors hover:bg-orange-50 hover:text-orange-600'

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Language"
        className={`flex items-center gap-1 rounded-xl font-semibold transition-all duration-300 ${
          compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-2 text-sm'
        } ${
          isOpen
            ? 'bg-orange-50 text-orange-500 shadow-md'
            : 'text-gray-900 hover:bg-orange-50 hover:text-orange-500'
        }`}
      >
        <Languages className={compact ? 'h-4 w-4 shrink-0' : 'h-5 w-5 shrink-0'} />
        <span>{LOCALE_SHORT_LABEL[locale]}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-full z-[70] mt-1 min-w-[9.5rem] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
        >
          {LOCALE_CODES.map((code) => (
            <li key={code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={locale === code}
                onClick={() => switchLocale(code)}
                className={`${menuItemClass} ${
                  locale === code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                }`}
              >
                <span>{LOCALE_NATIVE_LABEL[code]}</span>
                <span className="text-xs font-semibold uppercase text-gray-400">{LOCALE_SHORT_LABEL[code]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function isValidLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale)
}
