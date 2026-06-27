'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from '@/i18n/navigation'

/** Redirect non-admins to localized login; returns auth state for admin pages. */
export function useAdminAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.replace('/login')
    }
  }, [session, status, router])

  return {
    session,
    status,
    isAdmin: session?.user?.role === 'ADMIN',
    isLoading: status === 'loading',
  }
}
