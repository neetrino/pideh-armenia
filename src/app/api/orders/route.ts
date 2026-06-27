import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { orderSchema } from '@/lib/validations'

const ORDER_INCLUDE = {
  items: {
    include: {
      product: { select: { name: true, image: true } },
    },
  },
} as const

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    logger.error('Orders API error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    const parsed = orderSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, phone, address, paymentMethod, notes, items, total, deliveryTime } = parsed.data

    const productIds = items.map((item) => item.productId)
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    })
    const existingIds = new Set(existingProducts.map((product) => product.id))
    const missingProducts = productIds.filter((id) => !existingIds.has(id))

    if (missingProducts.length > 0) {
      return NextResponse.json(
        { error: `Products not found: ${missingProducts.join(', ')}` },
        { status: 400 }
      )
    }

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        name: name ?? 'Guest Customer',
        status: 'PENDING',
        total,
        address,
        phone,
        notes,
        paymentMethod,
        deliveryTime,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: ORDER_INCLUDE,
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    logger.error('Create order API error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
