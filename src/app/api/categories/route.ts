import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { localeFromSearchParams } from '@/lib/content-locale'
import { cacheKeyForLocale, localizeCategory } from '@/lib/localize-content'
import { CACHE_KEYS, CACHE_TTL_SECONDS, cacheGet, cacheSet } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const locale = localeFromSearchParams(new URL(request.url).searchParams)
    const cacheKey = cacheKeyForLocale(CACHE_KEYS.categories, locale)

    const cached = await cacheGet<unknown[]>(cacheKey)
    if (cached) {
      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
      response.headers.set('Vary', 'Accept-Language')
      return response
    }

    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        products: {
          some: { isAvailable: true },
        },
      },
      include: {
        translations: {
          select: { locale: true, name: true, description: true },
        },
        _count: {
          select: {
            products: { where: { isAvailable: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    const localized = categories.map(({ translations, ...category }) => ({
      ...localizeCategory({ ...category, translations }, locale),
      _count: category._count,
    }))

    await cacheSet(cacheKey, localized, CACHE_TTL_SECONDS)

    const response = NextResponse.json(localized)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    response.headers.set('Vary', 'Accept-Language')
    return response
  } catch (error) {
    logger.error('Error fetching categories', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
