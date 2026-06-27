import { NextRequest, NextResponse } from 'next/server'
import { OrderStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'

const ORDER_STATUSES = new Set<string>(Object.values(OrderStatus))

function buildStatusFilter(status: string | null): Prisma.OrderWhereInput {
  if (status && ORDER_STATUSES.has(status)) {
    return { status: status as OrderStatus }
  }
  return {}
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit
    const whereClause = buildStatusFilter(searchParams.get('status'))

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true, price: true, image: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: whereClause }),
    ])

    const ordersWithTotal = orders.map((order) => ({
      ...order,
      totalAmount: order.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    }))

    return NextResponse.json({
      orders: ordersWithTotal,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    logger.error('Error fetching admin orders', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
