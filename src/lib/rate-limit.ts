import { Redis } from '@upstash/redis'

const REGISTER_LIMIT = 5
const ORDER_LIMIT = 10
const WINDOW_SECONDS = 60

let client: Redis | null = null

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  client ??= new Redis({ url, token })
  return client
}

/** Sliding-window counter; fails open when Redis is unavailable. */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number = WINDOW_SECONDS
): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return true

  const rateKey = `ratelimit:${key}`
  const count = await redis.incr(rateKey)
  if (count === 1) {
    await redis.expire(rateKey, windowSeconds)
  }
  return count <= limit
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export async function checkRegisterRateLimit(request: Request): Promise<boolean> {
  return checkRateLimit(`register:${getClientIp(request)}`, REGISTER_LIMIT)
}

export async function checkOrderRateLimit(request: Request): Promise<boolean> {
  return checkRateLimit(`order:${getClientIp(request)}`, ORDER_LIMIT)
}
