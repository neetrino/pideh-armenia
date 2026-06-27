import {
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import sharp from 'sharp'

const WEBP_QUALITY = 85

export type StoredFile = {
  name: string
  path: string
  category: string
}

function requireR2Config(): {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  publicUrl: string
} {
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
  const bucket = process.env.R2_BUCKET_NAME
  const publicUrl = process.env.R2_PUBLIC_URL

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    throw new Error('R2 is not configured. Set R2_* environment variables.')
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl }
}

function getR2Client(accountId: string, accessKeyId: string, secretAccessKey: string): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  })
}

export function getPublicUrl(key: string): string {
  const { publicUrl } = requireR2Config()
  return `${publicUrl.replace(/\/$/, '')}/${key}`
}

async function putObject(key: string, body: Buffer, contentType: string): Promise<string> {
  const config = requireR2Config()
  const client = getR2Client(config.accountId, config.accessKeyId, config.secretAccessKey)

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )

  return getPublicUrl(key)
}

/** Convert image buffer to webp and upload to R2. Returns public URL. */
export async function uploadImageWebp(buffer: Buffer, key: string): Promise<string> {
  const webp = await sharp(buffer).webp({ quality: WEBP_QUALITY }).toBuffer()
  const normalizedKey = key.endsWith('.webp') ? key : `${key.replace(/\.[^.]+$/, '')}.webp`
  return putObject(normalizedKey, webp, 'image/webp')
}

export function buildImageKey(baseName: string): string {
  const safe = baseName.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^.]+$/, '')
  const suffix = Math.random().toString(36).slice(2, 8)
  return `images/${Date.now()}-${safe}-${suffix}.webp`
}

export async function listImages(): Promise<StoredFile[]> {
  const config = requireR2Config()
  const client = getR2Client(config.accountId, config.accessKeyId, config.secretAccessKey)

  const response = await client.send(
    new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: 'images/',
    })
  )

  return (response.Contents ?? [])
    .map((item) => item.Key)
    .filter((key): key is string => key !== undefined && key.endsWith('.webp'))
    .map((key) => {
      const name = key.replace(/^images\//, '')
      return { name, path: getPublicUrl(key), category: getImageCategory(name) }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function getImageCategory(filename: string): string {
  const name = filename.toLowerCase()
  if (name.includes('pide') || name.includes('пиде')) return 'Пиде'
  if (name.includes('kombo') || name.includes('комбо')) return 'Комбо'
  if (name.includes('sauce') || name.includes('соус')) return 'Соусы'
  if (name.includes('drink') || name.includes('cola') || name.includes('juice')) return 'Напитки'
  if (name.includes('snack') || name.includes('popcorn') || name.includes('fries')) return 'Снэк'
  return 'Другое'
}
