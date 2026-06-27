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

    const data = parsed.data
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    const slugTaken = await prisma.product.findUnique({ where: { slug: data.slug } })
    if (slugTaken) {
      return NextResponse.json({ error: 'Product with this slug already exists' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        slug: data.slug,
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
        image: data.image ?? '',
        isAvailable: data.isAvailable ?? true,
        status: data.status,
      },
      include: {
        category: { select: { id: true, slug: true, nameHy: true, isActive: true } },
      },
    })

    await invalidateProductCaches()
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    logger.error('Error creating product', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
