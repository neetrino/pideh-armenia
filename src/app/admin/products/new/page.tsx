'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import { AdminCategory } from '@/types'
import {
  emptyProductFormValues,
  ProductForm,
} from '@/components/admin/ProductForm'

export default function NewProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories')
        if (response.ok) {
          setCategories(await response.json())
        }
      } catch (fetchError) {
        console.error('Error fetching categories:', fetchError)
      }
    }

    if (session?.user?.role === 'ADMIN') {
      fetchCategories()
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Բեռնվում է...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'ADMIN') {
    router.push('/login')
    return null
  }

  const handleSubmit = async (payload: ReturnType<typeof import('@/lib/admin-form-mappers').translationsToProductPayload>) => {
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
      router.push('/admin/products')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to create product')
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
              Վերադառնալ
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Նոր ապրանք</h1>
            <p className="text-gray-600 mt-2">Ավելացնել նոր ապրանք կատալոգում</p>
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
