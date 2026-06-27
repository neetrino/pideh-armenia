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

/** Admin list shape: raw locale columns + `name` alias (Russian) for legacy UI. */
function toAdminCategory<T extends { nameRu: string }>(row: T) {
  return { ...row, name: row.nameRu }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'
    const whereClause = includeInactive ? {} : { isActive: true }

    const categories = await prisma.category.findMany({
      where: whereClause,
      select: ADMIN_CATEGORY_SELECT,
      orderBy: { slug: 'asc' },
    })

    return NextResponse.json(categories.map(toAdminCategory))
  } catch (error) {
    logger.error('Error fetching admin categories', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsed = categoryInputSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const slugTaken = await prisma.category.findUnique({ where: { slug: data.slug } })
    if (slugTaken) {
      return NextResponse.json({ error: 'Category with this slug already exists' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        slug: data.slug,
        nameHy: data.nameHy,
        nameEn: data.nameEn,
        nameRu: data.nameRu,
        descriptionHy: data.descriptionHy ?? null,
        descriptionEn: data.descriptionEn ?? null,
        descriptionRu: data.descriptionRu ?? null,
        isActive: data.isActive ?? true,
      },
      select: ADMIN_CATEGORY_SELECT,
    })

    await invalidateCategoryCaches()
    return NextResponse.json(toAdminCategory(category), { status: 201 })
  } catch (error) {
    logger.error('Error creating category', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
