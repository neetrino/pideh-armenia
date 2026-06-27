import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { productInputSchema } from '@/lib/validations'
import { invalidateProductCaches } from '@/lib/redis'

const ADMIN_PRODUCT_SELECT = {
  id: true,
  slug: true,
  nameHy: true,
  nameEn: true,
  nameRu: true,
  descriptionHy: true,
  descriptionEn: true,
  descriptionRu: true,
  ingredientsHy: true,
  ingredientsEn: true,
  ingredientsRu: true,
  price: true,
  image: true,
  categoryId: true,
  isAvailable: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: { id: true, slug: true, nameHy: true, isActive: true },
  },
} as const

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      select: ADMIN_PRODUCT_SELECT,
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    logger.error('Error fetching admin product', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const parsed = productInputSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    if (data.slug !== existing.slug) {
      return NextResponse.json({ error: 'Product slug cannot be changed' }, { status: 400 })
    }

    const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        nameHy: data.nameHy,
        nameEn: data.nameEn,
        nameRu: data.nameRu,
        descriptionHy: data.descriptionHy,
        descriptionEn: data.descriptionEn,
        descriptionRu: data.descriptionRu,
        ingredientsHy: data.ingredientsHy,
        ingredientsEn: data.ingredientsEn,
        ingredientsRu: data.ingredientsRu,
        price: data.price,
        categoryId: data.categoryId,
        image: data.image ?? existing.image,
        isAvailable: data.isAvailable ?? existing.isAvailable,
        status: data.status && data.status !== '' ? data.status : 'REGULAR',
      },
      select: ADMIN_PRODUCT_SELECT,
    })

    await invalidateProductCaches()
    return NextResponse.json(updatedProduct)
  } catch (error) {
    logger.error('Error updating product', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}
