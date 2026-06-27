import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { invalidateCategoryCaches } from '@/lib/redis'

// GET /api/admin/categories/[id] - получить категорию по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    logger.error('Error fetching category', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/categories/[id] - обновить категорию
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, description, isActive } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Проверяем, что категория существует
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Проверяем, что новое имя не конфликтует с существующими категориями
    if (name.trim() !== existingCategory.name) {
      const nameConflict = await prisma.category.findUnique({
        where: { name: name.trim() }
      })

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 400 }
        )
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isActive: Boolean(isActive)
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    await invalidateCategoryCaches()

    return NextResponse.json(updatedCategory)
  } catch (error) {
    logger.error('Error updating category', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/[id] - удалить категорию
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Проверяем, что категория существует
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Проверяем, что в категории нет товаров
    if (existingCategory._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Please move or delete products first.' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id }
    })

    await invalidateCategoryCaches()

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    logger.error('Error deleting category', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
