'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UserSidebar from '@/components/UserSidebar'
import { BookOpen, Clock, Award, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'

interface Enrollment {
  id: string
  progress: number
  completed: boolean
  enrolledAt: string
  course: {
    id: string
    title: string
    slug: string
    description: string
    durationWeeks: number
    level: string
    price: number
    coverImage: string | null
    _count: {
      modules: number
    }
  }
}

export default function MyCoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchEnrollments()
    }
  }, [status, router])

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/user/enrollments')
      if (response.ok) {
        const data = await response.json()
        setEnrollments(data.enrollments)
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-teal"></div>
      </div>
    )
  }

  const activeEnrollments = enrollments.filter(e => !e.completed)
  const completedEnrollments = enrollments.filter(e => e.completed)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-12">
      <div className="container-custom">
        <div className="flex gap-6">
          {/* Боковая панель */}
          <UserSidebar />

          {/* Основной контент */}
          <div className="flex-1">
            {/* Заголовок */}
            <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            Мои курсы
          </h1>
          <p className="text-xl text-gray-600 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Продолжайте обучение и отслеживайте свой прогресс
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-up">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{enrollments.length}</div>
                <div className="text-sm text-gray-600">Всего курсов</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{activeEnrollments.length}</div>
                <div className="text-sm text-gray-600">В процессе</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{completedEnrollments.length}</div>
                <div className="text-sm text-gray-600">Завершено</div>
              </div>
            </div>
          </div>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center animate-scale-in">
            <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              У вас пока нет курсов
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Начните своё обучение прямо сейчас! Выберите подходящий курс из нашего каталога.
            </p>
            <Link
              href="/programs"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              <span>Перейти к курсам</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Активные курсы */}
            {activeEnrollments.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Активные курсы
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {activeEnrollments.map((enrollment, index) => (
                    <div
                      key={enrollment.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-slide-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Изображение */}
                      <div className="relative h-48 overflow-hidden">
                        {enrollment.course.coverImage ? (
                          <img
                            src={enrollment.course.coverImage}
                            alt={enrollment.course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                            <BookOpen className="w-20 h-20 text-white opacity-80" />
                          </div>
                        )}
                        
                        {/* Прогресс бар поверх изображения */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white text-sm font-medium">Прогресс</span>
                            <span className="text-white text-sm font-bold">{enrollment.progress}%</span>
                          </div>
                          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-500"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Информация */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                          {enrollment.course.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {enrollment.course.description}
                        </p>

                        {/* Характеристики */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-teal-600" />
                            <span>{enrollment.course.durationWeeks} недель</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span>{enrollment.course._count.modules} модулей</span>
                          </div>
                          <div className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                            {enrollment.course.level}
                          </div>
                        </div>

                        {/* Кнопка */}
                        <Link
                          href={`/learn/${enrollment.course.slug}`}
                          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                          <span>Продолжить обучение</span>
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Завершённые курсы */}
            {completedEnrollments.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Завершённые курсы
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {completedEnrollments.map((enrollment, index) => (
                    <div
                      key={enrollment.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {enrollment.course.coverImage ? (
                          <img
                            src={enrollment.course.coverImage}
                            alt={enrollment.course.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                            <BookOpen className="w-20 h-20 text-white opacity-80" />
                          </div>
                        )}
                        
                        {/* Бейдж завершения */}
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-bold">Завершён</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {enrollment.course.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {enrollment.course.description}
                        </p>

                        <Link
                          href={`/programs/${enrollment.course.slug}`}
                          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                          <Award className="w-5 h-5" />
                          <span>Посмотреть сертификат</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}

