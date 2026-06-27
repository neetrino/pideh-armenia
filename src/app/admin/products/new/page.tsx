'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import { ProductForm, emptyProductFormValues } from '@/components/admin/ProductForm'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import type { AdminCategory } from '@/types'

export default function NewProductPage() {
  const t = useTranslations('admin')
  const { isAdmin, isLoading: authLoading } = useAdminAuth()
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAdmin) return
    fetch('/api/admin/categories')
      .then((res) => (res.ok ? res.json() : []))
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [isAdmin])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) return null

  const handleSubmit = async (payload: Record<string, unknown>) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create product')
      }
      window.location.href = '/admin/products'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product')
    } finally {
      setLoading(false)
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
              {t('back')}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('addProductTitle')}</h1>
            <p className="text-gray-600 mt-2">{t('translationsHint')}</p>
          </div>
        </div>

        <ProductForm
          mode="create"
          categories={categories}
          initialValues={emptyProductFormValues()}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
