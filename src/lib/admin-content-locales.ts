import type { ContentLocale } from '@/lib/content-locale'

export type AdminLocaleTab = {
  locale: ContentLocale
  label: string
}

/** Tab labels for admin translation UI (matches storefront LanguageSwitcher). */
export const ADMIN_LOCALE_TABS: readonly AdminLocaleTab[] = [
  { locale: 'hy', label: 'Armenia' },
  { locale: 'en', label: 'English' },
  { locale: 'ru', label: 'Russian' },
] as const

export type LocaleFieldSet = {
  name: string
  description: string
  ingredients: string
}

export type CategoryLocaleFieldSet = {
  name: string
  description: string
}

export type ProductTranslationsForm = Record<ContentLocale, LocaleFieldSet>

export type CategoryTranslationsForm = Record<ContentLocale, CategoryLocaleFieldSet>

export function emptyProductTranslations(): ProductTranslationsForm {
  return {
    hy: { name: '', description: '', ingredients: '' },
    en: { name: '', description: '', ingredients: '' },
    ru: { name: '', description: '', ingredients: '' },
  }
}

export function emptyCategoryTranslations(): CategoryTranslationsForm {
  return {
    hy: { name: '', description: '' },
    en: { name: '', description: '' },
    ru: { name: '', description: '' },
  }
}
