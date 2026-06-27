import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

// GET - получить все настройки
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await prisma.settings.findMany()
    
    // Преобразуем в объект для удобства
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json(settingsObj)
  } catch (error) {
    logger.error('Error fetching settings', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST - создать или обновить настройку
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { key, value } = await request.json()

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    // Используем upsert для создания или обновления
    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })

    return NextResponse.json(setting)
  } catch (error) {
    logger.error('Error updating setting', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
