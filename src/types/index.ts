import type {
  User,
  Product,
  Category as DbCategory,
  Order,
  OrderItem,
  OrderStatus,
  ProductStatus,
  PaymentMethod,
} from '@prisma/client'
import type { LocalizedCategory, LocalizedProduct } from '@/lib/localize-content'

export type {
  Product,
  User,
  Order,
  OrderItem,
  OrderStatus,
  ProductStatus,
  PaymentMethod,
  DbCategory,
}

/** Category from public API (localized name + stable slug). */
export type Category = LocalizedCategory

/** Product from public API with localized fields. */
export type ProductWithCategory = LocalizedProduct

/** Full DB category row for admin forms. */
export type AdminCategory = DbCategory

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
  PENDING: 'Սպասման մեջ',
  CONFIRMED: 'Հաստատված',
  PREPARING: 'Պատրաստվում է',
  READY: 'Պատրաստ է',
  DELIVERED: 'Առաքված',
  CANCELLED: 'Չեղարկված',
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  REGULAR: 'Սովորական',
  HIT: 'Հիթ',
  NEW: 'Նոր',
  CLASSIC: 'Դասական',
  BANNER: 'Բաններ',
}
