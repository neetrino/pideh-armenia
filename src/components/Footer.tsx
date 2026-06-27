'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { DEFAULT_BRAND_ICON } from '@/lib/brand-assets'

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src={DEFAULT_BRAND_ICON}
                alt="Pideh Armenia Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <p className="text-gray-300 mb-4">{t('taglineLong')}</p>
            <div className="flex space-x-4">
              <a href="tel:+37495044888" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="mailto:info@pideh.am" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('navigation')}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-orange-500 transition-colors">
                  {nav('home')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-orange-500 transition-colors">
                  {nav('menu')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors">
                  {nav('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">
                  {nav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('contacts')}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <a href="tel:+37495044888" className="text-gray-300 hover:text-orange-500 transition-colors">
                  +374 95-044-888
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <a href="mailto:info@pideh.am" className="text-gray-300 hover:text-orange-500 transition-colors">
                  info@pideh.am
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <a
                    href="https://maps.google.com/?q=ул.+Зоравар+Андраник+151/2,+Ереван,+Армения"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    ул. Зоравар Андраник 151/2
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <a
                    href="https://maps.google.com/?q=ул.+Езник+Кохбаци+83,+Ереван,+Армения"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    ул. Езник Кохбаци 83
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div className="text-gray-300">
                  <div>{t('hours')}</div>
                  <div className="text-sm">{t('deliveryHours')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p className="text-sm font-light tracking-wide">
            {t('copyright')}{' '}
            <a
              href="https://neetrino.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 transition-colors font-normal"
            >
              Neetrino IT Company
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
