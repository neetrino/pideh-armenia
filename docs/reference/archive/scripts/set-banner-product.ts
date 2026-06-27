import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setBannerProduct() {
  try {
    console.log('🔄 Настройка товара-баннера...')

    // Сначала убираем статус BANNER у всех товаров
    await prisma.product.updateMany({
      where: { status: 'BANNER' },
      data: { status: 'REGULAR' }
    })
    console.log('✅ Убран статус BANNER у всех товаров')

    // Находим товар "Пиде с говядиной" и назначаем ему статус BANNER
    const bannerProduct = await prisma.product.findFirst({
      where: {
        name: {
          contains: 'говядин',
          mode: 'insensitive'
        }
      }
    })

    if (bannerProduct) {
      await prisma.product.update({
        where: { id: bannerProduct.id },
        data: { status: 'BANNER' }
      })
      console.log(`✅ Товар "${bannerProduct.name}" назначен как баннер`)
    } else {
      console.log('⚠️ Товар с говядиной не найден, ищем альтернативу...')
      
      // Если не нашли товар с говядиной, берем первый доступный товар
      const anyProduct = await prisma.product.findFirst({
        where: { isAvailable: true }
      })
      
      if (anyProduct) {
        await prisma.product.update({
          where: { id: anyProduct.id },
          data: { status: 'BANNER' }
        })
        console.log(`✅ Товар "${anyProduct.name}" назначен как баннер`)
      } else {
        console.log('❌ Нет доступных товаров для назначения баннера')
      }
    }

    // Показываем итоговую статистику
    const stats = await prisma.product.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    console.log('\n📊 Статистика по статусам:')
    stats.forEach(stat => {
      console.log(`  ${stat.status}: ${stat._count.status} товаров`)
    })

  } catch (error) {
    console.error('❌ Ошибка при настройке баннера:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setBannerProduct()
