import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Clock, Users, Heart, Award, ChefHat, Truck, Star, CheckCircle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Отступ для fixed хедера */}
      <div className="h-48 md:h-32"></div>
      
      {/* Hero Section */}
      <section className="bg-orange-500 text-white py-24 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            О Pideh Armenia
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto leading-relaxed">
            Мы создаем уникальные армянские пиде, 
            сочетая традиционные рецепты с современными вкусами.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story Section */}
        <div className="mb-24">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Наша история</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Пидех Армения родился из любви к традиционной армянской кухне и желания 
                создать что-то уникальное для армянского рынка. Мы создали новый 
                продукт - армянские пиде, наполнив их начинками, которые любят 
                современные гурманы.
              </p>
              <p>
                Каждая наша "лодочка" готовится вручную с использованием только 
                свежих ингредиентов. Мы не используем замороженные полуфабрикаты 
                или консерванты - только натуральные продукты и традиционные 
                методы приготовления.
              </p>
              <p>
                За короткое время мы стали любимым местом для тех, кто ценит 
                качество, вкус и оригинальность. Наша миссия - привнести 
                в Ереван новые вкусы, сохраняя при этом уважение к традициям.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Наши ценности</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Любовь к делу</h3>
              <p className="text-gray-700 leading-relaxed">
                Каждое блюдо готовится с душой и вниманием к деталям
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Качество</h3>
              <p className="text-gray-700 leading-relaxed">
                Используем только лучшие ингредиенты и проверенные рецепты
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Скорость</h3>
              <p className="text-gray-700 leading-relaxed">
                Готовим быстро, но не в ущерб качеству и вкусу
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Сообщество</h3>
              <p className="text-gray-700 leading-relaxed">
                Создаем место, где собираются любители вкусной еды
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Наша команда</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ChefHat className="h-16 w-16 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Главный повар</h3>
              <p className="text-gray-700 leading-relaxed">
                С 15-летним опытом работы в лучших ресторанах Еревана. 
                Знает секреты идеального теста и начинки.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="h-16 w-16 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Менеджер</h3>
              <p className="text-gray-700 leading-relaxed">
                Обеспечивает отличный сервис и качество обслуживания. 
                Всегда поможет с выбором и ответит на вопросы.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="w-32 h-32 bg-orange-200 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Truck className="h-16 w-16 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Доставка</h3>
              <p className="text-gray-700 leading-relaxed">
                Быстрая и аккуратная доставка по всему Еревану. 
                Ваш заказ прибудет горячим и свежим.
              </p>
            </div>
          </div>
        </div>


        {/* Stats Section */}
        <div className="bg-orange-500 rounded-3xl p-16 text-white text-center mb-16">
          <h2 className="text-4xl font-bold mb-12">Pideh Armenia в цифрах</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-6xl font-bold mb-4 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-xl text-orange-100">Заказов в день</div>
            </div>
            <div className="group">
              <div className="text-6xl font-bold mb-4 group-hover:scale-110 transition-transform">15</div>
              <div className="text-xl text-orange-100">Уникальных вкусов</div>
            </div>
            <div className="group">
              <div className="text-6xl font-bold mb-4 group-hover:scale-110 transition-transform">2</div>
              <div className="text-xl text-orange-100">Филиала в Ереване</div>
            </div>
            <div className="group">
              <div className="text-6xl font-bold mb-4 group-hover:scale-110 transition-transform">15-20</div>
              <div className="text-xl text-orange-100">Минут приготовления</div>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-3xl p-16 shadow-lg mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Как мы готовим</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Выбор ингредиентов</h3>
              <p className="text-gray-700">Каждое утро выбираем только свежие продукты</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Приготовление теста</h3>
              <p className="text-gray-700">Замешиваем тесто по традиционному рецепту</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Формирование</h3>
              <p className="text-gray-700">Вручную формируем лодочки и добавляем начинку</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-500">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Выпечка</h3>
              <p className="text-gray-700">Выпекаем до золотистой корочки</p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Hide Footer on Mobile */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  )
}