import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateProductStatuses() {
  try {
    console.log('🔄 Обновление статусов товаров...')

    // Получаем все товары
    const products = await prisma.product.findMany()
    console.log(`📦 Найдено ${products.length} товаров`)

    // Обновляем статусы для некоторых товаров
    const updates = [
      // Хиты продаж
      { name: 'Мясная пиде', status: 'HIT' },
      { name: 'Пиде с говядиной', status: 'HIT' },
      { name: 'Комбо "Я один"', status: 'HIT' },
      
      // Новинки
      { name: 'Пепперони пиде', status: 'NEW' },
      { name: 'Пиде с бастурмой', status: 'NEW' },
      { name: 'Комбо "Мы вдвоем"', status: 'NEW' },
      
      // Классика
      { name: 'Классическая сырная пиде', status: 'CLASSIC' },
      { name: 'Сырная пиде', status: 'CLASSIC' },
      { name: 'Овощное пиде', status: 'CLASSIC' },
    ]

    let updatedCount = 0

    for (const update of updates) {
      const product = products.find(p => p.name.includes(update.name) || update.name.includes(p.name))
      
      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: { status: update.status }
        })
        console.log(`✅ Обновлен товар: ${product.name} -> ${update.status}`)
        updatedCount++
      } else {
        console.log(`⚠️ Товар не найден: ${update.name}`)
      }
    }

    console.log(`🎉 Обновлено ${updatedCount} товаров`)
    
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
    console.error('❌ Ошибка при обновлении статусов:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductStatuses()
