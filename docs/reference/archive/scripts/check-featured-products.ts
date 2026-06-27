import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkFeaturedProducts() {
  try {
    console.log('Проверяем товары-хиты...\n')
    
    // Получаем все товары
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        category: true,
        isAvailable: true
      }
    })
    
    console.log('Все товары в базе:')
    allProducts.forEach(p => {
      console.log(`- ${p.name} (статус: ${p.status}, категория: ${p.category}, доступен: ${p.isAvailable})`)
    })
    
    console.log('\n' + '='.repeat(50))
    
    // Получаем товары-хиты
    const featuredProducts = await prisma.product.findMany({
      where: {
        status: {
          in: ['HIT', 'NEW', 'CLASSIC']
        },
        isAvailable: true
      },
      select: {
        id: true,
        name: true,
        status: true,
        category: true
      }
    })
    
    console.log('\nТовары-хиты (HIT, NEW, CLASSIC):')
    if (featuredProducts.length === 0) {
      console.log('❌ Нет товаров со статусами HIT, NEW, CLASSIC!')
    } else {
      featuredProducts.forEach(p => {
        console.log(`✅ ${p.name} (статус: ${p.status}, категория: ${p.category})`)
      })
    }
    
    // Проверяем статусы
    const statusCounts = await prisma.product.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })
    
    console.log('\nСтатистика по статусам:')
    statusCounts.forEach(s => {
      console.log(`- ${s.status}: ${s._count.status} товаров`)
    })
    
  } catch (error) {
    console.error('Ошибка:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkFeaturedProducts()
