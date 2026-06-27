'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Link, useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, Clock, MapPin, Phone, Zap } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { ProductWithCategory } from '@/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [similarProducts, setSimilarProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProductAndSimilar(params.id as string)
    }
  }, [params.id])

  const fetchProductAndSimilar = async (id: string) => {
    try {
      // Параллельная загрузка товара и всех товаров для похожих
      const [productResponse, similarResponse] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch('/api/products')
      ])

      if (productResponse.ok) {
        const productData = await productResponse.json()
        setProduct(productData)
      } else {
        router.push('/products')
        return
      }

      if (similarResponse.ok) {
        const products = await similarResponse.json()
        // Фильтруем похожие товары (исключаем текущий и берем первые 4)
        const similar = products
          .filter((p: ProductWithCategory) => p.id !== id)
          .slice(0, 4)
        setSimilarProducts(similar)
      }
    } catch {
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = useCallback(() => {
    if (product) {
      addItem(product, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }, [product, quantity, addItem])

  // Мемоизируем похожие товары
  const memoizedSimilarProducts = useMemo(() => {
    return similarProducts
  }, [similarProducts])

  // Компонент скелетона для страницы товара
  const ProductPageSkeleton = () => (
    <div className="min-h-screen bg-gray-50" style={{ overflow: 'auto' }}>
      <Header />
      
      {/* Breadcrumb Skeleton */}
      <div className="bg-white pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <span className="text-gray-400">/</span>
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            <span className="text-gray-400">/</span>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-32 mb-8 animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image Skeleton */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-96 bg-gray-200 animate-pulse"></div>
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-8">
            <div>
              <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>

            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="flex flex-wrap gap-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-14 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-14 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Products Skeleton */}
        <section className="mb-16">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Hide Footer on Mobile */}
      <div className="hidden md:block">
      <Footer />
      </div>
    </div>
  )

  if (loading) {
    return <ProductPageSkeleton />
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50" style={{ overflow: 'auto' }}>
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Товар не найден</h1>
            <p className="text-gray-600 mb-6">Возможно, товар был удален или не существует</p>
            <Link 
              href="/products" 
              className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к каталогу
            </Link>
          </div>
        </div>
        {/* Hide Footer on Mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ overflow: 'auto' }}>
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">Главная</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-orange-500">Меню</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Назад к каталогу
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-visible group relative">
              <div className="relative h-96 overflow-visible">
                {/* Transparent background - no gradient */}
                
                {/* 3D Product Container */}
                {product.image && product.image !== 'no-image' ? (
                  <div className="relative w-full h-full">
                    {/* 3D Product Image with floating effect */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-[calc(100%+1rem)] h-[calc(100%+1rem)]">
                      {/* 3D Shadow Layer */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-gray-200/20 to-gray-300/15 rounded-3xl transform translate-y-2 translate-x-1 group-hover:translate-y-3 group-hover:translate-x-2 transition-all duration-700"
                        style={{
                          filter: 'none',
                        }}
                      />
                      
                      {/* Main 3D Product Image */}
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        className="relative w-full h-full object-contain group-hover:scale-125 group-hover:-translate-y-3 group-hover:rotate-2 transition-all duration-700 ease-out"
                        style={{
                          transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)',
                          imageRendering: '-webkit-optimize-contrast',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div 
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-[calc(100%+3rem)] h-[calc(100%+3rem)] flex items-center justify-center opacity-70 group-hover:opacity-90 transition-opacity duration-500 text-8xl"
                    style={{
                      filter: 'none',
                      transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)',
                    }}
                  >
                    🥟
                  </div>
                )}
                
                {/* 3D Floating Badges */}
                <div className="absolute top-12 left-4 flex flex-col gap-2 z-20">
                  {/* 3D Category Badge */}
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                    style={{
                      boxShadow: '0 10px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {product.category?.name || 'Без категории'}
                  </div>
                  
                  {/* 3D Special Badge */}
                  {product.status === 'HIT' && (
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-1 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                      style={{
                        boxShadow: '0 10px 25px rgba(255, 193, 7, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Star className="w-3 h-3" />
                      ХИТ ПРОДАЖ
                    </div>
                  )}
                  
                  {product.status === 'NEW' && (
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-1 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                      style={{
                        boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Zap className="w-3 h-3" />
                      НОВИНКА
                    </div>
                  )}
                  
                  {product.status === 'CLASSIC' && (
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-3 py-1 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-1 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                      style={{
                        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <Star className="w-3 h-3" />
                      КЛАССИКА
                    </div>
                  )}
                </div>

              </div>
              
              {/* 3D Floating Decorative Elements - positioned inside container */}
              <div 
                className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110"
                style={{
                  boxShadow: '0 10px 25px rgba(255, 107, 53, 0.3)',
                  filter: 'blur(1px)',
                }}
              />
              <div 
                className="absolute bottom-2 left-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30 group-hover:opacity-60 transition-all duration-500 group-hover:scale-110"
                style={{
                  boxShadow: '0 10px 25px rgba(255, 193, 7, 0.3)',
                  filter: 'blur(1px)',
                }}
              />
              <div 
                className="absolute top-1/2 left-2 w-2 h-2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-125"
                style={{
                  boxShadow: '0 5px 15px rgba(236, 72, 153, 0.2)',
                  filter: 'blur(0.5px)',
                }}
              />
            </div>

            {/* Additional Info */}
            <div style={{ marginTop: '50px' }}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Информация о товаре:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Категория: {product.category?.name || 'Без категории'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Время приготовления: 15-20 минут
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Вес: ~300г
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Только свежие ингредиенты
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Без консервантов
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">{product.description}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(4.9) • 127 отзывов</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-4xl font-bold text-orange-500">{product.price} ֏</span>
                <span className="text-lg text-gray-500">за порцию</span>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ингредиенты:</h3>
              <div className="flex flex-wrap gap-3">
                {product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-orange-100 text-orange-800 text-sm rounded-full font-medium hover:bg-orange-200 transition-colors"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <label className="text-lg font-medium text-gray-900">Количество:</label>
                <div className="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-orange-100 transition-colors text-gray-700 hover:text-orange-600"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="px-6 py-3 min-w-[4rem] text-center text-lg font-semibold bg-gray-50 text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-orange-100 transition-colors text-gray-700 hover:text-orange-600"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                    addedToCart
                      ? 'bg-green-500 text-white scale-105 shadow-lg'
                      : 'bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>
                    {addedToCart ? '✓ Добавлено в корзину!' : 'Добавить в корзину'}
                  </span>
                </button>
              </div>
            </div>

            {/* Product Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <div>
                    <div className="font-semibold text-gray-900">15-20 мин</div>
                    <div className="text-sm text-gray-600">Время приготовления</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-orange-500" />
                  <div>
                    <div className="font-semibold text-gray-900">30 мин</div>
                    <div className="text-sm text-gray-600">Доставка</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-orange-500" />
                  <div>
                    <div className="font-semibold text-gray-900">24/7</div>
                    <div className="text-sm text-gray-600">Поддержка</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Similar Products */}
        {memoizedSimilarProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center space-x-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Похожие товары
              </h2>
              <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
              <Link 
                href="/products" 
                className="group text-orange-500 hover:text-orange-600 text-lg font-bold flex items-center space-x-2 transition-colors duration-300 ml-2"
              >
                <span>Все</span>
                <ArrowLeft className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform duration-300" style={{ strokeWidth: 3 }} />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {memoizedSimilarProducts.map((similarProduct) => (
                <ProductCard
                  key={similarProduct.id}
                  product={similarProduct}
                  onAddToCart={addItem}
                  variant="compact"
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Hide Footer on Mobile */}
      <div className="hidden md:block">
      <Footer />
      </div>
    </div>
  )
}
