import { Redis } from '@upstash/redis'

let client: Redis | null = null

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  client ??= new Redis({ url, token })
  return client
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedis()
  if (!redis) return null
  return redis.get<T>(key)
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  await redis.set(key, value, { ex: ttlSeconds })
}

export async function cacheDel(...keys: string[]): Promise<void> {
  const redis = getRedis()
  if (!redis || keys.length === 0) return
  await redis.del(...keys)
}

export const CACHE_KEYS = {
  productsFeatured: 'products:featured',
  productsBanner: 'products:banner',
  categories: 'categories:all',
} as const

export const CACHE_TTL_SECONDS = 300

/** Invalidate product-related caches after admin mutations. */
export async function invalidateProductCaches(): Promise<void> {
  await cacheDel(
    CACHE_KEYS.productsFeatured,
    `${CACHE_KEYS.productsFeatured}:HIT`,
    `${CACHE_KEYS.productsFeatured}:NEW`,
    `${CACHE_KEYS.productsFeatured}:CLASSIC`,
    CACHE_KEYS.productsBanner
  )
}

/** Invalidate category list cache after admin mutations. */
export async function invalidateCategoryCaches(): Promise<void> {
  await cacheDel(CACHE_KEYS.categories)
}
