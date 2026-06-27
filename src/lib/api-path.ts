/** Append locale query param for localized public API routes. */
export function withLocale(path: string, locale: string): string {
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}locale=${encodeURIComponent(locale)}`
}
