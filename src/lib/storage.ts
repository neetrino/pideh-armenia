import {
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { mkdir, readdir, writeFile } from 'fs/promises'
import { join } from 'path'

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'] as const

export type StoredFile = {
  name: string
  path: string
  category: string
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_URL
  )
}

function getR2Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
}

export function getPublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL!.replace(/\/$/, '')
  return `${base}/${key}`
}

export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  if (isR2Configured()) {
    const client = getR2Client()
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    )
    return getPublicUrl(key)
  }

  const segments = key.split('/')
  const filename = segments.pop()!
  const folder = segments.join('/') || 'uploads'
  const uploadDir = join(process.cwd(), 'public', folder)

  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, filename), buffer)

  return `/${folder}/${filename}`
}

export async function listImages(): Promise<StoredFile[]> {
  if (isR2Configured()) {
    const client = getR2Client()
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
        Prefix: 'images/',
      })
    )

    return (response.Contents ?? [])
      .map((item) => item.Key)
      .filter((key): key is string => Boolean(key))
      .filter((key) => {
        const ext = key.split('.').pop()?.toLowerCase()
        return ext ? IMAGE_EXTENSIONS.includes(ext as (typeof IMAGE_EXTENSIONS)[number]) : false
      })
      .map((key) => {
        const name = key.replace(/^images\//, '')
        return {
          name,
          path: getPublicUrl(key),
          category: getImageCategory(name),
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const imagesDir = join(process.cwd(), 'public', 'images')
  const files = await readdir(imagesDir, { withFileTypes: true })

  return files
    .filter((file) => {
      if (!file.isFile()) return false
      const ext = file.name.toLowerCase().split('.').pop()
      return ext ? IMAGE_EXTENSIONS.includes(ext as (typeof IMAGE_EXTENSIONS)[number]) : false
    })
    .map((file) => ({
      name: file.name,
      path: `/images/${file.name}`,
      category: getImageCategory(file.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function getImageCategory(filename: string): string {
  const name = filename.toLowerCase()

  if (name.includes('pide') || name.includes('пиде')) return 'Пиде'
  if (name.includes('kombo') || name.includes('комбо')) return 'Комбо'
  if (name.includes('sauce') || name.includes('соус')) return 'Соусы'
  if (
    name.includes('drink') ||
    name.includes('напиток') ||
    name.includes('cola') ||
    name.includes('juice')
  ) {
    return 'Напитки'
  }
  if (
    name.includes('snack') ||
    name.includes('снэк') ||
    name.includes('popcorn') ||
    name.includes('fries')
  ) {
    return 'Снэк'
  }

  return 'Другое'
}

export function buildImageKey(fileName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = fileName.split('.').pop() ?? 'jpg'
  return `images/${timestamp}-${randomString}.${extension}`
}

export function buildUploadKey(folder: string, fileName: string): string {
  const timestamp = Date.now()
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${folder}/${timestamp}-${safeName}`
}
