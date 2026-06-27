import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { buildImageKey, uploadImageWebp } from '@/lib/storage'
import { logger } from '@/lib/logger'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const imageFile = (await request.formData()).get('image') as File | null

    if (!imageFile || !imageFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    if (imageFile.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer())
    const key = buildImageKey(imageFile.name)
    const url = await uploadImageWebp(buffer, key)

    return NextResponse.json({ success: true, path: url, fileName: key.split('/').pop() })
  } catch (error) {
    logger.error('Upload image error', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
