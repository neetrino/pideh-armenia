import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { uploadImageWebp } from '@/lib/storage'
import { logger } from '@/lib/logger'

const MAX_LOGO_BYTES = 2 * 1024 * 1024
const LOGO_KEY = 'logo.webp'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const file = (await request.formData()).get('file') as File | null
    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    if (file.size > MAX_LOGO_BYTES) {
      return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadImageWebp(buffer, LOGO_KEY)

    return NextResponse.json({ success: true, message: 'Logo updated successfully', url })
  } catch (error) {
    logger.error('Logo upload error', error)
    return NextResponse.json({ error: 'Failed to update logo' }, { status: 500 })
  }
}
