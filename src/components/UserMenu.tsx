'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, Shield, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import LinkNext from 'next/link'
import { usePathname as useFullPathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

type UserMenuProps = {
  userName: string
  isAdmin: boolean
}

export function UserMenu({ userName, isAdmin }: UserMenuProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const fullPathname = useFullPathname()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isProfileActive = pathname.startsWith('/profile')
  const isAdminActive = fullPathname.startsWith('/admin')
  const isActive = isProfileActive || isAdminActive

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

  const menuItemClass =
    'flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600'

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all duration-300 ${
          isActive
            ? 'bg-orange-50 text-orange-500 shadow-md'
            : 'text-gray-900 hover:bg-orange-50 hover:text-orange-500'
        }`}
      >
        <User className="h-5 w-5 shrink-0" />
        <span className="hidden max-w-[8rem] truncate font-medium sm:block">{userName}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[70] mt-1 min-w-[11rem] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
        >
          <Link
            href="/profile"
            role="menuitem"
            onClick={closeMenu}
            className={`${menuItemClass} ${isProfileActive ? 'bg-orange-50 text-orange-600' : ''}`}
          >
            <User className="h-4 w-4" />
            {t('profile')}
          </Link>

          {isAdmin && (
            <LinkNext
              href="/admin"
              role="menuitem"
              onClick={closeMenu}
              className={`${menuItemClass} ${isAdminActive ? 'bg-orange-50 text-orange-600' : ''}`}
            >
              <Shield className="h-4 w-4" />
              {t('admin')}
            </LinkNext>
          )}

          <div className="my-1 border-t border-gray-100" />

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              closeMenu()
              void signOut()
            }}
            className={menuItemClass}
          >
            <LogOut className="h-4 w-4" />
            {t('logout')}
          </button>
        </div>
      )}
    </div>
  )
}
