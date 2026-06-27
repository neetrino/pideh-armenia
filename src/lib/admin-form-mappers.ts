import type { ProductTranslationsForm, CategoryTranslationsForm } from '@/lib/admin-content-locales'
import { productSlugFromImage } from '@/lib/product-slug'

type AdminProductRow = {
  slug: string
  nameHy: string
  nameEn: string
  nameRu: string
  descriptionHy: string
  descriptionEn: string
  descriptionRu: string
  ingredientsHy: string[]
  ingredientsEn: string[]
  ingredientsRu: string[]
  price: number
  categoryId: string
  image: string
  isAvailable: boolean
  status: string
}

type AdminCategoryRow = {
  slug: string
  nameHy: string
  nameEn: string
  nameRu: string
  descriptionHy: string | null
  descriptionEn: string | null
  descriptionRu: string | null
  isActive: boolean
}

function parseIngredients(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function joinIngredients(items: string[]): string {
  return items.join(', ')
}

/** Map DB product row to tabbed admin form state. */
export function productRowToTranslations(row: AdminProductRow): ProductTranslationsForm {
  return {
    hy: {
      name: row.nameHy,
      description: row.descriptionHy,
      ingredients: joinIngredients(row.ingredientsHy),
    },
    en: {
      name: row.nameEn,
      description: row.descriptionEn,
      ingredients: joinIngredients(row.ingredientsEn),
    },
    ru: {
      name: row.nameRu,
      description: row.descriptionRu,
      ingredients: joinIngredients(row.ingredientsRu),
    },
  }
}

/** Map tabbed form to API payload (matches productInputSchema). */
export function translationsToProductPayload(
  slug: string,
  translations: ProductTranslationsForm,
  fields: {
    price: number
    categoryId: string
    image?: string
    isAvailable?: boolean
    status?: string
  }
) {
  return {
    slug,
    nameHy: translations.hy.name.trim(),
    nameEn: translations.en.name.trim(),
    nameRu: translations.ru.name.trim(),
    descriptionHy: translations.hy.description.trim(),
    descriptionEn: translations.en.description.trim(),
    descriptionRu: translations.ru.description.trim(),
    ingredientsHy: parseIngredients(translations.hy.ingredients),
    ingredientsEn: parseIngredients(translations.en.ingredients),
    ingredientsRu: parseIngredients(translations.ru.ingredients),
    price: fields.price,
    categoryId: fields.categoryId,
    image: fields.image,
    isAvailable: fields.isAvailable,
    status: fields.status,
  }
}

/** Suggest slug when admin picks an image (new product). */
export function slugFromProductImage(imagePath: string): string {
  return productSlugFromImage(imagePath)
}

export function categoryRowToTranslations(row: AdminCategoryRow): CategoryTranslationsForm {
  return {
    hy: { name: row.nameHy, description: row.descriptionHy ?? '' },
    en: { name: row.nameEn, description: row.descriptionEn ?? '' },
    ru: { name: row.nameRu, description: row.descriptionRu ?? '' },
  }
}

export function translationsToCategoryPayload(
  slug: string,
  translations: CategoryTranslationsForm,
  isActive: boolean
) {
  return {
    slug,
    nameHy: translations.hy.name.trim(),
    nameEn: translations.en.name.trim(),
    nameRu: translations.ru.name.trim(),
    descriptionHy: translations.hy.description.trim() || undefined,
    descriptionEn: translations.en.description.trim() || undefined,
    descriptionRu: translations.ru.description.trim() || undefined,
    isActive,
  }
}
