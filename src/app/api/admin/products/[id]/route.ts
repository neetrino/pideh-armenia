import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { invalidateProductCaches } from '@/lib/redis'

// GET /api/admin/products/[id] - получить товар по ID для админки
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    logger.error('Error fetching admin product', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/products/[id] - обновить товар (только для админов)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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
    const { name, description, price, categoryId, image, ingredients, isAvailable, status } = body

    // Проверяем существование товара
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Валидация цены
    if (price !== undefined && (!Number.isInteger(price) || price <= 0)) {
      return NextResponse.json(
        { error: 'Price must be a positive integer (AMD)' },
        { status: 400 }
      )
    }

    // Валидация категории
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      })
      
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        )
      }
    }

    // Валидация статуса (пустая строка означает REGULAR)
    if (status !== undefined) {
      const validStatuses = ['', 'REGULAR', 'HIT', 'NEW', 'CLASSIC', 'BANNER']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: ' + validStatuses.filter(s => s).join(', ') },
          { status: 400 }
        )
      }
    }

    // Обновляем товар
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(categoryId && { categoryId }),
        ...(image !== undefined && { image: image || 'no-image' }), // Специальное значение для отсутствия изображения
        ...(ingredients && { ingredients }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(status !== undefined && { status: status || 'REGULAR' }) // Если статус пустой, то REGULAR
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            isActive: true
          }
        }
      }
    })

    await invalidateProductCaches()
    return NextResponse.json(updatedProduct)
  } catch (error) {
    logger.error('Error updating product', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}