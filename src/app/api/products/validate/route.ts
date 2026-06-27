import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { validateProductsSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const parsed = validateProductsSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid product IDs' }, { status: 400 })
    }

    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: parsed.data.productIds },
        isAvailable: true,
      },
      select: { id: true },
    })

    const validIds = existingProducts.map((product) => product.id)
    return NextResponse.json({ validIds })
  } catch (error) {
    logger.error('Product validation error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
