import fs from 'fs'
import path from 'path'
import { PrismaClient, ProductStatus, type ContentLocale } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { invalidateCategoryCaches, invalidateProductCaches } from '../src/lib/redis'

const prisma = new PrismaClient()
const PASSWORD_SALT_ROUNDS = 12
const PRODUCTS_JSON = path.join(__dirname, '../data/buy-am-products.json')
const IMAGE_MAP_JSON = path.join(__dirname, '../data/image-map.json')
const BANNER_PRODUCT_NAME = 'Пиде с говядиной'

/** Featured statuses for homepage sections (exact product names from buy-am-products.json). */
const PRODUCT_STATUS_BY_NAME: Record<string, ProductStatus> = {
  '2 мяса пиде': 'HIT',
  'Комбо «Я один»': 'HIT',
  'Пепперони пиде': 'HIT',
  'Пиде с бастурмой': 'NEW',
  'Комбо «Мы вдвоем»': 'NEW',
  'Классическое сырное пиде': 'CLASSIC',
  'Овощное пиде': 'CLASSIC',
}

/** Default Armenian category labels (canonical slug = Russian name in DB). */
const CATEGORY_NAMES_HY: Record<string, string> = {
  Пиде: 'Փիդե',
  Комбо: 'Կոմբո',
  Снэк: 'Сնэք',
  Соусы: 'Սոուսներ',
  Напитки: 'Խմիչքներ',
}

const CATEGORY_NAMES_EN: Record<string, string> = {
  Пиде: 'Pide',
  Комбо: 'Combo',
  Снэк: 'Snacks',
  Соусы: 'Sauces',
  Напитки: 'Drinks',
}

type ProductSeed = {
  name: string
  description: string
  price: number
  image: string
  category: string
  ingredients: string[]
  isAvailable: boolean
}

function loadImageMap(): Record<string, string> {
  if (!fs.existsSync(IMAGE_MAP_JSON)) {
    throw new Error(`Missing ${IMAGE_MAP_JSON}. Product images live on R2 — run db:seed only after image-map exists.`)
  }
  return JSON.parse(fs.readFileSync(IMAGE_MAP_JSON, 'utf8')) as Record<string, string>
}

async function upsertProductTranslation(
  productId: string,
  locale: ContentLocale,
  data: { name: string; description: string; ingredients: string[] }
): Promise<void> {
  await prisma.productTranslation.upsert({
    where: { productId_locale: { productId, locale } },
    update: data,
    create: { productId, locale, ...data },
  })
}

async function upsertCategoryTranslation(
  categoryId: string,
  locale: ContentLocale,
  data: { name: string; description?: string | null }
): Promise<void> {
  await prisma.categoryTranslation.upsert({
    where: { categoryId_locale: { categoryId, locale } },
    update: data,
    create: { categoryId, locale, name: data.name, description: data.description ?? null },
  })
}

async function main() {
  const imageMap = loadImageMap()
  const productsData: ProductSeed[] = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'))
  const categories = ['Пиде', 'Комбо', 'Снэк', 'Соусы', 'Напитки']

  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, description: `Категория ${name}`, isActive: true },
    })

    await upsertCategoryTranslation(category.id, 'ru', {
      name,
      description: `Категория ${name}`,
    })

    const hyName = CATEGORY_NAMES_HY[name]
    if (hyName) {
      await upsertCategoryTranslation(category.id, 'hy', {
        name: hyName,
        description: null,
      })
    }

    const enName = CATEGORY_NAMES_EN[name]
    if (enName) {
      await upsertCategoryTranslation(category.id, 'en', {
        name: enName,
        description: null,
      })
    }
  }

  const categoryRows = await prisma.category.findMany()
  const categoryByName = new Map(categoryRows.map((c) => [c.name, c.id]))

  for (const item of productsData) {
    const categoryId = categoryByName.get(item.category)
    if (!categoryId) {
      console.warn(`Skip (no category): ${item.name}`)
      continue
    }

    const image = imageMap[item.image]
    if (!image) {
      console.warn(`Skip (no R2 mapping): ${item.name} → ${item.image}`)
      continue
    }

    const product = await prisma.product.upsert({
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

    await upsertProductTranslation(product.id, 'ru', {
      name: item.name,
      description: item.description,
      ingredients: item.ingredients,
    })
  }

  await prisma.product.updateMany({ data: { status: 'REGULAR' } })

  for (const [name, status] of Object.entries(PRODUCT_STATUS_BY_NAME)) {
    await prisma.product.updateMany({ where: { name }, data: { status } })
  }

  await prisma.product.updateMany({ where: { status: 'BANNER' }, data: { status: 'REGULAR' } })
  await prisma.product.updateMany({
    where: { name: BANNER_PRODUCT_NAME },
    data: { status: 'BANNER' },
  })

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
  await invalidateProductCaches()
  await invalidateCategoryCaches()
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
