import fs from 'fs'
import path from 'path'
import { PrismaClient, ProductStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { CATEGORY_SLUG_BY_RU_NAME } from '../src/lib/category-slugs'
import { productSlugFromImage } from '../src/lib/product-slug'
import { invalidateCategoryCaches, invalidateProductCaches } from '../src/lib/redis'

const prisma = new PrismaClient()
const PASSWORD_SALT_ROUNDS = 12
const PRODUCTS_JSON = path.join(__dirname, '../data/buy-am-products.json')
const PRODUCT_TRANSLATIONS_JSON = path.join(__dirname, '../data/product-translations.json')
const IMAGE_MAP_JSON = path.join(__dirname, '../data/image-map.json')
const BANNER_PRODUCT_SLUG = 'pide-s-govyadinoj'

/** Featured statuses keyed by product slug (from image filename). */
const PRODUCT_STATUS_BY_SLUG: Record<string, ProductStatus> = {
  '2-myasa-pide': 'HIT',
  'kombo-ya-odin': 'HIT',
  'pepperoni-pide': 'HIT',
  'pide-s-basturmoj': 'NEW',
  'kombo-my-vdvoyom': 'NEW',
  'classic-chees': 'CLASSIC',
  'ovoshchnoe-pide': 'CLASSIC',
}

const CATEGORY_NAMES_HY: Record<string, string> = {
  Пиде: 'Փիդե',
  Комбо: 'Կոմբո',
  Снэк: 'Սնэք',
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

type ProductTranslationSeed = {
  name: string
  description: string
  ingredients: string[]
}

type ProductTranslationsMap = Record<
  string,
  { hy: ProductTranslationSeed; en: ProductTranslationSeed }
>

function loadImageMap(): Record<string, string> {
  if (!fs.existsSync(IMAGE_MAP_JSON)) {
    throw new Error(`Missing ${IMAGE_MAP_JSON}. Product images live on R2 — run db:seed only after image-map exists.`)
  }
  return JSON.parse(fs.readFileSync(IMAGE_MAP_JSON, 'utf8')) as Record<string, string>
}

async function main() {
  const imageMap = loadImageMap()
  const productsData: ProductSeed[] = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'))
  const productTranslations: ProductTranslationsMap = JSON.parse(
    fs.readFileSync(PRODUCT_TRANSLATIONS_JSON, 'utf8')
  )
  const categories = ['Пиде', 'Комбо', 'Снэк', 'Соусы', 'Напитки']

  for (const ruName of categories) {
    const slug = CATEGORY_SLUG_BY_RU_NAME[ruName]
    if (!slug) {
      console.warn(`Skip category (no slug): ${ruName}`)
      continue
    }

    await prisma.category.upsert({
      where: { slug },
      update: {
        isActive: true,
        nameHy: CATEGORY_NAMES_HY[ruName] ?? ruName,
        nameEn: CATEGORY_NAMES_EN[ruName] ?? ruName,
        nameRu: ruName,
        descriptionRu: `Категория ${ruName}`,
      },
      create: {
        slug,
        nameHy: CATEGORY_NAMES_HY[ruName] ?? ruName,
        nameEn: CATEGORY_NAMES_EN[ruName] ?? ruName,
        nameRu: ruName,
        descriptionRu: `Категория ${ruName}`,
        isActive: true,
      },
    })
  }

  const categoryRows = await prisma.category.findMany()
  const categoryIdBySlug = new Map(categoryRows.map((c) => [c.slug, c.id]))

  for (const item of productsData) {
    const categorySlug = CATEGORY_SLUG_BY_RU_NAME[item.category]
    const categoryId = categorySlug ? categoryIdBySlug.get(categorySlug) : undefined
    if (!categoryId) {
      console.warn(`Skip (no category): ${item.name}`)
      continue
    }

    const image = imageMap[item.image]
    if (!image) {
      console.warn(`Skip (no R2 mapping): ${item.name} → ${item.image}`)
      continue
    }

    const slug = productSlugFromImage(item.image)
    const localized = productTranslations[item.name]
    if (!localized) {
      console.warn(`Skip (no hy/en map): ${item.name}`)
      continue
    }

    await prisma.product.upsert({
      where: { slug },
      update: {
        nameHy: localized.hy.name,
        nameEn: localized.en.name,
        nameRu: item.name,
        descriptionHy: localized.hy.description,
        descriptionEn: localized.en.description,
        descriptionRu: item.description,
        ingredientsHy: localized.hy.ingredients,
        ingredientsEn: localized.en.ingredients,
        ingredientsRu: item.ingredients,
        price: Math.round(item.price),
        image,
        categoryId,
        isAvailable: item.isAvailable,
      },
      create: {
        slug,
        nameHy: localized.hy.name,
        nameEn: localized.en.name,
        nameRu: item.name,
        descriptionHy: localized.hy.description,
        descriptionEn: localized.en.description,
        descriptionRu: item.description,
        ingredientsHy: localized.hy.ingredients,
        ingredientsEn: localized.en.ingredients,
        ingredientsRu: item.ingredients,
        price: Math.round(item.price),
        image,
        categoryId,
        isAvailable: item.isAvailable,
      },
    })
  }

  await prisma.product.updateMany({ data: { status: 'REGULAR' } })

  for (const [slug, status] of Object.entries(PRODUCT_STATUS_BY_SLUG)) {
    await prisma.product.updateMany({ where: { slug }, data: { status } })
  }

  await prisma.product.updateMany({ where: { status: 'BANNER' }, data: { status: 'REGULAR' } })
  await prisma.product.updateMany({
    where: { slug: BANNER_PRODUCT_SLUG },
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
      name: 'Administrator',
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
