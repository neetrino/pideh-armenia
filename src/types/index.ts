import type {
  User,
  Product,
  Order,
  OrderItem,
  OrderStatus,
  ProductStatus,
  PaymentMethod,
} from '@prisma/client'
import type { LocalizedCategory, LocalizedProduct } from '@/lib/localize-content'

export type { Product, User, Order, OrderItem, OrderStatus, ProductStatus, PaymentMethod }

/** Category from public API (localized name + stable slug). */
export type Category = LocalizedCategory

/** Product from public API with localized fields. */
export type ProductWithCategory = LocalizedProduct

export interface CartItem {
  product: ProductWithCategory
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  addItem: (product: ProductWithCategory, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  validateCart: () => Promise<void>
}

export interface OrderItemForm {
  productId: string
  quantity: number
  price: number
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Ожидает подтверждения',
  CONFIRMED: 'Подтвержден',
  PREPARING: 'Готовится',
  READY: 'Готов к выдаче',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменен',
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  REGULAR: 'Обычный',
  HIT: 'Хит продаж',
  NEW: 'Новинка',
  CLASSIC: 'Классика',
  BANNER: 'Баннер',
}

export type CategoryName = 'Комбо' | 'Пиде' | 'Снэк' | 'Соусы' | 'Напитки'
