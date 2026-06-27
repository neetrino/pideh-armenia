import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

/**
 * Скрипт для замены путей к изображениям с JPEG на PNG
 * Заменяет старые .jpg файлы на новые .png файлы с суффиксом -Photoroom
 */

interface ImageMapping {
  oldPath: string
  newPath: string
  fileName: string
}

async function updateImagePaths() {
  try {
    console.log('🔄 Начинаем обновление путей к изображениям...')
    
    // Получаем все продукты из базы данных
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        image: true
      }
    })

    console.log(`📦 Найдено ${products.length} продуктов в базе данных`)

    // Создаем маппинг старых путей на новые
    const imageMappings: ImageMapping[] = []
    
    // Получаем список всех PNG файлов в папке images
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    const files = fs.readdirSync(imagesDir)
    const pngFiles = files.filter(file => file.endsWith('-Photoroom.png'))
    
    console.log(`🖼️ Найдено ${pngFiles.length} новых PNG файлов`)

    // Создаем маппинг для каждого PNG файла
    for (const pngFile of pngFiles) {
      // Извлекаем базовое имя файла (без -Photoroom.png)
      const baseName = pngFile.replace('-Photoroom.png', '')
      const oldJpgPath = `/images/${baseName}.jpg`
      const newPngPath = `/images/${pngFile}`
      
      imageMappings.push({
        oldPath: oldJpgPath,
        newPath: newPngPath,
        fileName: baseName
      })
    }

    console.log('\n📋 Маппинг путей к изображениям:')
    imageMappings.forEach(mapping => {
      console.log(`  ${mapping.oldPath} → ${mapping.newPath}`)
    })

    // Обновляем продукты в базе данных
    let updatedCount = 0
    let skippedCount = 0

    for (const product of products) {
      // Находим соответствующий маппинг
      const mapping = imageMappings.find(m => m.oldPath === product.image)
      
      if (mapping) {
        // Проверяем, существует ли новый PNG файл
        const newImagePath = path.join(process.cwd(), 'public', mapping.newPath)
        
        if (fs.existsSync(newImagePath)) {
          // Обновляем путь к изображению в базе данных
          await prisma.product.update({
            where: { id: product.id },
            data: { image: mapping.newPath }
          })
          
          console.log(`✅ Обновлен: ${product.name} (${mapping.oldPath} → ${mapping.newPath})`)
          updatedCount++
        } else {
          console.log(`⚠️ PNG файл не найден: ${mapping.newPath}`)
          skippedCount++
        }
      } else {
        // Проверяем, есть ли у продукта изображение, которое нужно обновить
        if (product.image && product.image.includes('.jpg')) {
          console.log(`⚠️ Не найден маппинг для: ${product.name} (${product.image})`)
          skippedCount++
        }
      }
    }

    // Получаем статистику
    const totalProducts = await prisma.product.count()
    const productsWithImages = await prisma.product.count({
      where: {
        image: {
          not: ''
        }
      }
    })

    console.log('\n📊 Результаты обновления:')
    console.log(`  Всего продуктов: ${totalProducts}`)
    console.log(`  Обновлено: ${updatedCount}`)
    console.log(`  Пропущено: ${skippedCount}`)
    console.log(`  Продуктов с изображениями: ${productsWithImages}`)

    // Показываем примеры обновленных продуктов
    console.log('\n🔍 Примеры обновленных продуктов:')
    const sampleProducts = await prisma.product.findMany({
      where: {
        image: {
          contains: '-Photoroom.png'
        }
      },
      take: 5,
      select: {
        name: true,
        image: true
      }
    })

    sampleProducts.forEach(product => {
      console.log(`  ${product.name}: ${product.image}`)
    })

    console.log('\n🎉 Обновление путей к изображениям завершено!')

  } catch (error) {
    console.error('❌ Ошибка при обновлении путей к изображениям:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем скрипт
if (require.main === module) {
  updateImagePaths()
    .then(() => {
      console.log('✅ Скрипт выполнен успешно')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Ошибка выполнения скрипта:', error)
      process.exit(1)
    })
}

export { updateImagePaths }
