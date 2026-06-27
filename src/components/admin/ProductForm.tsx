'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Save, X, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ImageSelector from '@/components/ImageSelector'
import { ContentLocaleTabs } from '@/components/admin/ContentLocaleTabs'
import { LocalizedProductFields } from '@/components/admin/LocalizedProductFields'
import type { ContentLocale } from '@/lib/content-locale'
import {
  emptyProductTranslations,
  type ProductTranslationsForm,
} from '@/lib/admin-content-locales'
import {
  slugFromProductImage,
  translationsToProductPayload,
} from '@/lib/admin-form-mappers'
import type { AdminCategory } from '@/types'

const PRODUCT_STATUS_KEYS = ['HIT', 'NEW', 'CLASSIC', 'BANNER'] as const

const STATUS_LABEL_KEY: Record<(typeof PRODUCT_STATUS_KEYS)[number], 'statusHit' | 'statusNew' | 'statusClassic' | 'statusBanner'> = {
  HIT: 'statusHit',
  NEW: 'statusNew',
  CLASSIC: 'statusClassic',
  BANNER: 'statusBanner',
}

export type ProductFormValues = {
  slug: string
  translations: ProductTranslationsForm
  price: string
  categoryId: string
  image: string
  isAvailable: boolean
  status: string
}

type ProductFormProps = {
  mode: 'create' | 'edit'
  categories: AdminCategory[]
  initialValues: ProductFormValues
  loading?: boolean
  error?: string
  onSubmit: (payload: ReturnType<typeof translationsToProductPayload>) => Promise<void>
  onDelete?: () => Promise<void>
  cancelHref?: string
}

export function ProductForm({
  mode,
  categories,
  initialValues,
  loading = false,
  error = '',
  onSubmit,
  onDelete,
  cancelHref = '/admin/products',
}: ProductFormProps) {
  const t = useTranslations('admin')
  const [activeLocale, setActiveLocale] = useState<ContentLocale>('hy')
  const [slug, setSlug] = useState(initialValues.slug)
  const [translations, setTranslations] = useState<ProductTranslationsForm>(
    initialValues.translations ?? emptyProductTranslations()
  )
  const [price, setPrice] = useState(initialValues.price)
  const [categoryId, setCategoryId] = useState(initialValues.categoryId)
  const [image, setImage] = useState(initialValues.image)
  const [isAvailable, setIsAvailable] = useState(initialValues.isAvailable)
  const [status, setStatus] = useState(initialValues.status)

  const updateTranslation = (locale: ContentLocale, fields: ProductTranslationsForm[ContentLocale]) => {
    setTranslations((prev) => ({ ...prev, [locale]: fields }))
  }

  const handleImageChange = (imagePath: string) => {
    setImage(imagePath)
    if (mode === 'create' && imagePath) {
      setSlug(slugFromProductImage(imagePath))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = translationsToProductPayload(slug, translations, {
      price: parseInt(price, 10),
      categoryId,
      image,
      isAvailable,
      status,
    })
    await onSubmit(payload)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('productInfoTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <ContentLocaleTabs activeLocale={activeLocale} onChange={setActiveLocale} />
          <LocalizedProductFields
            fields={translations[activeLocale]}
            onChange={(fields) => updateTranslation(activeLocale, fields)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('fieldSlug')} *</label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="product-slug"
                required
                readOnly={mode === 'edit'}
                className={mode === 'edit' ? 'bg-gray-100' : undefined}
              />
              {mode === 'create' && (
                <p className="text-sm text-gray-500 mt-1">{t('slugHintCreate')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('fieldPrice')} *</label>
              <Input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="950"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('fieldCategory')} *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                required
              >
                <option value="">{t('selectCategory')}</option>
                {categories.filter((cat) => cat.isActive).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameHy}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('fieldStatus')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
              >
                <option value="">{t('statusRegular')}</option>
                {PRODUCT_STATUS_KEYS.map((value) => (
                  <option key={value} value={value}>
                    {t(STATUS_LABEL_KEY[value])}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('fieldImage')}</label>
              <ImageSelector value={image} onChange={handleImageChange} />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">{t('availableForOrder')}</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-300">
            {mode === 'edit' && onDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t('deleteProduct')}
              </Button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-4">
              <Link href={cancelHref}>
                <Button type="button" variant="outline">
                  {t('cancel')}
                </Button>
              </Link>
              <Button type="submit" disabled={loading} className="flex items-center gap-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loading
                  ? mode === 'create'
                    ? t('creating')
                    : t('saving')
                  : mode === 'create'
                    ? t('createProduct')
                    : t('saveProduct')}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function emptyProductFormValues(): ProductFormValues {
  return {
    slug: '',
    translations: emptyProductTranslations(),
    price: '',
    categoryId: '',
    image: '',
    isAvailable: true,
    status: '',
  }
}
