'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/hooks/useCart'
import { CartSheet } from '@/components/CartSheet'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CartSheet />
      </CartProvider>
    </SessionProvider>
  )
}
