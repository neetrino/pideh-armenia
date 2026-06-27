import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { localeFromSearchParams } from '@/lib/content-locale'
import {
  cacheKeyForLocale,
  localizeProduct,
  localizeProducts,
  PRODUCT_SELECT,
} from '@/lib/localize-content'
import { CACHE_KEYS, CACHE_TTL_SECONDS, cacheGet, cacheSet } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = localeFromSearchParams(searchParams)
    const status = searchParams.get('status')
    const cacheKey = cacheKeyForLocale(
      status ? `${CACHE_KEYS.productsFeatured}:${status}` : CACHE_KEYS.productsFeatured,
      locale
    )

    const cached = await cacheGet<ReturnType<typeof localizeProducts>>(cacheKey)
    if (cached) {
      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
      response.headers.set('Vary', 'Accept-Language')
      return response
    }

    const whereClause: Prisma.ProductWhereInput = { isAvailable: true }

    if (status) {
      whereClause.status = status as Prisma.EnumProductStatusFilter['equals']
    } else {
      whereClause.status = { in: ['HIT', 'NEW', 'CLASSIC'] }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_SELECT,
    })

    const localized = localizeProducts(products, locale)
    await cacheSet(cacheKey, localized, CACHE_TTL_SECONDS)

    const response = NextResponse.json(localized)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    response.headers.set('Vary', 'Accept-Language')
    return response
  } catch (error) {
    logger.error('Error fetching featured products', error)
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 })
  }
}
