import fs from 'fs'
import path from 'path'

/**
 * Скрипт для удаления старых JPEG файлов после успешной замены на PNG
 * Удаляет только те JPEG файлы, для которых есть соответствующие PNG файлы
 */

interface ImageFile {
  jpgPath: string
  pngPath: string
  fileName: string
}

async function cleanupOldImages() {
  try {
    console.log('🧹 Начинаем очистку старых JPEG файлов...')
    
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    
    // Получаем список всех файлов в папке images
    const files = fs.readdirSync(imagesDir)
    
    // Находим все PNG файлы с суффиксом -Photoroom
    const pngFiles = files.filter(file => file.endsWith('-Photoroom.png'))
    
    console.log(`🖼️ Найдено ${pngFiles.length} новых PNG файлов`)

    // Создаем список файлов для удаления
    const filesToDelete: ImageFile[] = []
    
    for (const pngFile of pngFiles) {
      // Извлекаем базовое имя файла (без -Photoroom.png)
      const baseName = pngFile.replace('-Photoroom.png', '')
      const jpgFile = `${baseName}.jpg`
      const jpgPath = path.join(imagesDir, jpgFile)
      const pngPath = path.join(imagesDir, pngFile)
      
      // Проверяем, существует ли соответствующий JPEG файл
      if (fs.existsSync(jpgPath)) {
        filesToDelete.push({
          jpgPath,
          pngPath,
          fileName: baseName
        })
      }
    }

    console.log(`📋 Найдено ${filesToDelete.length} JPEG файлов для удаления:`)
    filesToDelete.forEach(file => {
      console.log(`  ${file.fileName}.jpg → ${file.fileName}-Photoroom.png`)
    })

    if (filesToDelete.length === 0) {
      console.log('✅ Нет JPEG файлов для удаления')
      return
    }

    // Подтверждение удаления
    console.log('\n⚠️ ВНИМАНИЕ: Будут удалены следующие JPEG файлы:')
    filesToDelete.forEach(file => {
      console.log(`  - ${file.fileName}.jpg`)
    })

    // В реальном использовании здесь можно добавить интерактивное подтверждение
    // Для автоматического выполнения просто удаляем файлы
    console.log('\n🗑️ Удаляем старые JPEG файлы...')
    
    let deletedCount = 0
    let errorCount = 0

    for (const file of filesToDelete) {
      try {
        // Проверяем, что PNG файл действительно существует
        if (fs.existsSync(file.pngPath)) {
          fs.unlinkSync(file.jpgPath)
          console.log(`✅ Удален: ${file.fileName}.jpg`)
          deletedCount++
        } else {
          console.log(`⚠️ PNG файл не найден, пропускаем: ${file.fileName}.jpg`)
        }
      } catch (error) {
        console.error(`❌ Ошибка при удалении ${file.fileName}.jpg:`, error)
        errorCount++
      }
    }

    console.log('\n📊 Результаты очистки:')
    console.log(`  Удалено файлов: ${deletedCount}`)
    console.log(`  Ошибок: ${errorCount}`)
    console.log(`  Всего обработано: ${filesToDelete.length}`)

    // Показываем оставшиеся JPEG файлы
    const remainingJpgFiles = files.filter(file => file.endsWith('.jpg'))
    if (remainingJpgFiles.length > 0) {
      console.log('\n📁 Оставшиеся JPEG файлы:')
      remainingJpgFiles.forEach(file => {
        console.log(`  - ${file}`)
      })
    }

    console.log('\n🎉 Очистка старых изображений завершена!')

  } catch (error) {
    console.error('❌ Ошибка при очистке старых изображений:', error)
    throw error
  }
}

// Запускаем скрипт
if (require.main === module) {
  cleanupOldImages()
    .then(() => {
      console.log('✅ Скрипт очистки выполнен успешно')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Ошибка выполнения скрипта очистки:', error)
      process.exit(1)
    })
}

export { cleanupOldImages }
