import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { registerSchema } from '@/lib/validations'

const PASSWORD_SALT_ROUNDS = 12

export async function POST(request: NextRequest) {
  try {
    const parsed = registerSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, phone, password } = parsed.data

    // Проверяем, существует ли пользователь
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'USER'
      }
    })

    // Возвращаем пользователя без пароля
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: 'Пользователь успешно создан', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    logger.error('Registration error', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
