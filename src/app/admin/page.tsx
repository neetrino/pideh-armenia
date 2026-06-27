'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Settings,
  Tag,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useFormatPrice } from '@/hooks/useFormatPrice'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}

export default function AdminDashboard() {
  const t = useTranslations('admin')
  const formatPrice = useFormatPrice()
  const { isAdmin, isLoading: authLoading } = useAdminAuth()
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) return

    fetch('/api/admin/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data)
      })
      .catch(() => undefined)
      .finally(() => setIsLoading(false))
  }, [isAdmin])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="md:hidden h-24" />
      <div className="hidden md:block h-24" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboardTitle')}</h1>
          <p className="text-gray-600">{t('dashboardSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label={t('statProducts')} value={stats.totalProducts} icon={<Package className="h-6 w-6 text-orange-500" />} bg="bg-orange-100" />
          <StatCard label={t('statOrders')} value={stats.totalOrders} icon={<ShoppingCart className="h-6 w-6 text-blue-500" />} bg="bg-blue-100" />
          <StatCard label={t('statUsers')} value={stats.totalUsers} icon={<Users className="h-6 w-6 text-green-500" />} bg="bg-green-100" />
          <StatCard label={t('statRevenue')} value={formatPrice(stats.totalRevenue)} icon={<DollarSign className="h-6 w-6 text-purple-500" />} bg="bg-purple-100" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('quickActions')}</h2>
            <div className="space-y-4">
              <ActionLink href="/admin/products" icon={<Package className="h-6 w-6 text-orange-500 mr-4" />} bg="bg-orange-50 hover:bg-orange-100" title={t('manageProductsTitle')} desc={t('manageProductsDesc')} />
              <ActionLink href="/admin/orders" icon={<ShoppingCart className="h-6 w-6 text-blue-500 mr-4" />} bg="bg-blue-50 hover:bg-blue-100" title={t('manageOrdersTitle')} desc={t('manageOrdersDesc')} />
              <ActionLink href="/admin/categories" icon={<Tag className="h-6 w-6 text-green-500 mr-4" />} bg="bg-green-50 hover:bg-green-100" title={t('manageCategoriesTitle')} desc={t('manageCategoriesDesc')} />
              <ActionLink href="/admin/settings" icon={<Settings className="h-6 w-6 text-purple-500 mr-4" />} bg="bg-purple-50 hover:bg-purple-100" title={t('manageSettingsTitle')} desc={t('manageSettingsDesc')} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('orderStatusBlock')}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                  <span className="font-medium text-gray-900">{t('pendingOrders')}</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="font-medium text-gray-900">{t('completedOrders')}</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.completedOrders}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  bg,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  bg: string
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>{icon}</div>
      </div>
    </div>
  )
}

function ActionLink({
  href,
  icon,
  bg,
  title,
  desc,
}: {
  href: string
  icon: React.ReactNode
  bg: string
  title: string
  desc: string
}) {
  return (
    <Link href={href} className={`flex items-center p-4 ${bg} rounded-xl transition-colors`}>
      {icon}
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </Link>
  )
}
