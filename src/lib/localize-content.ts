import type { ContentLocale, Prisma } from '@prisma/client'
import { CONTENT_LOCALES } from '@/lib/content-locale'

type ProductTranslationRow = {
  locale: ContentLocale
  name: string
  description: string
  ingredients: string[]
}

type CategoryTranslationRow = {
  locale: ContentLocale
  name: string
  description: string | null
}

export const PRODUCT_WITH_TRANSLATIONS_SELECT = {
  id: true,
  name: true,
  description: true,
  price: true,
  categoryId: true,
  image: true,
  ingredients: true,
  isAvailable: true,
  status: true,
  createdAt: true,
  category: {
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      translations: {
        select: { locale: true, name: true, description: true },
      },
    },
  },
  translations: {
    select: { locale: true, name: true, description: true, ingredients: true },
  },
} satisfies Prisma.ProductSelect

export type ProductWithTranslations = Prisma.ProductGetPayload<{
  select: typeof PRODUCT_WITH_TRANSLATIONS_SELECT
}>

export type LocalizedCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
}

export type LocalizedProduct = Omit<ProductWithTranslations, 'translations' | 'category'> & {
  category: LocalizedCategory | null
}

function fallbackOrder(locale: ContentLocale): ContentLocale[] {
  const ordered: ContentLocale[] = [locale, 'hy', 'en', 'ru']
  return [...new Set(ordered)]
}

function pickProductTranslation(
  translations: ProductTranslationRow[] | undefined,
  locale: ContentLocale
): ProductTranslationRow | null {
  for (const loc of fallbackOrder(locale)) {
    const row = translations?.find((t) => t.locale === loc)
    if (row) return row
  }
  return null
}

function pickCategoryTranslation(
  translations: CategoryTranslationRow[] | undefined,
  locale: ContentLocale
): CategoryTranslationRow | null {
  for (const loc of fallbackOrder(locale)) {
    const row = translations?.find((t) => t.locale === loc)
    if (row) return row
  }
  return null
}

/** Map DB category to API shape with localized `name` and stable Russian `slug`. */
export function localizeCategory(
  category: {
    id: string
    name: string
    description: string | null
    isActive: boolean
    translations?: CategoryTranslationRow[]
  },
  locale: ContentLocale
): LocalizedCategory {
  const slug = category.name
  const translation = pickCategoryTranslation(category.translations, locale)
  return {
    id: category.id,
    slug,
    isActive: category.isActive,
    name: translation?.name ?? category.name,
    description: translation?.description ?? category.description,
  }
}

/** Apply locale fallback chain to product fields; strips raw translations. */
export function localizeProduct(
  product: ProductWithTranslations,
  locale: ContentLocale
): LocalizedProduct {
  const { translations, category, ...base } = product
  const translation = pickProductTranslation(translations, locale)

  return {
    ...base,
    name: translation?.name ?? base.name,
    description: translation?.description ?? base.description,
    ingredients: translation?.ingredients ?? base.ingredients,
    category: category ? localizeCategory(category, locale) : null,
  }
}

export function localizeProducts(
  products: ProductWithTranslations[],
  locale: ContentLocale
): LocalizedProduct[] {
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
