import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { uploadImageWebp } from '../src/lib/storage'

const prisma = new PrismaClient()
const PASSWORD_SALT_ROUNDS = 12
const IMAGES_DIR = path.join(__dirname, '../public/images')
const PRODUCTS_JSON = path.join(__dirname, '../data/buy-am-products.json')
const IMAGE_MAP_JSON = path.join(__dirname, '../data/image-map.json')

type ProductSeed = {
  name: string
  description: string
  price: number
  image: string
  category: string
  ingredients: string[]
  isAvailable: boolean
}

async function uploadLocalImages(): Promise<Record<string, string>> {
  const map: Record<string, string> = {}
  if (!fs.existsSync(IMAGES_DIR)) return map

  const files = fs.readdirSync(IMAGES_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  console.info(`Uploading ${files.length} images to R2 as webp...`)

  for (const file of files) {
    const localPath = `/images/${file}`
    const buffer = fs.readFileSync(path.join(IMAGES_DIR, file))
    const baseName = file.replace(/\.[^.]+$/, '')
    const key = `images/${baseName}.webp`
    const url = await uploadImageWebp(buffer, key)
    map[localPath] = url
    console.info(`  ${localPath} → ${url}`)
  }

  fs.writeFileSync(IMAGE_MAP_JSON, JSON.stringify(map, null, 2))
  return map
}

async function main() {
  const shouldUploadImages = process.argv.includes('--upload-images')
  let imageMap: Record<string, string> = {}

  if (shouldUploadImages) {
    imageMap = await uploadLocalImages()
  } else if (fs.existsSync(IMAGE_MAP_JSON)) {
    imageMap = JSON.parse(fs.readFileSync(IMAGE_MAP_JSON, 'utf8'))
  }

  const productsData: ProductSeed[] = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'))
  const categories = ['Пиде', 'Комбо', 'Снэк', 'Соусы', 'Напитки']

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, description: `Категория ${name}`, isActive: true },
    })
  }

  const categoryRows = await prisma.category.findMany()
  const categoryByName = new Map(categoryRows.map((c) => [c.name, c.id]))

  for (const item of productsData) {
    const categoryId = categoryByName.get(item.category)
    if (!categoryId) {
      console.warn(`Skip (no category): ${item.name}`)
      continue
    }

    const image = imageMap[item.image] ?? item.image

    await prisma.product.upsert({
      where: { name: item.name },
      update: {
        description: item.description,
        price: Math.round(item.price),
        image,
        categoryId,
        ingredients: item.ingredients,
        isAvailable: item.isAvailable,
      },
      create: {
        name: item.name,
        description: item.description,
        price: Math.round(item.price),
        image,
        categoryId,
        ingredients: item.ingredients,
        isAvailable: item.isAvailable,
      },
    })
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@pideh-armenia.am'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123'
  const adminHash = await bcrypt.hash(adminPassword, PASSWORD_SALT_ROUNDS)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN', password: adminHash, deletedAt: null },
    create: {
      email: adminEmail,
      name: 'Администратор',
      phone: '+374 95 044 888',
      password: adminHash,
      role: 'ADMIN',
    },
  })

  const count = await prisma.product.count()
  console.info(`Seed complete: ${count} products, admin ${adminEmail}`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
