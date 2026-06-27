'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import {
  ProductForm,
  type ProductFormValues,
} from '@/components/admin/ProductForm'
import { productRowToTranslations } from '@/lib/admin-form-mappers'
import type { Category } from '@/types'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

type AdminProductResponse = {
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

export default function EditProductPage({ params }: EditProductPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [productId, setProductId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [initialValues, setInitialValues] = useState<ProductFormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    params.then((p) => setProductId(p.id))
  }, [params])

  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') return
    fetch('/api/admin/categories')
      .then((res) => (res.ok ? res.json() : []))
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [session])

  useEffect(() => {
    if (!productId) return

    const load = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/products/${productId}`)
        if (!response.ok) {
          setNotFound(true)
          return
        }
        const row = (await response.json()) as AdminProductResponse
        setInitialValues({
          slug: row.slug,
          translations: productRowToTranslations(row),
          price: String(row.price),
          categoryId: row.categoryId,
          image: row.image,
          isAvailable: row.isAvailable,
          status: row.status === 'REGULAR' ? '' : row.status,
        })
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [productId])

  if (status === 'loading' || !productId || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    router.push('/login')
    return null
  }

  if (notFound || !initialValues) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Товар не найден</h2>
          <Link href="/admin/products">
            <Button>Вернуться к товарам</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (payload: Record<string, unknown>) => {
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }
      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete product')
      }
      router.push('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:hidden h-24" />
      <div className="hidden md:block h-24" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Редактировать товар</h1>
            <p className="text-gray-600 mt-2">Slug: {initialValues.slug}</p>
          </div>
        </div>

        <ProductForm
          mode="edit"
          categories={categories}
          initialValues={initialValues}
          loading={saving}
          error={error}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
