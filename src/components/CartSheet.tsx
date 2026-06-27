'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useFormatPrice } from '@/hooks/useFormatPrice'
import type { CartItem } from '@/types'

function CartProductImage({ image, name }: { image: string | null; name: string }) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasImage = Boolean(image && image !== 'no-image' && !imageFailed)

  if (!hasImage) {
    return (
      <div className="w-full h-full flex items-center justify-center text-2xl">
        🥟
      </div>
    )
  }

  return (
    <img
      src={image ?? ''}
      alt={name}
      className="w-full h-full object-contain"
      onError={() => setImageFailed(true)}
    />
  )
}

function CartSheetItem({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}) {
  const tc = useTranslations('common')
  const formatPrice = useFormatPrice()

  return (
    <div className="relative flex gap-3 py-4 border-b border-gray-100 last:border-b-0">
      <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
        <CartProductImage image={item.product.image} name={item.product.name} />
      </div>

      <div className="flex-1 min-w-0 pr-8">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
          {item.product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {item.product.category?.name || tc('noCategory')}
        </p>
        <p className="text-sm font-bold text-orange-500 mt-1">
          {formatPrice(item.product.price)}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label={tc('quantity')}
            >
              <Minus className="h-4 w-4 text-gray-700" />
            </button>
            <span className="w-6 text-center font-semibold text-sm text-gray-900">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label={tc('quantity')}
            >
              <Plus className="h-4 w-4 text-gray-700" />
            </button>
          </div>

          <p className="font-bold text-gray-900 text-sm">
            {formatPrice(item.product.price * item.quantity)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.product.id)}
        className="absolute top-4 right-0 p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        aria-label={tc('delete')}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export function CartSheet() {
  const t = useTranslations('cart')
  const tc = useTranslations('common')
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
    clearCart,
  } = useCart()
  const formatPrice = useFormatPrice()
  const [isClearing, setIsClearing] = useState(false)
  const [isPanelVisible, setIsPanelVisible] = useState(false)

  useEffect(() => {
    if (!isCartOpen) {
      setIsPanelVisible(false)
      return
    }

    const frame = requestAnimationFrame(() => setIsPanelVisible(true))
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }

    window.addEventListener('keydown', handleEscape)
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isCartOpen, closeCart])

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }
    updateQuantity(productId, newQuantity)
  }

  const handleClearCart = () => {
    setIsClearing(true)
    setTimeout(() => {
      clearCart()
      setIsClearing(false)
    }, 300)
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label={t('title')}>
      <button
        type="button"
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isPanelVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
        aria-label={tc('back')}
      />

      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isPanelVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{t('title')}</h2>
          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                disabled={isClearing}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                aria-label={t('clearCart')}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={tc('back')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('emptyTitle')}</h3>
            <p className="text-gray-600 mb-6">{t('emptyDesc')}</p>
            <Link
              href="/products"
              onClick={closeCart}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              {t('goToMenu')}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <p className="text-sm text-gray-500 py-3">
                {t('itemsInCart', { count: items.length })}
              </p>
              {items.map((item) => (
                <CartSheetItem
                  key={item.product.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="border-t border-gray-200 px-5 py-4 bg-white">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('itemsCount', { count: totalItems })}</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('delivery')}</span>
                  <span className="text-green-600 font-semibold">{t('deliveryFree')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>{t('toPay')}</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-center block"
              >
                {t('checkout')}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
