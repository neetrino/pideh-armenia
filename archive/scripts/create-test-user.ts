import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Проверяем, есть ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    if (existingUser) {
      console.log('Пользователь уже существует:', existingUser.email)
      return
    }

    // Создаем хеш пароля
    const hashedPassword = await bcrypt.hash('password123', 12)

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        phone: '+374 99 123 456',
        address: 'Test Address, Yerevan',
        password: hashedPassword,
        role: 'USER'
      }
    })

    console.log('Пользователь создан:', user)
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
