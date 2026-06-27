import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { CACHE_KEYS, CACHE_TTL_SECONDS, cacheGet, cacheSet } from '@/lib/redis'

const PRODUCT_SELECT = {
  id: true,
  name: true,
  description: true,
  price: true,
  categoryId: true,
  category: { select: { id: true, name: true, isActive: true } },
  image: true,
  ingredients: true,
  isAvailable: true,
  status: true,
  createdAt: true,
} as const

export async function GET() {
  try {
    const cached = await cacheGet<unknown>(CACHE_KEYS.productsBanner)
    if (cached) {
      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
      return response
    }

    const product = await prisma.product.findFirst({
      where: { isAvailable: true, status: 'BANNER' },
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_SELECT,
    })

    await cacheSet(CACHE_KEYS.productsBanner, product, CACHE_TTL_SECONDS)

    const response = NextResponse.json(product)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    logger.error('Error fetching banner product', error)
    return NextResponse.json({ error: 'Failed to fetch banner product' }, { status: 500 })
  }
}
