import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Clock, Users, Heart, Award, ChefHat, Truck } from 'lucide-react'

export default async function AboutPage() {
  const t = await getTranslations('about')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="h-48 md:h-32"></div>

      <section className="bg-orange-500 text-white py-24 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">{t('heroTitle')}</h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-24">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">{t('storyTitle')}</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>{t('storyP1')}</p>
              <p>{t('storyP2')}</p>
              <p>{t('storyP3')}</p>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">{t('valuesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('valuePassionTitle')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('valuePassionDesc')}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('valueQualityTitle')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('valueQualityDesc')}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('valueSpeedTitle')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('valueSpeedDesc')}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('valueCommunityTitle')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('valueCommunityDesc')}</p>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">{t('teamTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ChefHat className="h-16 w-16 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{t('chefTitle')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('chefDesc')}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="h-16 w-16 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{t('managerTitle')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('managerDesc')}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Truck className="h-16 w-16 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{t('deliveryTitle')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('deliveryDesc')}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-500 rounded-3xl p-16 text-white text-center mb-16">
          <h2 className="text-4xl font-bold mb-12">{t('statsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-6xl font-bold mb-4 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-xl text-orange-100">{t('statOrders')}</div>
            </div>
            <div className="group">
              <div className="text-6xl font-bold mb-4 group-hover:scale-110 transition-transform">15</div>
              <div className="text-xl text-orange-100">{t('statFlavors')}</div>
            </div>
            <div className="group">
              <div className="text-6xl font-bold mb-4 group-hover:scale-110 transition-transform">2</div>
              <div className="text-xl text-orange-100">{t('statBranches')}</div>
            </div>
            <div className="group">
              <div className="text-6xl font-bold mb-4 group-hover:scale-110 transition-transform">15-20</div>
              <div className="text-xl text-orange-100">{t('statCookTime')}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-16 shadow-lg mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">{t('processTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('step1Title')}</h3>
              <p className="text-gray-700">{t('step1Desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('step2Title')}</h3>
              <p className="text-gray-700">{t('step2Desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('step3Title')}</h3>
              <p className="text-gray-700">{t('step3Desc')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('step4Title')}</h3>
              <p className="text-gray-700">{t('step4Desc')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}
