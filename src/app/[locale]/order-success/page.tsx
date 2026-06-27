'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CheckCircle, Clock, Phone, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function OrderSuccessPage() {
  const t = useTranslations('orderSuccess')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-24 md:h-20" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{t('subtitle')}</p>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('whatsNext')}</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">{t('stepConfirmTitle')}</h3>
                  <p className="text-gray-600">{t('stepConfirmDesc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">{t('stepCookTitle')}</h3>
                  <p className="text-gray-600">{t('stepCookDesc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">{t('stepDeliveryTitle')}</h3>
                  <p className="text-gray-600">{t('stepDeliveryDesc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('helpTitle')}</h3>
            <p className="text-gray-600 mb-4">{t('helpDesc')}</p>
            <a
              href="tel:+37495044888"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-lg"
            >
              <Phone className="h-5 w-5 mr-2" />
              +374 95-044-888
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              {t('backHome')}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-white text-orange-500 border-2 border-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
            >
              {t('viewMenu')}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
