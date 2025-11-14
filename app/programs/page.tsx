'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Clock, Award, CheckCircle, ArrowRight, Star, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-teal"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Hero секция */}
      <div className="relative bg-gradient-to-r from-teal-600 via-teal-500 to-blue-600 text-white overflow-hidden">
        {/* Анимированный фон */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-sm font-medium">Более 1000 успешных выпускников</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Образовательные программы
              <span className="block text-yellow-300 mt-2">для вашего восстановления</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-teal-50 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Профессиональные курсы с научным подходом, разработанные экспертами
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <BookOpen className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-2xl font-bold">{programs.length}</div>
                  <div className="text-sm text-teal-100">Программ</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <Users className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm text-teal-100">Студентов</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg">
                <TrendingUp className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-sm text-teal-100">Результат</div>
                </div>
              </div>
            </div>

            <Link
              href="#programs"
              className="inline-flex items-center space-x-2 bg-white text-teal-600 px-8 py-4 rounded-full font-semibold hover:bg-teal-50 transform hover:scale-105 transition-all shadow-xl hover:shadow-2xl animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              <span>Выбрать программу</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Список программ */}
        <div id="programs" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
              Наши программы
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Выберите программу, которая подходит именно вам
            </p>
          </div>

          {programs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center animate-scale-in">
              <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Программы в разработке</h3>
              <p className="text-gray-600">Скоро здесь появятся программы восстановления</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {programs.map((program, index) => (
                <div 
                  key={program.id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Изображение программы */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {program.coverImage ? (
                      <Image 
                        src={program.coverImage} 
                        alt={program.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                        <BookOpen className="w-24 h-24 text-white opacity-80" />
                      </div>
                    )}
                    
                    {/* Бейдж уровня */}
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-teal-700 text-sm font-bold rounded-full shadow-lg">
                        {program.level}
                      </span>
                    </div>
                  </div>

                  {/* Информация о программе */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                      {program.title}
                    </h3>

                    <p className="text-gray-600 mb-6 line-clamp-2">
                      {program.description}
                    </p>

                    {/* Характеристики */}
                    <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Длительность</div>
                          <div className="font-semibold">{program.durationWeeks} недель</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-700">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Модулей</div>
                          <div className="font-semibold">{program._count.modules}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-gray-700">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Сертификат</div>
                          <div className="font-semibold">Да</div>
                        </div>
                      </div>
                    </div>

                    {/* Цена и кнопка */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Стоимость</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                          {program.price.toLocaleString()}₽
                        </div>
                      </div>
                      
                      <Link
                        href={`/programs/${program.slug}`}
                        className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                      >
                        <span>Подробнее</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Преимущества */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 animate-fade-in">
              Почему выбирают наши программы
            </h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li 
                  key={index} 
                  className="flex items-start space-x-4 animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-transform animate-scale-in">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-yellow-300" />
              </div>
              
              <h3 className="text-3xl font-bold mb-4">
                Не знаете, с чего начать?
              </h3>
              
              <p className="text-teal-50 mb-8 text-lg">
                Пройдите бесплатную оценку тревожности, и мы порекомендуем подходящую программу
              </p>
              
              <Link
                href="/resources/anxiety-assessment"
                className="inline-flex items-center space-x-2 bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transform hover:scale-105 transition-all shadow-lg"
              >
                <span>Пройти оценку</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Процесс обучения */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
              Как проходит обучение
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Простой и понятный процесс от начала до получения результата
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                {/* Линия соединения */}
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-teal-400 to-blue-400"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Регистрация</h3>
              <p className="text-gray-600">
                Зарегистрируйтесь и выберите подходящую программу
              </p>
            </div>
            
            <div className="text-center group animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Обучение</h3>
              <p className="text-gray-600">
                Изучайте материалы в удобном темпе 24/7
              </p>
            </div>
            
            <div className="text-center group animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Практика</h3>
              <p className="text-gray-600">
                Выполняйте упражнения и закрепляйте навыки
              </p>
            </div>
            
            <div className="text-center group animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                  <span className="text-3xl font-bold text-white">4</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Сертификат</h3>
              <p className="text-gray-600">
                Получите официальный сертификат о прохождении
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

