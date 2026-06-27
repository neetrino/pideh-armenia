import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { CACHE_KEYS, CACHE_TTL_SECONDS, cacheGet, cacheSet } from '@/lib/redis'

export async function GET() {
  try {
    const cached = await cacheGet<unknown[]>(CACHE_KEYS.categories)
    if (cached) {
      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
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
        _count: {
          select: {
            products: { where: { isAvailable: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    await cacheSet(CACHE_KEYS.categories, categories, CACHE_TTL_SECONDS)

    const response = NextResponse.json(categories)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    logger.error('Error fetching categories', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
