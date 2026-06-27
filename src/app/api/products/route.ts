import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

const PRODUCT_LIST_SELECT = {
  id: true,
  name: true,
  description: true,
  price: true,
  categoryId: true,
  category: {
    select: { id: true, name: true, isActive: true },
  },
  image: true,
  ingredients: true,
  isAvailable: true,
  status: true,
  createdAt: true,
} satisfies Prisma.ProductSelect

// GET /api/products — публичный список товаров (создание товаров — в /api/admin/products)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
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
      ]
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_LIST_SELECT,
    })

    const response = NextResponse.json(products)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    logger.error('Error fetching products', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
