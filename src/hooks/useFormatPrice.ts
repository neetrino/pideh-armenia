'use client'

import { useCallback } from 'react'
import { useLocale } from 'next-intl'
import { formatPrice as formatPriceForLocale } from '@/lib/format-price'
import type { ContentLocale } from '@/lib/content-locale'

/** Client hook: format AMD prices for the active storefront locale. */
export function useFormatPrice() {
  const locale = useLocale() as ContentLocale
  return useCallback(
    (amount: number) => formatPriceForLocale(amount, locale),
    [locale]
  )
}
