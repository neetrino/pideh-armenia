import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface ProductData {
  name: string
  description: string
  price: number
  image: string
  category: string
  ingredients: string[]
  isAvailable: boolean
  source?: string
}

async function seedProducts() {
  try {
    console.log('🌱 Начинаем заполнение базы данных товарами...')

    // Читаем данные из JSON файла
    const dataPath = path.join(process.cwd(), 'data', 'buy-am-products.json')
    const rawData = fs.readFileSync(dataPath, 'utf-8')
    const products: ProductData[] = JSON.parse(rawData)

    console.log(`📦 Найдено ${products.length} товаров для добавления`)

    // Очищаем существующие товары
    console.log('🗑️ Очищаем существующие товары...')
    await prisma.orderItem.deleteMany()
    await prisma.product.deleteMany()

    // Добавляем товары в базу данных
    console.log('➕ Добавляем товары в базу данных...')
    
    for (const productData of products) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          category: productData.category,
          ingredients: productData.ingredients,
          isAvailable: productData.isAvailable,
        }
      })
      
      console.log(`✅ Добавлен товар: ${product.name} (${product.price} ֏)`)
    }

    // Получаем статистику
    const totalProducts = await prisma.product.count()
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    })

    console.log('\n📊 Статистика:')
    console.log(`Всего товаров: ${totalProducts}`)
    console.log('\nПо категориям:')
    categories.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.category} товаров`)
    })

    console.log('\n🎉 База данных успешно заполнена товарами!')

  } catch (error) {
    console.error('❌ Ошибка при заполнении базы данных:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем скрипт
if (require.main === module) {
  seedProducts()
    .then(() => {
      console.log('✅ Скрипт завершен успешно')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Ошибка выполнения скрипта:', error)
      process.exit(1)
    })
}

export default seedProducts
