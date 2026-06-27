import { NextResponse } from 'next/server'
import { listImages } from '@/lib/storage'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const imageFiles = await listImages()
    return NextResponse.json(imageFiles)
  } catch (error) {
    logger.error('Error reading images', error)
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500 })
  }
}
