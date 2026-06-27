import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { localeFromSearchParams } from '@/lib/content-locale'
import {
  localizeProducts,
  PRODUCT_WITH_TRANSLATIONS_SELECT,
} from '@/lib/localize-content'

// GET /api/products — public list; ?locale=hy|en|ru
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = localeFromSearchParams(searchParams)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const status = searchParams.get('status')

    const whereClause: Prisma.ProductWhereInput = {
      isAvailable: true,
    }

    if (category && category !== 'Все') {
      whereClause.category = { name: category }
    }

    if (status) {
      whereClause.status = status as Prisma.EnumProductStatusFilter['equals']
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        {
          translations: {
            some: {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ]
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_WITH_TRANSLATIONS_SELECT,
    })

    const response = NextResponse.json(localizeProducts(products, locale))
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    response.headers.set('Vary', 'Accept-Language')
    return response
  } catch (error) {
    logger.error('Error fetching products', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
