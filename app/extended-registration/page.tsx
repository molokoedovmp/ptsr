'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function ExtendedRegistrationPage() {
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: '',
    country: 'Россия',
    city: '',
    referralSource: '',
    interests: [] as string[],
    newsletterConsent: false,
  })
  const router = useRouter()

  const interestOptions = [
    'Управление тревожностью',
    'Работа с травмой',
    'Медитация и осознанность',
    'Дневник настроения',
    'Образовательные программы',
    'Консультации со специалистами',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleInterestToggle = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter(i => i !== interest)
        : [...formData.interests, interest],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // В реальном приложении здесь будет сохранение в БД
    router.push('/profile')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom max-w-3xl">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Добро пожаловать!</h1>
            <p className="text-gray-600 mt-2">
              Расскажите немного о себе, чтобы мы могли персонализировать ваш опыт
            </p>
          </div>

          {/* Информационное сообщение */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  Эта информация поможет нам предложить вам наиболее подходящие программы и ресурсы. 
                  Все данные конфиденциальны и защищены.
                </p>
              </div>
            </div>
          </div>

          {/* Форма */}
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Дата рождения (опционально)
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Пол (опционально)
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Не указано</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                    <option value="other">Другой</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Страна
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Город (опционально)
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Москва"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700 mb-2">
                  Как вы узнали о нас? (опционально)
                </label>
                <select
                  id="referralSource"
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Выберите вариант</option>
                  <option value="search">Поисковые системы</option>
                  <option value="social">Социальные сети</option>
                  <option value="recommendation">Рекомендация друга</option>
                  <option value="specialist">От специалиста</option>
                  <option value="article">Статья/блог</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Что вас интересует? (опционально)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {interestOptions.map((interest) => (
                    <label key={interest} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestToggle(interest)}
                        className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.newsletterConsent}
                    onChange={(e) => setFormData({ ...formData, newsletterConsent: e.target.checked })}
                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Я хочу получать новостную рассылку с полезными статьями, 
                    советами и обновлениями платформы
                  </span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Завершить регистрацию
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="flex-1 btn-secondary"
                >
                  Пропустить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

