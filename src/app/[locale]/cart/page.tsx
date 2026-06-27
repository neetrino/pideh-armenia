'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, ShoppingCart, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useFormatPrice } from '@/hooks/useFormatPrice'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CartPage() {
  const t = useTranslations('cart')
  const tc = useTranslations('common')
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const formatPrice = useFormatPrice()
  const [isClearing, setIsClearing] = useState(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleClearCart = () => {
    setIsClearing(true)
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 500)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Отступ для fixed хедера */}
        <div className="h-24 md:h-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-16 w-16 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('emptyTitle')}</h1>
            <p className="text-lg text-gray-600 mb-8">
              {t('emptyDesc')}
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-lg"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('goToMenu')}
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Отступ для fixed хедера */}
      <div className="h-24 md:h-20"></div>
      
      {/* Mobile App Style Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-20 md:pb-8">
        {/* Mobile Header */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/products"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 mr-2" />
              <span className="text-lg font-medium">{t('backToMenu')}</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="flex items-center text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/products"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('backToMenu')}
            </Link>
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          </div>
          
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className="flex items-center text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            {isClearing ? t('clearing') : t('clearCart')}
          </button>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Cart Items */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 px-2">
              {t('itemsInCart', { count: items.length })}
            </h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="bg-white rounded-2xl shadow-lg p-4">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.product.image && item.product.image !== 'no-image' ? (
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-full h-full flex items-center justify-center text-2xl"
                        style={{ display: (item.product.image && item.product.image !== 'no-image') ? 'none' : 'flex' }}
                      >
                        🥟
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 leading-tight">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.product.category?.name || tc('noCategory')}
                      </p>
                      <div className="text-lg font-bold text-orange-500 mb-3">
                        {formatPrice(item.product.price)}
                      </div>
                      
                      {/* Quantity Controls - Mobile Style */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-700" />
                          </button>
                          
                          <span className="w-8 text-center font-semibold text-base text-gray-900">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>
                        
                        {/* Total Price and Delete */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 mb-1">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            {tc('delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-300">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('itemsInCart', { count: items.length })}
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.product.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-orange-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.product.image && item.product.image !== 'no-image' ? (
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full flex items-center justify-center text-3xl"
                          style={{ display: (item.product.image && item.product.image !== 'no-image') ? 'none' : 'flex' }}
                        >
                          🥟
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.product.category?.name || tc('noCategory')}
                        </p>
                        <div className="text-xl font-bold text-orange-500">
                          {formatPrice(item.product.price)}
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="h-4 w-4 text-gray-700" />
                        </button>
                        
                        <span className="w-12 text-center font-semibold text-lg text-gray-900">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4 text-gray-700" />
                        </button>
                      </div>
                      
                      {/* Total Price */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-500 hover:text-red-600 text-sm mt-1"
                        >
                          {tc('delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('orderSummary')}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('itemsCount', { count: items.reduce((total, item) => total + item.quantity, 0) })}</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('delivery')}</span>
                  <span className="text-green-600 font-semibold">{t('deliveryFree')}</span>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>{t('toPay')}</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-center block text-lg"
              >
                {t('checkout')}
              </Link>
              
              <div className="mt-4 text-center">
                <Link 
                  href="/products"
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  {t('continueShopping')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Order Summary */}
        <div className="md:hidden">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('orderSummary')}</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>{t('itemsCount', { count: items.reduce((total, item) => total + item.quantity, 0) })}</span>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('delivery')}</span>
                <span className="text-green-600 font-semibold">{t('deliveryFree')}</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>{t('toPay')}</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
              </div>
            </div>
            
            <Link
              href="/checkout"
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-center block text-lg"
            >
              {t('checkout')}
            </Link>
            
            <div className="mt-4 text-center">
              <Link 
                href="/products"
                className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
              >
                {t('continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hide Footer on Mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}
