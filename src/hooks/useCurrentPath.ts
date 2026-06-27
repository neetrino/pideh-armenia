'use client'

import { usePathname } from 'next/navigation'

export function useCurrentPath() {
  const pathname = usePathname()
  
  // Определяем активную страницу на основе пути
  const getActivePage = (path: string) => {
    if (path === '/') return 'home'
    if (path.startsWith('/products')) return 'products'
    if (path.startsWith('/about')) return 'about'
    if (path.startsWith('/contact')) return 'contact'
    if (path.startsWith('/profile')) return 'profile'
    if (path.startsWith('/admin')) return 'admin'
    if (path.startsWith('/login')) return 'login'
    if (path.startsWith('/register')) return 'register'
    return 'home'
  }
  
  return {
    pathname,
    activePage: getActivePage(pathname)
  }
}
