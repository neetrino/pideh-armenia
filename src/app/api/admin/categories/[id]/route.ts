import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { categoryInputSchema } from '@/lib/validations'
import { invalidateCategoryCaches } from '@/lib/redis'

const ADMIN_CATEGORY_SELECT = {
  id: true,
  slug: true,
  nameHy: true,
  nameEn: true,
  nameRu: true,
  descriptionHy: true,
  descriptionEn: true,
  descriptionRu: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { products: true } },
} as const

function toAdminCategory<T extends { nameRu: string }>(row: T) {
  return { ...row, name: row.nameRu }
}

export async function GET(
  _request: NextRequest,
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
      select: ADMIN_CATEGORY_SELECT,
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(toAdminCategory(category))
  } catch (error) {
    logger.error('Error fetching category', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

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
    const existing = await prisma.category.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const parsed = categoryInputSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    if (data.slug !== existing.slug) {
      return NextResponse.json({ error: 'Category slug cannot be changed' }, { status: 400 })
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        nameHy: data.nameHy,
        nameEn: data.nameEn,
        nameRu: data.nameRu,
        descriptionHy: data.descriptionHy ?? null,
        descriptionEn: data.descriptionEn ?? null,
        descriptionRu: data.descriptionRu ?? null,
        isActive: data.isActive ?? existing.isActive,
      },
      select: ADMIN_CATEGORY_SELECT,
    })

    await invalidateCategoryCaches()
    return NextResponse.json(toAdminCategory(updatedCategory))
  } catch (error) {
    logger.error('Error updating category', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    if (existing._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products. Please move or delete products first.' },
        { status: 400 }
      )
    }

    await prisma.category.delete({ where: { id } })
    await invalidateCategoryCaches()
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    logger.error('Error deleting category', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
