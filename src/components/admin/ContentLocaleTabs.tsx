'use client'

import type { ContentLocale } from '@/lib/content-locale'
import { ADMIN_LOCALE_TABS } from '@/lib/admin-content-locales'

type ContentLocaleTabsProps = {
  activeLocale: ContentLocale
  onChange: (locale: ContentLocale) => void
}

/** Armenia | English | Russian tabs for admin translation forms. */
export function ContentLocaleTabs({ activeLocale, onChange }: ContentLocaleTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
      {ADMIN_LOCALE_TABS.map(({ locale, label }) => (
        <button
          key={locale}
          type="button"
          onClick={() => onChange(locale)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeLocale === locale
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
