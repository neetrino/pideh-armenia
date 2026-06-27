import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const cacheKey = status ? `${CACHE_KEYS.productsFeatured}:${status}` : CACHE_KEYS.productsFeatured

    const cached = await cacheGet<unknown[]>(cacheKey)
    if (cached) {
      const response = NextResponse.json(cached)
      response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
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

    await cacheSet(cacheKey, products, CACHE_TTL_SECONDS)

    const response = NextResponse.json(products)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    logger.error('Error fetching featured products', error)
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 })
  }
}
