import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { productInputSchema } from '@/lib/validations'
import { invalidateProductCaches } from '@/lib/redis'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsed = productInputSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, description, price, categoryId, image, ingredients, isAvailable, status } =
      parsed.data

    const category = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        image: image ?? '',
        ingredients: ingredients ?? [],
        isAvailable: isAvailable ?? true,
        status: status && status !== '' ? status : 'REGULAR',
      },
      include: {
        category: { select: { id: true, name: true, isActive: true } },
      },
    })

    await invalidateProductCaches()
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    logger.error('Error creating product', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
