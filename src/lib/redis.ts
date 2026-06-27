import { Redis } from '@upstash/redis'
import { allLocaleCacheKeys } from '@/lib/localize-content'

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

const FEATURED_STATUS_SUFFIXES = ['', ':HIT', ':NEW', ':CLASSIC'] as const

/** Invalidate product-related caches after admin mutations. */
export async function invalidateProductCaches(): Promise<void> {
  const keys = [
    ...allLocaleCacheKeys(CACHE_KEYS.productsBanner),
    ...FEATURED_STATUS_SUFFIXES.flatMap((suffix) =>
      allLocaleCacheKeys(`${CACHE_KEYS.productsFeatured}${suffix}`)
    ),
  ]
  await cacheDel(...keys)
}

/** Invalidate category list cache after admin mutations. */
export async function invalidateCategoryCaches(): Promise<void> {
  await cacheDel(...allLocaleCacheKeys(CACHE_KEYS.categories))
}
