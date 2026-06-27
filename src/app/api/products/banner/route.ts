import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { localeFromSearchParams } from '@/lib/content-locale'
import {
  cacheKeyForLocale,
  localizeProduct,
  PRODUCT_WITH_TRANSLATIONS_SELECT,
} from '@/lib/localize-content'
import { CACHE_KEYS, CACHE_TTL_SECONDS, cacheGet, cacheSet } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const locale = localeFromSearchParams(new URL(request.url).searchParams)
    const cacheKey = cacheKeyForLocale(CACHE_KEYS.productsBanner, locale)

    const cached = await cacheGet<ReturnType<typeof localizeProduct>>(cacheKey)
    if (cached) {
      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
      response.headers.set('Vary', 'Accept-Language')
      return response
    }

    const product = await prisma.product.findFirst({
      where: { isAvailable: true, status: 'BANNER' },
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_WITH_TRANSLATIONS_SELECT,
    })

    const localized = product ? localizeProduct(product, locale) : null
    await cacheSet(cacheKey, localized, CACHE_TTL_SECONDS)

    const response = NextResponse.json(localized)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    response.headers.set('Vary', 'Accept-Language')
    return response
  } catch (error) {
    logger.error('Error fetching banner product', error)
    return NextResponse.json({ error: 'Failed to fetch banner product' }, { status: 500 })
  }
}
