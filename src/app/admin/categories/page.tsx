'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, ArrowLeft, Package, Eye, EyeOff } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Input } from '@/components/ui/input'
import { ContentLocaleTabs } from '@/components/admin/ContentLocaleTabs'
import { LocalizedCategoryFields } from '@/components/admin/LocalizedCategoryFields'
import type { ContentLocale } from '@/lib/content-locale'
import {
  emptyCategoryTranslations,
  type CategoryTranslationsForm,
} from '@/lib/admin-content-locales'
import {
  categoryRowToTranslations,
  translationsToCategoryPayload,
} from '@/lib/admin-form-mappers'
import type { AdminCategory } from '@/types'

type AdminCategoryWithCount = AdminCategory & {
  _count: { products: number }
}

export default function CategoriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<AdminCategoryWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showInactive, setShowInactive] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AdminCategoryWithCount | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [activeLocale, setActiveLocale] = useState<ContentLocale>('hy')
  const [slug, setSlug] = useState('')
  const [translations, setTranslations] = useState<CategoryTranslationsForm>(
    emptyCategoryTranslations()
  )
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }
    fetchCategories()
  }, [session, status, router, showInactive])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/admin/categories?includeInactive=${showInactive}`)
      if (response.ok) {
        setCategories(await response.json())
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSlug('')
    setTranslations(emptyCategoryTranslations())
    setIsActive(true)
    setActiveLocale('hy')
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = translationsToCategoryPayload(slug, translations, isActive)
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        await fetchCategories()
        setIsCreating(false)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при создании категории')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Ошибка при создании категории')
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return

    try {
      const payload = translationsToCategoryPayload(slug, translations, isActive)
      const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        await fetchCategories()
        setEditingCategory(null)
        resetForm()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при обновлении категории')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Ошибка при обновлении категории')
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchCategories()
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при удалении категории')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Ошибка при удалении категории')
    }
  }

  const startEdit = (category: AdminCategoryWithCount) => {
    setEditingCategory(category)
    setIsCreating(false)
    setSlug(category.slug)
    setTranslations(categoryRowToTranslations(category))
    setIsActive(category.isActive)
    setActiveLocale('hy')
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setIsCreating(false)
    resetForm()
  }

  const updateTranslation = (
    locale: ContentLocale,
    fields: CategoryTranslationsForm[ContentLocale]
  ) => {
    setTranslations((prev) => ({ ...prev, [locale]: fields }))
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:hidden h-24" />
      <div className="hidden md:block h-24" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление категориями</h1>
            <p className="text-gray-600">Переводы на Armenia, English, Russian</p>
          </div>
          <Link
            href="/admin"
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к админке
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <button
              type="button"
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center px-4 py-2 rounded-xl transition-colors ${
                showInactive ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showInactive ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              {showInactive ? 'Показать все' : 'Скрыть неактивные'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(true)
                setEditingCategory(null)
                resetForm()
              }}
              className="flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Добавить категорию
            </button>
          </div>
        </div>

        {(isCreating || editingCategory) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {isCreating ? 'Создать категорию' : 'Редактировать категорию'}
            </h2>

            <form onSubmit={isCreating ? handleCreate : handleUpdate} className="space-y-6">
              <ContentLocaleTabs activeLocale={activeLocale} onChange={setActiveLocale} />
              <LocalizedCategoryFields
                fields={translations[activeLocale]}
                onChange={(fields) => updateTranslation(activeLocale, fields)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="pide"
                    required
                    readOnly={!!editingCategory}
                    className={editingCategory ? 'bg-gray-100' : undefined}
                  />
                  <p className="text-sm text-gray-500 mt-1">Латиница, цифры, дефис (ключ для фильтров)</p>
                </div>

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Активная категория
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
                >
                  {isCreating ? 'Создать' : 'Сохранить'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Категории ({categories.length})</h2>
          </div>

          {categories.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Категории не найдены</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900">{category.nameHy}</h3>
                        <span className="text-sm text-gray-500">/{category.slug}</span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {category.isActive ? 'Активна' : 'Неактивна'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        HY: {category.nameHy} · EN: {category.nameEn}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Товаров: {category._count.products}</span>
                        <span>Создана: {new Date(category.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(category)}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Удалить"
                        disabled={category._count.products > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
