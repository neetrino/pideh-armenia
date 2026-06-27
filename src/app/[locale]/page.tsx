'use client'

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Phone, MapPin, Clock, ShoppingCart, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useCart } from "@/hooks/useCart";
import { withLocale } from "@/lib/api-path";
import { ProductWithCategory } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CATEGORY_SLUGS, CATEGORY_SLUG_ORDER } from '@/lib/category-slugs'
import ProductCard from "@/components/ProductCard";
import { useFormatPrice } from '@/hooks/useFormatPrice'

export default function Home() {
  const t = useTranslations('home')
  const locale = useLocale()
  const tp = useTranslations('productDetail')
  const tc = useTranslations('common')
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [comboProducts, setComboProducts] = useState<ProductWithCategory[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithCategory[]>([])
  const [bannerProduct, setBannerProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(CATEGORY_SLUGS.pide)
  const [searchQuery, setSearchQuery] = useState('')
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set())
  const [addedToCartHits, setAddedToCartHits] = useState<Set<string>>(new Set())
  const { addItem } = useCart()
  const formatPrice = useFormatPrice()

  useEffect(() => {
    fetchProducts()
  }, [locale])

  const fetchProducts = async () => {
    try {
      const [productsResponse, featuredResponse, bannerResponse] = await Promise.all([
        fetch(withLocale('/api/products', locale), { cache: 'no-store' }),
        fetch(withLocale('/api/products/featured', locale), { cache: 'no-store' }),
        fetch(withLocale('/api/products/banner', locale), { cache: 'no-store' }),
      ])

      if (!productsResponse.ok || !featuredResponse.ok || !bannerResponse.ok) {
        throw new Error('Failed to load products')
      }

      const productsData = await productsResponse.json()
      const featuredData = await featuredResponse.json()
      const bannerData = await bannerResponse.json()

      if (Array.isArray(productsData)) {
        setProducts(productsData)
        const combos = productsData.filter(
          (product: ProductWithCategory) => product.category?.slug === CATEGORY_SLUGS.combo
        )
        setComboProducts(combos.slice(0, 4))
      } else {
        setProducts([])
        setComboProducts([])
      }

      setFeaturedProducts(Array.isArray(featuredData) ? featuredData : [])
      setBannerProduct(bannerData)
    } catch {
      setProducts([])
      setComboProducts([])
      setFeaturedProducts([])
      setBannerProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: ProductWithCategory) => {
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
  }

  const handleAddToCartHits = (product: ProductWithCategory) => {
    addItem(product, 1)
    setAddedToCartHits(prev => new Set(prev).add(product.id))
    
    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      setAddedToCartHits(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HIT':
        return { text: tp('statusHit'), color: 'bg-red-500' }
      case 'NEW':
        return { text: tp('statusNew'), color: 'bg-green-500' }
      case 'CLASSIC':
        return { text: tp('statusClassic'), color: 'bg-blue-500' }
      case 'BANNER':
        return { text: tp('statusBanner'), color: 'bg-purple-500' }
      default:
        return { text: tp('statusPopular'), color: 'bg-orange-500' }
    }
  }

  const getFilteredProducts = () => {
    // Проверяем, что products является массивом
    if (!Array.isArray(products)) {
      return []
    }
    
    // Если есть поисковый запрос, ищем по всем товарам
    if (searchQuery.trim()) {
      return products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
    
    // Если нет поискового запроса, показываем товары выбранной категории
    return products.filter((product) => product.category?.slug === activeCategory)
  }

  const getCategoryLabel = (slug: string) => {
    const match = products.find((p) => p.category?.slug === slug)
    return match?.category?.name ?? slug
  }

  const isPopularProduct = (product: ProductWithCategory) => {
    // Определяем популярные товары по названию или другим критериям
    const popularNames = ['Мясная пиде', 'Пепперони пиде', 'Классическая сырная пиде', 'Грибная пиде']
    return popularNames.some(name => product.name.toLowerCase().includes(name.toLowerCase()))
  }

  const categories = CATEGORY_SLUG_ORDER

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      {/* Отступ для fixed хедера */}
      <div className="md:hidden h-20"></div>
      <div className="hidden md:block h-24"></div>

      {/* Hero Section - Compact for Mobile */}
      <section className="relative bg-orange-500 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-200/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-yellow-300/30 rounded-full animate-pulse"></div>
        </div>
        
        {/* Mobile Compact Version - App Style */}
        <div className="md:hidden relative max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Left content - compact */}
            <div className="flex-1 pr-4">
              <h1 className="text-3xl font-bold leading-tight mb-3">
                <span className="block text-white">{t('heroLine1')}</span>
                <span className="block text-yellow-200">{t('heroLine2')}</span>
              </h1>
              <p className="text-base text-orange-100 mb-4 font-medium">
                {t('heroFlavorsCount')}
              </p>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-200">15+</div>
                  <div className="text-orange-100 font-medium">{t('heroFlavorsLabel')}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-200">20</div>
                  <div className="text-orange-100 font-medium">{t('heroMinutesLabel')}</div>
                </div>
              </div>
            </div>
            
            {/* Right content - product showcase */}
            <div className="relative flex-shrink-0">
              {bannerProduct ? (
                <div className="relative bg-white/25 backdrop-blur-xl rounded-2xl p-3 text-center border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                  {/* Product Image Container */}
                  <div className="relative w-28 h-28 mx-auto mb-2 rounded-xl flex items-center justify-center overflow-hidden">
                    <img 
                      src={bannerProduct.image} 
                      alt={bannerProduct.name}
                      className="relative w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                    <div 
                      className="w-full h-full flex items-center justify-center text-4xl"
                      style={{ display: 'none' }}
                    >
                      🥟
                    </div>
                    
                    {/* Price Badge - Bottom Right */}
                    <div className="absolute bottom-1 right-1 bg-yellow-400 text-orange-800 px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                      {formatPrice(bannerProduct.price)}
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <h3 className="text-sm font-bold mb-1 text-white line-clamp-1">{bannerProduct.name}</h3>
                  <p className="text-xs text-orange-100/90 mb-2 line-clamp-1">{bannerProduct.description}</p>
                  
                  {/* Add Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(bannerProduct);
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-1.5 px-2 rounded-lg text-xs font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <span className="flex items-center justify-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      {tc('addToCart')}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="relative bg-white/15 backdrop-blur-lg rounded-2xl p-3 text-center border border-white/20">
                  <div className="relative w-24 h-24 mx-auto mb-2 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🥟</span>
                  </div>
                  <h3 className="text-sm font-bold mb-1 text-white">{t('armenianPide')}</h3>
                  <p className="text-xs text-orange-100">{t('tastyFresh')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Full Version */}
        <div className="hidden md:block relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium animate-fade-in">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                {t('heroBadge')}
              </div>
              
              {/* Main heading */}
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="block text-white animate-slide-up">{t('heroLine1')}</span>
                <span className="block text-yellow-200 animate-slide-up-delay">{t('heroLine2')}</span>
                <span className="block text-2xl md:text-3xl font-normal text-orange-100 mt-3 animate-fade-in-delay">
                  {t('heroTagline')}
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-orange-100 leading-relaxed max-w-lg animate-fade-in-delay-2">
                {t('heroDesc')}
                <span className="font-semibold text-yellow-200"> {t('heroDescHighlight')}</span> {t('heroDescEnd')}
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 animate-fade-in-delay-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-200">15+</div>
                  <div className="text-sm text-orange-100">{t('heroFlavorsLabel')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-200">20</div>
                  <div className="text-sm text-orange-100">{t('heroMinutesLabel')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-200">24/7</div>
                  <div className="text-sm text-orange-100">{t('heroDeliveryLabel')}</div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-delay-4">
                <Link 
                  href="/products"
                  className="group bg-white text-orange-500 px-6 py-3 rounded-xl font-bold text-base hover:bg-yellow-100 hover:scale-105 transition-all duration-300 text-center shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center">
                  {t('viewMenu')}
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                <Link 
                  href="/contact"
                  className="group border-2 border-white text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-white hover:text-orange-500 hover:scale-105 transition-all duration-300 text-center backdrop-blur-sm"
                >
                  <span className="flex items-center justify-center">
                    <Phone className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
                  {t('contactUs')}
                  </span>
                </Link>
              </div>
            </div>
            
            {/* Right content - Product showcase */}
            <div className="relative animate-fade-in-delay-5">
              {/* Price Badge - Above the image */}
              {bannerProduct && (
                <div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-orange-600 px-4 py-2 rounded-2xl text-lg font-bold shadow-2xl z-[100]"
                  style={{
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {formatPrice(bannerProduct.price)}
                </div>
              )}
              
              {/* Enhanced 3D Product Image - Outside the card */}
              {bannerProduct ? (
                <div className="relative w-80 h-80 mx-auto mb-4">
                  {/* 3D Product Image with floating effect */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-[calc(100%+4rem)] h-[calc(100%+4rem)] group z-50">
                    {/* Orange Shadow Layer - Like ProductCard */}
                    <div 
                      className="absolute inset-0 bg-orange-200/30 rounded-3xl transform translate-y-6 translate-x-3 group-hover:translate-y-8 group-hover:translate-x-4 transition-all duration-700"
                      style={{
                        filter: 'blur(6px)',
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-orange-300/25 rounded-3xl transform translate-y-4 translate-x-2 group-hover:translate-y-6 group-hover:translate-x-3 transition-all duration-700"
                      style={{
                        filter: 'blur(3px)',
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-orange-400/20 rounded-3xl transform translate-y-2 translate-x-1 group-hover:translate-y-4 group-hover:translate-x-2 transition-all duration-700"
                      style={{
                        filter: 'blur(1px)',
                      }}
                    />
                    
                    {/* Enhanced Main 3D Product Image */}
                    <img 
                      src={bannerProduct.image} 
                      alt={bannerProduct.name}
                      className="relative w-full h-full object-contain group-hover:scale-140 group-hover:translate-y-8 group-hover:rotate-3 transition-all duration-700 ease-out z-50"
                      style={{
                        transform: 'perspective(1000px) rotateX(8deg) rotateY(-3deg)',
                        imageRendering: '-webkit-optimize-contrast',
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const sibling = e.currentTarget.nextElementSibling as HTMLElement | null
                        if (sibling) sibling.style.display = 'flex'
                      }}
                    />


                    {/* Floating Elements - Like ProductCard */}
                    <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-yellow-400 rounded-full opacity-50 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500 shadow-lg"></div>
                    <div className="absolute top-1/2 -left-4 w-4 h-4 bg-red-500 rounded-full opacity-40 group-hover:opacity-70 group-hover:scale-125 transition-all duration-500 shadow-lg"></div>
                  </div>
                </div>
              ) : (
                <div className="relative w-72 h-72 mx-auto mb-6">
                  <div 
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-[calc(100%+3rem)] h-[calc(100%+3rem)] flex items-center justify-center bg-gradient-to-br from-orange-200 to-red-200 opacity-70 group-hover:opacity-90 transition-opacity duration-500 rounded-3xl shadow-2xl text-8xl"
                    style={{
                      filter: 'none',
                      transform: 'perspective(1000px) rotateX(5deg) rotateY(-2deg)',
                    }}
                  >
                    🥟
                  </div>
                </div>
              )}

              {/* Main product card - Same as ProductCard */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 shadow-2xl overflow-visible hover:shadow-3xl hover:scale-110 transition-all duration-700 cursor-pointer group border-0 transform hover:-translate-y-3">
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-300 rounded-full animate-pulse"></div>
                
                
                {bannerProduct ? (
                  <>
                    <h3 className="text-2xl font-bold mb-2">{bannerProduct.name}</h3>
                    <p className="text-orange-100 mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">{bannerProduct.description}</p>
                    
                    {/* Quick action */}
                    <button
                      onClick={() => handleAddToCart(bannerProduct)}
                      className="bg-yellow-400 text-orange-800 px-6 py-3 rounded-xl font-bold hover:scale-105 active:bg-green-500 active:text-white transition-all duration-300 shadow-lg"
                    >
                      <ShoppingCart className="inline w-5 h-5 mr-2" />
                      {t('quickOrder')}
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-2">{t('armenianPide')}</h3>
                    <p className="text-orange-100 mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">{t('tastyFresh')}</p>
                    
                    <Link 
                      href="/products"
                      className="bg-yellow-400 text-orange-800 px-6 py-3 rounded-xl font-bold hover:scale-105 active:bg-green-500 active:text-white transition-all duration-300 shadow-lg inline-block"
                    >
                      <ShoppingCart className="inline w-5 h-5 mr-2" />
                      {t('viewMenu')}
                    </Link>
                  </>
                )}
              </div>
              
              {/* Floating mini cards */}
              <div className="absolute -top-4 -left-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 animate-float">
                <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🍕</span>
                </div>
                <div className="text-xs font-semibold">{t('flavorsPlus')}</div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30 animate-float-delay">
                <div className="w-12 h-12 bg-white/30 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-2xl">🚚</span>
                </div>
                <div className="text-xs font-semibold">{t('fastDelivery')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Search Section - App Style */}
      <div className="md:hidden bg-white py-6 px-4 border-b border-gray-100">
        <div className="max-w-sm mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base text-gray-900 placeholder-gray-500 bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md focus:bg-white"
              />
            </div>
            <button 
              type="button"
              aria-label={t('searchLabel')}
              className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              style={{
                boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              <Search className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Showcase Section - Moved up */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-12">
            
            {/* Category tabs - Mobile 2 rows, Desktop single row */}
            <div className="mb-16">
              {/* Mobile - 2 rows with better design */}
              <div className="md:hidden">
                <div className="space-y-3">
                  {/* First row - Пиде и Комбо занимают весь ряд */}
                  <div className="grid grid-cols-2 gap-3">
                    {categories.slice(0, 2).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-6 py-4 rounded-2xl font-bold transition-all duration-300 text-base ${
                          activeCategory === category
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                        }`}
                        style={activeCategory === category ? {
                          boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        } : {}}
                      >
                        {getCategoryLabel(category)}
                      </button>
                    ))}
                  </div>
                  
                  {/* Second row - остальные категории */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.slice(2).map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 text-sm ${
                          activeCategory === category
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                        }`}
                        style={activeCategory === category ? {
                          boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                        } : {}}
                      >
                        {getCategoryLabel(category)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Desktop - single row */}
              <div className="hidden md:flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      activeCategory === category
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getCategoryLabel(category)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="mt-24">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
                <p className="text-gray-600">{t('loadingMenu')}</p>
              </div>
            </div>
          ) : getFilteredProducts().length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🍽️</div>
              {searchQuery.trim() ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('noSearchResults', { query: searchQuery })}
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
                      onClick={() => setActiveCategory('Комбо')}
                      className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                    >
                      {t('showCombos')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('categoryEmpty', { category: getCategoryLabel(activeCategory) })}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('categoryEmptyHint')}
                  </p>
                  <button
                    onClick={() => setActiveCategory('Комбо')}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                  >
                    {t('showCombos')}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8 md:gap-15">
              {getFilteredProducts().map((product, index) => (
                <div 
                  key={product.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    variant="compact"
                    addedToCart={addedToCart}
                  />
                </div>
              ))}
            </div>
          )}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link 
              href="/products"
              className="group inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>{t('viewAllMenu')}</span>
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Additional Pide Showcase Section - Hidden on mobile */}
      <section className="hidden md:block py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('featuredTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('featuredDesc')}
            </p>
          </div>

          {/* Featured products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCartHits}
                    variant="compact"
                    addedToCart={addedToCartHits}
                  />
                </div>
              ))
            ) : (
              // Fallback if no featured products
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">{t('featuredEmpty')}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link 
              href="/products"
              className="group inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>{t('viewAllFlavors')}</span>
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Hidden on mobile */}
      <section className="hidden md:block py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('featuresDesc')}
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Fast delivery */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t('featureFastTitle')}</h3>
              <p className="text-gray-600 text-center mb-4">{t('featureFastDesc')}</p>
              <div className="text-center">
                <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {t('featureFastBadge')}
                </span>
              </div>
            </div>

            {/* Delivery */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t('featureDeliveryTitle')}</h3>
              <p className="text-gray-600 text-center mb-4">{t('featureDeliveryDesc')}</p>
            <div className="text-center">
                <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {t('featureDeliveryBadge')}
                </span>
              </div>
            </div>

            {/* Quality */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t('featureQualityTitle')}</h3>
              <p className="text-gray-600 text-center mb-4">{t('featureQualityDesc')}</p>
            <div className="text-center">
                <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {t('featureQualityBadge')}
                </span>
              </div>
            </div>

            {/* Support */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t('featureSupportTitle')}</h3>
              <p className="text-gray-600 text-center mb-4">+374 95-044-888</p>
            <div className="text-center">
                <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {t('featureSupportBadge')}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Testimonials Section - Hidden on mobile */}
      <section className="hidden md:block py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('testimonialsTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('testimonialsDesc')}
            </p>
          </div>

          {/* Testimonials grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                {t('testimonial1')}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-orange-500 font-bold text-lg">А</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('testimonial1Name')}</h4>
                  <p className="text-sm text-gray-500">{t('testimonial1Role')}</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                {t('testimonial2')}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-500 font-bold text-lg">Д</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('testimonial2Name')}</h4>
                  <p className="text-sm text-gray-500">{t('testimonial2Role')}</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                {t('testimonial3')}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-500 font-bold text-lg">С</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t('testimonial3Name')}</h4>
                  <p className="text-sm text-gray-500">{t('testimonial3Role')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">1000+</div>
              <div className="text-gray-600">{t('statHappyClients')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">15+</div>
              <div className="text-gray-600">{t('statUniqueFlavors')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">20</div>
              <div className="text-gray-600">{t('statDeliveryMins')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">4.9</div>
              <div className="text-gray-600">{t('statRating')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Hidden on mobile */}
      <section className="hidden md:block py-20 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            {t('ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="bg-white text-orange-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              {t('orderNow')}
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-500 hover:scale-105 transition-all duration-300"
            >
              {t('learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Hidden on mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Add bottom padding for mobile nav */}
      <div className="md:hidden h-24"></div>
    </div>
  );
}