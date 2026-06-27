type LogLevel = 'info' | 'warn' | 'error'

const isProduction = process.env.NODE_ENV === 'production'

function format(level: LogLevel, message: string, meta?: unknown): void {
  const timestamp = new Date().toISOString()
  const payload = meta === undefined ? '' : ` ${safeStringify(meta)}`
  const line = `[${timestamp}] [${level.toUpperCase()}] ${message}${payload}`

  if (level === 'error') {
    console.error(line)
    return
  }
  if (level === 'warn') {
    console.warn(line)
    return
  }
  // Suppress info noise in production; keep it for local debugging.
  if (!isProduction) {
    console.info(line)
  }
}

function safeStringify(value: unknown): string {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value)
  } catch {
    return String(value)
  }
}

/**
 * Centralized application logger. Use instead of raw `console.*` in app code.
 */
export const logger = {
  info: (message: string, meta?: unknown) => format('info', message, meta),
  warn: (message: string, meta?: unknown) => format('warn', message, meta),
  error: (message: string, meta?: unknown) => format('error', message, meta),
}
