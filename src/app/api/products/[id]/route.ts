import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { invalidateProductCaches } from '@/lib/redis'
import { localeFromSearchParams } from '@/lib/content-locale'
import { localizeProduct, PRODUCT_WITH_TRANSLATIONS_SELECT } from '@/lib/localize-content'

// GET /api/products/[id] — ?locale=hy|en|ru
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const locale = localeFromSearchParams(new URL(request.url).searchParams)

    const product = await prisma.product.findUnique({
      where: {
        id,
        isAvailable: true,
      },
      select: PRODUCT_WITH_TRANSLATIONS_SELECT,
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const response = NextResponse.json(localizeProduct(product, locale))
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200')
    response.headers.set('Vary', 'Accept-Language')
    return response
  } catch (error) {
    logger.error('Error fetching product', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// DELETE /api/products/[id] - удалить товар (только для админов)
export async function DELETE(
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

    // Удаляем товар
    await prisma.product.delete({ where: { id } })
    await invalidateProductCaches()

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    logger.error('Error deleting product', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
