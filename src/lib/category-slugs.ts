/** Stable category slugs (language-independent keys). */
export const CATEGORY_SLUGS = {
  pide: 'pide',
  combo: 'combo',
  snack: 'snack',
  sauces: 'sauces',
  drinks: 'drinks',
} as const

export type CategorySlug = (typeof CATEGORY_SLUGS)[keyof typeof CATEGORY_SLUGS]

/** Russian seed category name → slug (legacy import source). */
export const CATEGORY_SLUG_BY_RU_NAME: Record<string, CategorySlug> = {
  Пиде: CATEGORY_SLUGS.pide,
  Комбо: CATEGORY_SLUGS.combo,
  Снэк: CATEGORY_SLUGS.snack,
  Соусы: CATEGORY_SLUGS.sauces,
  Напитки: CATEGORY_SLUGS.drinks,
}

/** Display order for category filters (slug-based). */
export const CATEGORY_SLUG_ORDER: CategorySlug[] = [
  CATEGORY_SLUGS.combo,
  CATEGORY_SLUGS.pide,
  CATEGORY_SLUGS.snack,
  CATEGORY_SLUGS.sauces,
  CATEGORY_SLUGS.drinks,
]
