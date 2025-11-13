'use client'

import { Heart, Users, BookOpen, Award, CheckCircle } from 'lucide-react'

export default function DonatePage() {
  const donationOptions = [
    { amount: 500, description: 'Поддержка на месяц' },
    { amount: 1000, description: 'Помощь одному человеку' },
    { amount: 5000, description: 'Создание нового контента' },
    { amount: 10000, description: 'Бесплатная консультация для нуждающихся' },
  ]

  const impactAreas = [
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Бесплатные консультации',
      description: 'Предоставление психологической помощи для тех, кто не может себе это позволить',
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary-600" />,
      title: 'Образовательные материалы',
      description: 'Создание качественного контента о ПТСР и методах восстановления',
    },
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: 'Развитие платформы',
      description: 'Улучшение функционала и создание новых инструментов',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="section-title">Поддержите наш проект</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Ваша поддержка помогает нам предоставлять качественную психологическую помощь 
            людям, страдающим от ПТСР
          </p>
        </div>

        {/* Варианты пожертвований */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Выберите сумму пожертвования
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {donationOptions.map((option, index) => (
                <button
                  key={index}
                  className="border-2 border-primary-600 rounded-lg p-6 hover:bg-primary-50 transition-colors text-left"
                >
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {option.amount}₽
                  </div>
                  <div className="text-sm text-gray-600">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Или введите свою сумму
              </label>
              <div className="flex gap-4">
                <input
                  type="number"
                  min="100"
                  placeholder="Введите сумму"
                  className="input-field flex-1"
                />
                <button className="btn-primary whitespace-nowrap">
                  Поддержать
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-start space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p>
                Мы принимаем платежи через безопасные платежные системы. 
                Ваши данные защищены.
              </p>
            </div>
          </div>
        </div>

        {/* На что идут средства */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            На что идут ваши пожертвования
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {impactAreas.map((area, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-primary-100 rounded-lg p-4">
                    {area.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Статистика */}
        <div className="bg-primary-600 text-white rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Наши достижения
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,234</div>
              <div className="text-primary-100">Человек получили помощь</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">156</div>
              <div className="text-primary-100">Бесплатных консультаций</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">42</div>
              <div className="text-primary-100">Образовательных программ</div>
            </div>
          </div>
        </div>

        {/* Альтернативные способы поддержки */}
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Другие способы помочь
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Станьте волонтером
                </h3>
                <p className="text-gray-600">
                  Помогайте модерировать контент, отвечать на вопросы или делиться своим опытом
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Расскажите о нас
                </h3>
                <p className="text-gray-600">
                  Поделитесь информацией о платформе с теми, кому может понадобиться помощь
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Оставьте отзыв
                </h3>
                <p className="text-gray-600">
                  Ваш отзыв поможет другим людям узнать о нашей работе
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

