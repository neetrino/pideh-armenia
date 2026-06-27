import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET /api/products/featured - получить товары-хиты
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // HIT, NEW, CLASSIC

    const whereClause: Prisma.ProductWhereInput = {
      isAvailable: true
    }

    if (status) {
      whereClause.status = status as Prisma.EnumProductStatusFilter['equals']
    } else {
      // Если статус не указан, возвращаем все товары с особыми статусами (кроме BANNER)
      whereClause.status = {
        in: ['HIT', 'NEW', 'CLASSIC']
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: [
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        },
        image: true,
        ingredients: true,
        isAvailable: true,
        status: true,
        createdAt: true
      }
    })

    // Добавляем кэширование на 5 минут
    const response = NextResponse.json(products)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    logger.error('Error fetching featured products', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured products' },
      { status: 500 }
    )
  }
}
