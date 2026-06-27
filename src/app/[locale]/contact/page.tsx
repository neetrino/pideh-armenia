import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Phone, Mail, MapPin, Clock, MessageCircle, Star, Calendar, CreditCard } from 'lucide-react'

export default async function ContactPage() {
  const t = await getTranslations('contact')
  const tf = await getTranslations('footer')

  const faqItems = [
    { icon: Clock, q: t('faq1Q'), a: t('faq1A') },
    { icon: MapPin, q: t('faq2Q'), a: t('faq2A') },
    { icon: Calendar, q: t('faq3Q'), a: t('faq3A') },
    { icon: CreditCard, q: t('faq4Q'), a: t('faq4A') },
    { icon: Star, q: t('faq5Q'), a: t('faq5A') },
    { icon: MessageCircle, q: t('faq6Q'), a: t('faq6A') },
  ]

  const reviews = [
    { emoji: '😋', text: t('review1'), author: t('review1Author') },
    { emoji: '🔥', text: t('review2'), author: t('review2Author') },
    { emoji: '⭐', text: t('review3'), author: t('review3Author') },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="h-48 md:h-32"></div>

      <section className="bg-orange-500 text-white py-20 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('heroTitle')}</h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">{t('heroSubtitle')}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('phoneLabel')}</h3>
            <p className="text-gray-600 mb-2">+374 95-044-888</p>
            <p className="text-sm text-gray-500">{tf('hours')}</p>
            <a
              href="tel:+37495044888"
              className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t('call')}
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('emailLabel')}</h3>
            <p className="text-gray-600 mb-2">info@pideh-armenia.am</p>
            <p className="text-sm text-gray-500">{t('replyTime')}</p>
            <a
              href="mailto:info@pideh-armenia.am"
              className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t('write')}
            </a>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t('hoursLabel')}</h3>
            <p className="text-gray-600 mb-2">{tf('hours')}</p>
            <p className="text-sm text-gray-500">{tf('deliveryHours')}</p>
          </div>
        </div>

        <div className="bg-orange-500 rounded-2xl p-8 text-white text-center mb-16">
          <h2 className="text-2xl font-bold mb-4">{t('quickOrderTitle')}</h2>
          <p className="text-lg text-orange-100 mb-6">{t('quickOrderDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+37495044888"
              className="bg-white text-orange-500 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>{t('callWithNumber')}</span>
            </a>
            <a
              href="https://www.facebook.com/PIDEH.Armenia/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/pideh.armenia/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z" />
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">{t('branchesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-orange-500" />
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-orange-500" />
                <p className="text-gray-600 text-lg font-semibold">{t('address1')}</p>
              </div>
              <a
                href="https://maps.google.com/?q=ул.+Зоравар+Андраник+151/2,+Ереван,+Армения"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                {t('onMap')}
              </a>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-10 w-10 text-orange-500" />
              </div>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-orange-500" />
                <p className="text-gray-600 text-lg font-semibold">{t('address2')}</p>
              </div>
              <a
                href="https://maps.google.com/?q=ул.+Езник+Кохбаци+83,+Ереван,+Армения"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                {t('onMap')}
              </a>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('faqTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {faqItems.map(({ icon: Icon, q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{q}</h3>
                <p className="text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">{t('testimonialsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map(({ emoji, text, author }) => (
              <div key={author} className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{emoji}</span>
                </div>
                <p className="text-gray-600 mb-4">{text}</p>
                <p className="font-semibold text-gray-900">{author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}
