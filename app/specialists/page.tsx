'use client'

import { useState, useEffect } from 'react'
import { Users, Star, Award, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Psychologist {
  id: string
  specialization: string[]
  experienceYears: number
  price: number
  rating: number | null
  available: boolean
  user: {
    fullName: string | null
    avatarUrl: string | null
  }
}

export default function SpecialistsPage() {
  const [specialists, setSpecialists] = useState<Psychologist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSpecialists()
  }, [])

  const fetchSpecialists = async () => {
    try {
      const response = await fetch('/api/psychologists')
      if (response.ok) {
        const data = await response.json()
        setSpecialists(data.psychologists)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="section-title">Наши специалисты</h1>
          <p className="section-subtitle">
            Квалифицированные психологи с опытом работы с ПТСР
          </p>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Специализация
              </label>
              <select className="input-field">
                <option value="">Все специализации</option>
                <option value="ptsd">ПТСР</option>
                <option value="trauma">Травма</option>
                <option value="anxiety">Тревожные расстройства</option>
                <option value="depression">Депрессия</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Опыт работы
              </label>
              <select className="input-field">
                <option value="">Любой</option>
                <option value="5">От 5 лет</option>
                <option value="10">От 10 лет</option>
                <option value="15">От 15 лет</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Доступность
              </label>
              <select className="input-field">
                <option value="">Все</option>
                <option value="available">Доступны сейчас</option>
                <option value="soon">Скоро освободятся</option>
              </select>
            </div>
          </div>
        </div>

        {/* Список специалистов */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {specialists.map((specialist) => (
            <div key={specialist.id} className="card hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                {/* Аватар */}
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-12 h-12 text-primary-600" />
                </div>

                {/* Информация */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {specialist.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {specialist.rating} / 5.0
                        </span>
                      </div>
                    </div>
                    {specialist.available ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Доступен
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        Занят
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>Опыт: {specialist.experience} лет</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {specialist.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        {specialist.price}₽
                      </span>
                      <span className="text-sm text-gray-600">/сессия</span>
                    </div>
                    <Link
                      href={`/specialists/${specialist.id}`}
                      className="btn-primary text-sm py-2 px-4 inline-flex items-center space-x-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Записаться</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Информация о процессе */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Как проходит консультация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Выберите специалиста
              </h3>
              <p className="text-gray-600">
                Изучите профили психологов и выберите того, кто подходит вам
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Запишитесь на сессию
              </h3>
              <p className="text-gray-600">
                Выберите удобное время и оплатите консультацию
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Пройдите консультацию
              </h3>
              <p className="text-gray-600">
                Встретьтесь онлайн с психологом в назначенное время
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

