'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Search } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { withLocale } from '@/lib/api-path'
import { ProductWithCategory, Category } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'

import { CATEGORY_SLUGS, CATEGORY_SLUG_ORDER } from '@/lib/category-slugs'

const ALL_CATEGORY = 'all'
const SLUG_PIDE = CATEGORY_SLUGS.pide
const SLUG_COMBO = CATEGORY_SLUGS.combo

export default function ProductsPage() {
  const t = useTranslations('products')
  const tc = useTranslations('common')
  const locale = useLocale()
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const categoryOrder = CATEGORY_SLUG_ORDER

  const fetchProducts = async () => {
    try {
      const response = await fetch(withLocale('/api/products', locale))
      const data = await response.json()
      setProducts(data)
    } catch {
      // keep empty list on fetch failure
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(withLocale('/api/categories', locale))
      const data = await response.json()
      setCategories(data)
    } catch {
      // keep empty list on fetch failure
    }
  }

  const filterProducts = useCallback(() => {
    let filtered = products

    // Если есть поисковый запрос, ищем по всем товарам
    if (debouncedSearchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
      )
    } else {
      // Если нет поискового запроса, показываем товары выбранной категории
      if (selectedCategory !== ALL_CATEGORY) {
        filtered = filtered.filter((product) => product.category?.slug === selectedCategory)
      }
      // Если выбрано "Все", показываем все товары без фильтрации
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, debouncedSearchQuery])

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchProducts(),
        fetchCategories()
      ])
    }
    loadData()
  }, [locale])

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    if (searchQuery !== debouncedSearchQuery) {
      setSearching(true)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setSearching(false)
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, debouncedSearchQuery])

  useEffect(() => {
    filterProducts()
  }, [filterProducts])

  // Группировка товаров по категориям
  const groupProductsByCategory = useCallback((items: ProductWithCategory[]) => {
    const grouped: Record<string, { label: string; products: ProductWithCategory[] }> = {}
    
    items.forEach((product) => {
      const groupKey = product.category?.slug ?? tc('noCategory')
      const groupLabel = product.category?.name ?? tc('noCategory')
      if (!grouped[groupKey]) {
        grouped[groupKey] = { label: groupLabel, products: [] }
      }
      grouped[groupKey].products.push(product)
    })

    const priorityCategories = categoryOrder.filter((cat) => grouped[cat])
    const otherCategories = Object.keys(grouped).filter((cat) => !categoryOrder.includes(cat))
    const sortedCategories = [...priorityCategories, ...otherCategories]

    return sortedCategories.map((category) => ({
      category: grouped[category].label,
      slug: category,
      products: grouped[category].products,
    }))
  }, [tc])

  const handleAddToCart = useCallback((product: ProductWithCategory) => {
    addItem(product, 1)
    setAddedToCart(prev => new Set(prev).add(product.id))
    
    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      setAddedToCart(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
  }, [addItem])

  // Мемоизируем сгруппированные продукты
  const groupedProducts = useMemo(() => {
    return groupProductsByCategory(filteredProducts)
  }, [filteredProducts, groupProductsByCategory])

  // Компонент скелетона для карточки товара
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-56 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-12 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-200 rounded mx-auto mb-4 w-64 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded mx-auto w-96 animate-pulse"></div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="flex flex-wrap gap-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-12 w-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="hidden md:block">
          <Footer />
        </div>
        <div className="md:hidden h-24"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Отступ для fixed хедера */}
      <div className="md:hidden h-24"></div>
      <div className="hidden md:block h-24"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                searching ? 'text-orange-500 animate-pulse' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder={t('searchPlaceholderLong')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-gray-900 placeholder-gray-500 bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md focus:bg-white"
              />
              {searching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Category Filter - Mobile 2 rows, Desktop single row */}
          <div>
            {/* Mobile - 2 rows */}
            <div className="md:hidden">
              <div className="space-y-3">
                {/* First row - Все, Пиде, Комбо - 3 большие кнопки */}
                <div className="grid grid-cols-3 gap-3">
                  {[ALL_CATEGORY, SLUG_PIDE, SLUG_COMBO].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-4 rounded-2xl font-bold transition-all duration-300 text-base ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                      }`}
                      style={selectedCategory === category ? {
                        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      } : {}}
                    >
                      {category === ALL_CATEGORY
                        ? t('allCategories')
                        : categories.find((c) => c.slug === category)?.name ?? category}
                    </button>
                  ))}
                </div>
                
                {/* Second row - остальные категории */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories
                    .filter((cat) => cat.slug !== SLUG_PIDE && cat.slug !== SLUG_COMBO)
                    .map((category) => (
                    <button
                      key={`mobile-${category.id}`}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 text-sm ${
                        selectedCategory === category.slug
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                      }`}
                      style={selectedCategory === category.slug ? {
                        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      } : {}}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Desktop - single row */}
            <div className="hidden md:flex flex-wrap gap-4">
              {/* Кнопка "Все" */}
              <button
                onClick={() => setSelectedCategory(ALL_CATEGORY)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                  selectedCategory === ALL_CATEGORY
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                }`}
                style={selectedCategory === ALL_CATEGORY ? {
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                } : {}}
              >
                {t('allCategories')}
              </button>
              
              {/* Динамические категории */}
              {categories.map((category) => (
                <button
                  key={`desktop-${category.id}`}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.slug
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                  }`}
                  style={selectedCategory === category.slug ? {
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  } : {}}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Display */}
        {selectedCategory === ALL_CATEGORY && !debouncedSearchQuery ? (
          // Показываем продукты сгруппированными по категориям
          <div className="space-y-12">
            {groupedProducts.map(({ category, products: categoryProducts }) => (
              <div key={category}>
                {/* Заголовок категории */}
                <div className="flex items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mr-4">
                    {category}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                </div>
                
                {/* Продукты категории */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8 md:gap-15">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      variant="compact"
                      addedToCart={addedToCart}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Показываем продукты в обычной сетке (для конкретной категории или поиска)
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8 md:gap-15">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                variant="compact"
                addedToCart={addedToCart}
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            {debouncedSearchQuery ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('noSearchResults', { query: debouncedSearchQuery })}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('searchHint')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSearchQuery('')}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                  >
                    {t('clearSearch')}
                  </button>
                  <button
                    onClick={() => setSelectedCategory(ALL_CATEGORY)}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                  >
                    {t('showAllProducts')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-lg">{t('categoryNotFound', { category: selectedCategory })}</p>
                <p className="text-gray-400">{t('tryOtherCategory')}</p>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Footer - Hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Add bottom padding for mobile nav */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}
