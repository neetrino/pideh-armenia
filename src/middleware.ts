import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { routing } from '@/i18n/routing'
import { LOCALE_COOKIE_NAME, resolveLocale } from '@/lib/locale-cookie'

const intlMiddleware = createIntlMiddleware(routing)

const LEGACY_STOREFRONT_PATHS = [
  '/login',
  '/register',
  '/cart',
  '/checkout',
  '/profile',
  '/products',
  '/about',
  '/contact',
  '/order-success',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  if (LEGACY_STOREFRONT_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.redirect(
      new URL(`/${routing.defaultLocale}${pathname}`, request.url)
    )
  }

  if (pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    const loginLocale = resolveLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value)
    if (!token) {
      return NextResponse.redirect(
        new URL(`/${loginLocale}/login`, request.url)
      )
    }
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(
        new URL(`/${loginLocale}/login`, request.url)
      )
    }
    return NextResponse.next()
  }

  const profileMatch = pathname.match(/^\/(hy|en|ru)\/profile(\/|$)/)
  if (profileMatch) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })
    if (!token) {
      return NextResponse.redirect(
        new URL(`/${profileMatch[1]}/login`, request.url)
      )
    }
  }

  if (pathname.includes('.')) {
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(hy|en|ru)/:path*', '/admin/:path*', '/login', '/register', '/cart/:path*', '/checkout', '/profile/:path*', '/products/:path*', '/about', '/contact', '/order-success'],
}
