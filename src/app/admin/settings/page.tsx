'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Settings, Save, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { DEFAULT_BRAND_ICON_PATH } from '@/lib/brand-assets'

interface SiteSettings {
  logo?: string
  siteName?: string
  siteDescription?: string
  contactPhone?: string
  contactEmail?: string
  address?: string
}

export default function AdminSettings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<SiteSettings>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/login')
      return
    }

    fetchSettings()
  }, [session, status, router])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      // Сохраняем каждую настройку отдельно
      const promises = Object.entries(settings).map(([key, value]) =>
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key, value }),
        })
      )

      await Promise.all(promises)
      setMessage({ type: 'success', text: 'Настройки успешно сохранены!' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage({ type: 'error', text: 'Ошибка при сохранении настроек' })
    } finally {
      setIsSaving(false)
    }
  }

  const updateSetting = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateLogo = () => {
    // Логотип обновляется автоматически через API
    setMessage({ type: 'success', text: 'Логотип успешно обновлен!' })
    // Обновляем страницу через 1 секунду, чтобы показать новый логотип
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Отступ для fixed хедера */}
      <div className="md:hidden h-24"></div>
      <div className="hidden md:block h-24"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/admin" 
              className="mr-4 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 mr-3 text-orange-500" />
                Настройки сайта
              </h1>
              <p className="text-gray-600">Управление логотипом и основными настройками</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Settings Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-8">
            {/* Logo Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="h-6 w-6 mr-2 text-orange-500" />
                Логотип сайта
              </h2>
              <p className="text-gray-600 mb-4">
                Загрузите новый логотип для сайта. Рекомендуемый размер: 180x60px
              </p>
              
              {/* Текущий логотип */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Текущий логотип:</p>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <img 
                    src={DEFAULT_BRAND_ICON_PATH} 
                    alt="Current Logo" 
                    className="h-16 w-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              </div>

              <ImageUpload
                currentImage={DEFAULT_BRAND_ICON_PATH}
                onImageChange={(url) => {
                  // Обновляем логотип через специальный API
                  updateLogo()
                }}
                onImageRemove={() => {
                  // Можно добавить функцию сброса к дефолтному логотипу
                  console.log('Reset to default logo')
                }}
                maxSize={2}
                className="max-w-md"
              />
            </div>

            {/* Site Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Информация о сайте
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название сайта
                  </label>
                  <input
                    type="text"
                    value={settings.siteName || ''}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Pideh Armenia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={settings.contactPhone || ''}
                    onChange={(e) => updateSetting('contactPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="+374 XX XXX XXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail || ''}
                    onChange={(e) => updateSetting('contactEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="info@pideh.am"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => updateSetting('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ереван, Армения"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание сайта
                </label>
                <textarea
                  value={settings.siteDescription || ''}
                  onChange={(e) => updateSetting('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Описание вашего бизнеса..."
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className={`
                flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300
                ${isSaving
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg'
                }
              `}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              {isSaving ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

