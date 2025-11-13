'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Clock, Award, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  durationWeeks: number
  level: string
  price: number
  coverImage: string | null
  _count: { modules: number }
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setPrograms(data.courses)
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

  const benefits = [
    'Структурированный подход к восстановлению',
    'Доступ к материалам 24/7',
    'Практические упражнения и задания',
    'Поддержка психологов',
    'Сертификат о прохождении',
    'Пожизненный доступ к материалам',
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="section-title">Образовательные программы</h1>
          <p className="section-subtitle">
            Структурированные курсы для эффективного восстановления
          </p>
        </div>

          {/* Список программ */}
          {programs.length === 0 ? (
            <div className="card text-center py-12 mb-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Программы в разработке</h3>
              <p className="text-gray-600">Скоро здесь появятся программы восстановления</p>
            </div>
          ) : (
            <div className="space-y-6 mb-12">
              {programs.map((program) => (
                <div key={program.id} className="card hover:shadow-xl transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Изображение программы */}
                    <div className="lg:col-span-1">
                      {program.coverImage ? (
                        <img src={program.coverImage} alt={program.title} className="rounded-lg h-48 w-full object-cover" />
                      ) : (
                        <div className="bg-primary-100 rounded-lg h-48 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-primary-600" />
                        </div>
                      )}
                    </div>

                    {/* Информация о программе */}
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {program.title}
                          </h3>
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                            {program.level}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{program.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-primary-600" />
                          <span>{program.durationWeeks} недель</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpen className="w-4 h-4 mr-2 text-primary-600" />
                          <span>{program._count.modules} модулей</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="w-4 h-4 mr-2 text-primary-600" />
                          <span>Сертификат</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-3xl font-bold text-gray-900">
                            {program.price.toLocaleString()}₽
                          </span>
                        </div>
                        <Link
                          href={`/programs/${program.slug}`}
                          className="btn-primary inline-flex items-center space-x-2"
                        >
                          <span>Подробнее</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Преимущества */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Почему выбирают наши программы
            </h2>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-primary-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Не знаете, с чего начать?
            </h3>
            <p className="text-gray-600 mb-6">
              Пройдите бесплатную оценку тревожности, и мы порекомендуем подходящую программу
            </p>
            <Link
              href="/resources/anxiety-assessment"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Пройти оценку</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Процесс обучения */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Как проходит обучение
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Регистрация</h3>
              <p className="text-sm text-gray-600">
                Зарегистрируйтесь и выберите программу
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Обучение</h3>
              <p className="text-sm text-gray-600">
                Изучайте материалы в удобном темпе
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Практика</h3>
              <p className="text-sm text-gray-600">
                Выполняйте упражнения и задания
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Сертификат</h3>
              <p className="text-sm text-gray-600">
                Получите сертификат о прохождении
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

