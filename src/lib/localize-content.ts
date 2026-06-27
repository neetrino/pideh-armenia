import type { Prisma } from '@prisma/client'
import {
  type ContentLocale,
  CONTENT_LOCALES,
  localeFallbackOrder,
  localizedFieldKey,
} from '@/lib/content-locale'

export const PRODUCT_SELECT = {
  id: true,
  slug: true,
  nameHy: true,
  nameEn: true,
  nameRu: true,
  descriptionHy: true,
  descriptionEn: true,
  descriptionRu: true,
  ingredientsHy: true,
  ingredientsEn: true,
  ingredientsRu: true,
  price: true,
  categoryId: true,
  image: true,
  isAvailable: true,
  status: true,
  createdAt: true,
  category: {
    select: {
      id: true,
      slug: true,
      nameHy: true,
      nameEn: true,
      nameRu: true,
      descriptionHy: true,
      descriptionEn: true,
      descriptionRu: true,
      isActive: true,
    },
  },
} satisfies Prisma.ProductSelect

export type ProductRow = Prisma.ProductGetPayload<{ select: typeof PRODUCT_SELECT }>

export type CategoryRow = NonNullable<ProductRow['category']>

export type LocalizedCategory = {
  id: string
  slug: string
  name: string
  description: string | null
  isActive: boolean
}

export type LocalizedProduct = {
  id: string
  slug: string
  name: string
  description: string
  ingredients: string[]
  price: number
  categoryId: string
  image: string
  isAvailable: boolean
  status: ProductRow['status']
  createdAt: Date
  category: LocalizedCategory | null
}

type LocalizedRow = {
  nameHy: string
  nameEn: string
  nameRu: string
  descriptionHy?: string | null
  descriptionEn?: string | null
  descriptionRu?: string | null
  ingredientsHy?: string[]
  ingredientsEn?: string[]
  ingredientsRu?: string[]
}

function pickString(
  row: LocalizedRow,
  base: 'name' | 'description',
  locale: ContentLocale
): string {
  for (const loc of localeFallbackOrder(locale)) {
    const key = localizedFieldKey(base, loc)
    const value = row[key]
    if (value) return value
  }
  return row.nameHy
}

function pickIngredients(row: LocalizedRow, locale: ContentLocale): string[] {
  for (const loc of localeFallbackOrder(locale)) {
    const key = localizedFieldKey('ingredients', loc)
    const value = row[key]
    if (value && value.length > 0) return value
  }
  return row.ingredientsHy ?? []
}

/** Map DB category to API shape with localized fields. */
export function localizeCategory(category: CategoryRow, locale: ContentLocale): LocalizedCategory {
  return {
    id: category.id,
    slug: category.slug,
    isActive: category.isActive,
    name: pickString(category, 'name', locale),
    description: pickString(category, 'description', locale) || null,
  }
}

/** Apply locale fallback to product fields for public API. */
export function localizeProduct(product: ProductRow, locale: ContentLocale): LocalizedProduct {
  const { category, ...base } = product
  return {
    id: base.id,
    slug: base.slug,
    price: base.price,
    categoryId: base.categoryId,
    image: base.image,
    isAvailable: base.isAvailable,
    status: base.status,
    createdAt: base.createdAt,
    name: pickString(base, 'name', locale),
    description: pickString(base, 'description', locale),
    ingredients: pickIngredients(base, locale),
    category: category ? localizeCategory(category, locale) : null,
  }
}

export function localizeProducts(products: ProductRow[], locale: ContentLocale): LocalizedProduct[] {
  return products.map((p) => localizeProduct(p, locale))
}

/** Cache key suffix per locale for Redis-backed product/category lists. */
export function cacheKeyForLocale(baseKey: string, locale: ContentLocale): string {
  return `${baseKey}:${locale}`
}

/** All locale-specific cache keys for invalidation. */
export function allLocaleCacheKeys(baseKey: string): string[] {
  return CONTENT_LOCALES.map((locale) => cacheKeyForLocale(baseKey, locale))
}

/** Prisma OR filter for product search across all locales. */
export function productSearchFilter(search: string): Prisma.ProductWhereInput {
  const contains = { contains: search, mode: 'insensitive' as const }
  return {
    OR: [
      { nameHy: contains },
      { nameEn: contains },
      { nameRu: contains },
      { descriptionHy: contains },
      { descriptionEn: contains },
      { descriptionRu: contains },
    ],
  }
}