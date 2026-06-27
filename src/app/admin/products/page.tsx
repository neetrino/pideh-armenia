'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Package,
  Search,
  Filter
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ProductWithCategory, ProductStatus } from '@/types'

export default function AdminProducts() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    fetchProducts()
  }, [session, status, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
      } else {
        alert('Ошибка при удалении товара')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Ошибка при удалении товара')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category?.name === selectedCategory
    
    // Фильтр по статусу: "all" - все товары, "special" - только особые (HIT, NEW, CLASSIC, BANNER)
    const matchesStatus = !selectedStatus || 
                         (selectedStatus === 'all') || 
                         (selectedStatus === 'special' && ['HIT', 'NEW', 'CLASSIC', 'BANNER'].includes(product.status))
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))]
  
  // Статистика по статусам
  const statusStats = {
    total: products.length,
    regular: products.filter(p => p.status === 'REGULAR').length,
    hit: products.filter(p => p.status === 'HIT').length,
    new: products.filter(p => p.status === 'NEW').length,
    classic: products.filter(p => p.status === 'CLASSIC').length,
    banner: products.filter(p => p.status === 'BANNER').length
  }

  const getStatusBadge = (productStatus: ProductStatus) => {
    switch (productStatus) {
      case 'HIT':
        return { 
          text: 'ХИТ', 
          className: 'bg-red-100 text-red-800 border-red-200' 
        }
      case 'NEW':
        return { 
          text: 'НОВИНКА', 
          className: 'bg-green-100 text-green-800 border-green-200' 
        }
      case 'CLASSIC':
        return { 
          text: 'КЛАССИКА', 
          className: 'bg-blue-100 text-blue-800 border-blue-200' 
        }
      case 'BANNER':
        return { 
          text: 'БАННЕР', 
          className: 'bg-purple-100 text-purple-800 border-purple-200' 
        }
      default:
        return null // Обычные товары без лейбла
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Отступ для fixed хедера */}
      <div className="md:hidden h-24"></div>
      <div className="hidden md:block h-24"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад к админке
            </Link>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">Управление товарами</h1>
          </div>
          
          <Link 
            href="/admin/products/new"
            className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Добавить товар
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline h-4 w-4 mr-1" />
                Поиск
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Поиск по названию или описанию..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Категория
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 bg-white"
                style={{ color: '#111827' }}
              >
                <option value="" style={{ color: '#111827', backgroundColor: 'white' }}>Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category} style={{ color: '#111827', backgroundColor: 'white' }}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Статус
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 bg-white"
                style={{ color: '#111827' }}
              >
                <option value="" style={{ color: '#111827', backgroundColor: 'white' }}>Все</option>
                <option value="special" style={{ color: '#111827', backgroundColor: 'white' }}>Особые</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Товары ({filteredProducts.length})
              </h2>
              
              {/* Статистика по статусам */}
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-500">Всего: {statusStats.total}</span>
                {statusStats.hit > 0 && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                    Хиты: {statusStats.hit}
                  </span>
                )}
                {statusStats.new > 0 && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    Новинки: {statusStats.new}
                  </span>
                )}
                {statusStats.classic > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    Классика: {statusStats.classic}
                  </span>
                )}
                {statusStats.banner > 0 && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                    Баннер: {statusStats.banner}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-orange-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    {product.image && product.image !== 'no-image' ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-orange-500" />
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Категория: {product.category?.name || 'Без категории'}</span>
                      <span>Цена: {product.price} ֏</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isAvailable ? 'Доступен' : 'Недоступен'}
                      </span>
                      {/* Статус товара */}
                      {(() => {
                        const statusBadge = getStatusBadge(product.status)
                        return statusBadge ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.className}`}>
                            {statusBadge.text}
                          </span>
                        ) : null
                      })()}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Редактировать"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Товары не найдены</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
