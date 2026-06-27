import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'

// PATCH /api/admin/orders/[id]/status - изменить статус заказа (только для админов)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем аутентификацию
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Проверяем права администратора
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Получаем данные из запроса
    const body = await request.json()
    const { status } = body

    // Валидируем статус
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      )
    }

    // Проверяем существование заказа
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Обновляем статус заказа
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              }
            }
          }
        }
      }
    })

    // Вычисляем общую сумму заказа
    const totalAmount = updatedOrder.items.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    )

    return NextResponse.json({
      ...updatedOrder,
      totalAmount
    })
  } catch (error) {
    logger.error('Error updating order status', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}
