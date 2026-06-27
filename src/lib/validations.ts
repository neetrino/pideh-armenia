import { PaymentMethod } from '@prisma/client'
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Имя обязательно'),
  email: z.string().trim().email('Некорректный email'),
  phone: z.string().trim().optional(),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

export type RegisterInput = z.infer<typeof registerSchema>

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().int().nonnegative(),
})

export const orderSchema = z.object({
  name: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(1, 'Телефон обязателен'),
  address: z.string().trim().min(1, 'Адрес обязателен'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  notes: z.string().trim().optional(),
  deliveryTime: z.string().trim().optional(),
  total: z.number().int().nonnegative(),
  items: z.array(orderItemSchema).min(1, 'Корзина пуста'),
})

export type OrderInput = z.infer<typeof orderSchema>

export const validateProductsSchema = z.object({
  productIds: z.array(z.string().min(1)).min(1),
})

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).optional(),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
})

export const productInputSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().int().positive(),
  categoryId: z.string().min(1),
  image: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  status: z.enum(['REGULAR', 'HIT', 'NEW', 'CLASSIC', 'BANNER', '']).optional(),
})
